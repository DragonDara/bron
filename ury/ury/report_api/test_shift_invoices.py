from datetime import datetime, timedelta
from unittest.mock import patch

import frappe
from frappe.tests.utils import FrappeTestCase

from ury.ury.report_api import shift_invoices

MODULE = "ury.ury.report_api.shift_invoices"
TEST_NON_MANAGER = "_test_ury_shift_invoices_non_manager@example.com"


def _dispatch(responses):
	"""frappe.db.sql side_effect: returns the first response whose marker
	appears in the query text."""

	def side_effect(query, *args, **kwargs):
		for marker, value in responses:
			if marker in query:
				return value
		return []

	return side_effect


class TestRequireManagerGate(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")
		if not frappe.db.exists("User", TEST_NON_MANAGER):
			frappe.get_doc({
				"doctype": "User",
				"email": TEST_NON_MANAGER,
				"first_name": "NonManager",
				"send_welcome_email": 0,
				"roles": [{"role": "Employee"}],
			}).insert(ignore_permissions=True)

	def tearDown(self):
		frappe.set_user("Administrator")

	def test_get_shifts_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			shift_invoices.get_shifts("2026-09-01", "2026-09-30")

	def test_get_shift_invoices_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			shift_invoices.get_shift_invoices("POS-OPE-0001")

	def test_get_period_invoices_denied(self):
		frappe.set_user(TEST_NON_MANAGER)
		with self.assertRaises(frappe.PermissionError):
			shift_invoices.get_period_invoices("2026-09-01", "2026-09-30")


class TestHelpers(FrappeTestCase):
	def test_format_time_from_timedelta(self):
		self.assertEqual(shift_invoices._format_time(timedelta(hours=8, minutes=5, seconds=59)), "08:05")
		self.assertEqual(shift_invoices._format_time(None), "")

	def test_shift_info_closed(self):
		opening = {
			"name": "POS-OPE-0001",
			"pos_profile": "Wash POS",
			"user": "cashier@example.com",
			"user_name": "Aidos",
			"status": "Closed",
			"period_start_date": datetime(2026, 9, 29, 8, 2),
		}
		info = shift_invoices._shift_info(opening, datetime(2026, 9, 29, 20, 15))
		self.assertFalse(info["is_open"])
		self.assertFalse(info["is_long"])
		self.assertEqual(info["end"], "2026-09-29 20:15:00")
		self.assertEqual(info["cashier_name"], "Aidos")

	def test_shift_info_open_and_long(self):
		opening = {
			"name": "POS-OPE-0002",
			"pos_profile": "Wash POS",
			"user": "cashier@example.com",
			"status": "Open",
			"period_start_date": datetime(2026, 9, 27, 8, 0),
		}
		info = shift_invoices._shift_info(opening, None, now=datetime(2026, 9, 29, 9, 0))
		self.assertTrue(info["is_open"])
		self.assertTrue(info["is_long"])
		self.assertIsNone(info["end"])
		self.assertEqual(info["cashier_name"], "cashier@example.com")

	def test_attach_items_sums_qty_and_dedupes_courses(self):
		rows = [{"invoice": "INV-1"}, {"invoice": "INV-2"}]
		item_rows = [
			{"invoice": "INV-1", "item_name": "Body wash", "qty": 1, "course": "Sedan"},
			{"invoice": "INV-1", "item_name": "Mats", "qty": 1, "course": "Sedan"},
			{"invoice": "INV-1", "item_name": "Mats", "qty": 1, "course": "Sedan"},
			{"invoice": "INV-2", "item_name": "Complex", "qty": -1, "course": "SUV"},
		]
		with patch(f"{MODULE}.frappe.db.sql", return_value=item_rows):
			shift_invoices._attach_items(rows)

		self.assertEqual(rows[0]["courses"], ["Sedan"])
		self.assertEqual(
			rows[0]["items"],
			[{"item_name": "Body wash", "qty": 1}, {"item_name": "Mats", "qty": 2}],
		)
		self.assertEqual(rows[1]["items"], [{"item_name": "Complex", "qty": 1}])


class TestGetShifts(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def test_latest_closing_end_wins_across_closing_doctypes(self):
		openings = [{
			"name": "POS-OPE-0001",
			"branch": "Main",
			"pos_profile": "Wash POS",
			"user": "cashier@example.com",
			"user_name": "Aidos",
			"status": "Closed",
			"period_start_date": datetime(2026, 9, 29, 8, 0),
		}]
		ends = [
			{"opening": "POS-OPE-0001", "period_end": datetime(2026, 9, 29, 19, 0)},
			{"opening": "POS-OPE-0001", "period_end": datetime(2026, 9, 29, 20, 30)},
		]
		with patch(
			f"{MODULE}.frappe.db.sql",
			side_effect=_dispatch([("tabPOS Opening Entry", openings), ("tabPOS Closing Entry", ends)]),
		) as mock_sql:
			result = shift_invoices.get_shifts("2026-09-01", "2026-09-30", branch="Main")

		self.assertEqual(len(result["shifts"]), 1)
		self.assertEqual(result["shifts"][0]["end"], "2026-09-29 20:30:00")
		self.assertIn("o.`branch` = %(branch)s", mock_sql.call_args_list[0].args[0])

	def test_no_openings_skips_closing_lookup(self):
		with patch(f"{MODULE}.frappe.db.sql", return_value=[]) as mock_sql:
			result = shift_invoices.get_shifts("2026-09-01", "2026-09-30")

		self.assertEqual(result["shifts"], [])
		mock_sql.assert_called_once()


class TestGetShiftInvoices(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def _opening(self, **overrides):
		return {
			"name": "POS-OPE-0001",
			"branch": "Main",
			"pos_profile": "Wash POS",
			"user": "cashier@example.com",
			"user_name": "Aidos",
			"status": "Closed",
			"docstatus": 1,
			"period_start_date": datetime(2026, 9, 29, 8, 0),
			**overrides,
		}

	def test_unknown_shift_raises(self):
		with patch(f"{MODULE}.frappe.db.sql", return_value=[]):
			with self.assertRaises(frappe.DoesNotExistError):
				shift_invoices.get_shift_invoices("POS-OPE-404")

	def test_rows_numbered_and_summary_excludes_returns_from_count(self):
		invoices = [
			{"invoice": "INV-1", "posting_date": "2026-09-29", "posting_time": timedelta(hours=9),
			 "employee": "EMP-1", "employee_name": "Erlan", "paid_amount": 7000, "is_return": 0, "on_credit": 0},
			{"invoice": "INV-2", "posting_date": "2026-09-29", "posting_time": timedelta(hours=10),
			 "employee": "EMP-2", "employee_name": None, "paid_amount": 9000, "is_return": 0, "on_credit": 1},
			{"invoice": "INV-3", "posting_date": "2026-09-29", "posting_time": timedelta(hours=11),
			 "employee": "EMP-1", "employee_name": "Erlan", "paid_amount": -7000, "is_return": 1, "on_credit": 0},
		]
		responses = [
			("tabPOS Invoice Item", []),
			("FROM `tabPOS Invoice` b", invoices),
			("MAX(`period_end_date`)", [{"opening": "POS-OPE-0001", "period_end": datetime(2026, 9, 29, 20, 0)}]),
			("tabPOS Opening Entry", [self._opening()]),
		]
		with patch(f"{MODULE}.frappe.db.sql", side_effect=_dispatch(responses)) as mock_sql:
			result = shift_invoices.get_shift_invoices("POS-OPE-0001")

		self.assertEqual([r["row_no"] for r in result["invoices"]], [1, 2, 3])
		self.assertEqual(result["invoices"][0]["posting_time"], "09:00")
		self.assertEqual(result["invoices"][1]["employee_name"], "EMP-2")
		self.assertEqual(result["summary"]["invoice_count"], 2)
		self.assertEqual(result["summary"]["total_paid"], 9000)
		self.assertEqual(result["summary"]["average_ticket"], 8000)
		self.assertEqual(result["summary"]["credit_total"], 9000)
		self.assertFalse(result["truncated"])
		self.assertFalse(result["shift"]["is_open"])

		invoice_sql = next(c.args[0] for c in mock_sql.call_args_list if "FROM `tabPOS Invoice` b" in c.args[0])
		self.assertIn("b.`pos_profile` = %(pos_profile)s", invoice_sql)
		self.assertIn("tabPOS Invoice Reference", invoice_sql)
		self.assertIn("tabSub POS Invoices", invoice_sql)


class TestGetPeriodInvoices(FrappeTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def test_row_numbers_continue_across_pages_and_null_totals_are_zero(self):
		totals = [{"total_rows": 0, "invoice_count": None, "sales_total": None, "total_paid": None, "credit_total": None}]
		rows = [
			{"invoice": "INV-51", "posting_date": "2026-09-02", "posting_time": timedelta(hours=12),
			 "employee": None, "employee_name": None, "paid_amount": 5000, "is_return": 0, "on_credit": 0},
		]
		responses = [
			("tabPOS Invoice Item", []),
			("COUNT(*) AS total_rows", totals),
			("FROM `tabPOS Invoice` b", rows),
		]
		with patch(f"{MODULE}.frappe.db.sql", side_effect=_dispatch(responses)):
			result = shift_invoices.get_period_invoices("2026-09-01", "2026-09-30", page=2, page_size=50)

		self.assertEqual(result["invoices"][0]["row_no"], 51)
		self.assertEqual(result["summary"], {"invoice_count": 0, "total_paid": 0, "average_ticket": 0, "credit_total": 0})
		self.assertEqual(result["pagination"]["total_pages"], 0)

	def test_branch_scoped_query_uses_report_settings(self):
		totals = [{"total_rows": 0}]
		with patch(
			f"{MODULE}.frappe.db.sql",
			side_effect=_dispatch([("COUNT(*) AS total_rows", totals)]),
		) as mock_sql:
			shift_invoices.get_period_invoices("2026-09-01", "2026-09-30", branch="Main")

		totals_sql = mock_sql.call_args_list[0].args[0]
		self.assertIn("b.`branch` = %(branch)s", totals_sql)
		self.assertIn("tabURY Report Settings", totals_sql)
