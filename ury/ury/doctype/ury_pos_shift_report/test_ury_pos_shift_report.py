"""Tests for the internal cash shift report (`ury_cash_shift_report`).

Mock-based, like `test_ury_pos_closing_entry.py`: what is pinned here is the
aggregation arithmetic and the hook control flow, not ERPNext's closing
machinery.
"""

from unittest.mock import MagicMock, patch

import frappe
from frappe.tests.utils import FrappeTestCase

from ury.ury.api.ury_cash_shift_report import (
	DEFAULT_PRINT_FORMAT,
	build_shift_totals,
	create_shift_report,
	get_shift_report_print_format,
	get_shift_report_print_info,
	network_print_shift_report,
	regenerate_shift_report,
	shift_report_print_options,
)
from ury.ury.hooks.ury_pos_profile import validate_print_formats
from ury.ury.utils.print_format_scope import validate_print_format_doctype

MODULE = "ury.ury.api.ury_cash_shift_report"
REPORT_DOCTYPE_NAME = "URY POS Shift Report"
SCOPE_MODULE = "ury.ury.utils.print_format_scope"
CASH_ACCOUNT = "Cash - U"


def _invoice(name, is_return=0, change_amount=0):
	return frappe._dict(
		{
			"name": name,
			"is_return": is_return,
			"change_amount": change_amount,
			"account_for_change_amount": CASH_ACCOUNT,
		}
	)


def _payment(parent, mode, amount, account=None):
	return frappe._dict(
		{
			"parent": parent,
			"mode_of_payment": mode,
			"amount": amount,
			"account": account or (CASH_ACCOUNT if mode == "Cash" else f"{mode} - U"),
		}
	)


def _rows_by_mode(totals):
	return {row["mode_of_payment"]: row for row in totals["payments"]}


class TestBuildShiftTotals(FrappeTestCase):
	def test_splits_sales_and_returns_per_mode(self):
		invoices = [_invoice("INV-1"), _invoice("INV-2"), _invoice("RET-1", is_return=1)]
		payments = [
			_payment("INV-1", "Cash", 1000),
			_payment("INV-2", "Card", 2500),
			_payment("RET-1", "Cash", -400),
		]

		totals = build_shift_totals(invoices, payments)
		rows = _rows_by_mode(totals)

		self.assertEqual(rows["Cash"]["sales_amount"], 1000)
		self.assertEqual(rows["Cash"]["return_amount"], 400)  # shown positive
		self.assertEqual(rows["Cash"]["net_amount"], 600)
		self.assertEqual(rows["Cash"]["sales_count"], 1)
		self.assertEqual(rows["Cash"]["return_count"], 1)
		self.assertEqual(rows["Card"]["sales_amount"], 2500)
		self.assertEqual(rows["Card"]["return_count"], 0)

		self.assertEqual(totals["sales_amount"], 3500)
		self.assertEqual(totals["return_amount"], 400)
		self.assertEqual(totals["grand_total"], 3100)
		self.assertEqual(totals["sales_count"], 2)
		self.assertEqual(totals["return_count"], 1)

	def test_split_payment_counts_invoice_once_in_totals(self):
		invoices = [_invoice("INV-1")]
		payments = [_payment("INV-1", "Cash", 300), _payment("INV-1", "Card", 700)]

		totals = build_shift_totals(invoices, payments)
		rows = _rows_by_mode(totals)

		self.assertEqual(totals["sales_count"], 1)
		self.assertEqual(rows["Cash"]["sales_count"], 1)
		self.assertEqual(rows["Card"]["sales_count"], 1)
		self.assertEqual(totals["sales_amount"], 1000)

	def test_change_is_taken_off_the_change_account_only(self):
		# Customer handed over 5000 cash for a 3800 bill paid 3000 card + 800 cash.
		invoices = [_invoice("INV-1", change_amount=4200)]
		payments = [_payment("INV-1", "Cash", 5000), _payment("INV-1", "Card", 3000)]

		rows = _rows_by_mode(build_shift_totals(invoices, payments))

		self.assertEqual(rows["Cash"]["sales_amount"], 800)
		self.assertEqual(rows["Card"]["sales_amount"], 3000)

	def test_zero_payment_rows_are_skipped(self):
		invoices = [_invoice("INV-1")]
		payments = [_payment("INV-1", "Cash", 500), _payment("INV-1", "Card", 0)]

		rows = _rows_by_mode(build_shift_totals(invoices, payments))

		self.assertEqual(list(rows), ["Cash"])

	def test_payments_of_invoices_not_in_the_list_are_ignored(self):
		# A cancelled invoice is filtered out of `invoices` by docstatus; its
		# payment rows must not leak into the totals.
		invoices = [_invoice("INV-1")]
		payments = [_payment("INV-1", "Cash", 500), _payment("INV-CANCELLED", "Cash", 900)]

		totals = build_shift_totals(invoices, payments)

		self.assertEqual(totals["sales_amount"], 500)
		self.assertEqual(totals["sales_count"], 1)

	def test_empty_shift(self):
		totals = build_shift_totals([], [])

		self.assertEqual(totals["payments"], [])
		self.assertEqual(totals["grand_total"], 0)
		self.assertEqual(totals["sales_count"], 0)
		self.assertEqual(totals["return_count"], 0)


def _closing(**overrides):
	data = {
		"doctype": "POS Closing Entry",
		"name": "POS-CLO-2026-00001",
		"docstatus": 1,
		"pos_profile": "Profile-1",
		"branch": "Branch-1",
	}
	data.update(overrides)
	return frappe._dict(data)


class TestCreateShiftReport(FrappeTestCase):
	def test_existing_report_is_not_duplicated(self):
		with (
			patch(f"{MODULE}.frappe.db.exists", return_value="POS-CLO-2026-00001"),
			patch(f"{MODULE}._insert_report") as insert,
		):
			create_shift_report(_closing())

		insert.assert_not_called()

	def test_creates_report_with_server_resolved_terminal(self):
		with (
			patch(f"{MODULE}.frappe.db.exists", return_value=None),
			patch(f"{MODULE}._current_terminal", return_value="TERM-1") as terminal,
			patch(f"{MODULE}._insert_report") as insert,
		):
			closing = _closing()
			create_shift_report(closing)

		terminal.assert_called_once_with("Branch-1")
		insert.assert_called_once_with(closing, branch="Branch-1", terminal="TERM-1")

	def test_failure_is_logged_not_raised(self):
		with (
			patch(f"{MODULE}.frappe.db.exists", return_value=None),
			patch(f"{MODULE}._current_terminal", return_value=None),
			patch(f"{MODULE}._insert_report", side_effect=Exception("boom")),
			patch(f"{MODULE}.frappe.db.rollback") as rollback,
			patch(f"{MODULE}.frappe.log_error") as log_error,
		):
			create_shift_report(_closing())  # must not raise

		rollback.assert_called_once()
		log_error.assert_called_once()

	def test_sub_pos_closing_has_no_report_hook(self):
		doc_events = frappe.get_hooks("doc_events")
		sub_hooks = str(doc_events.get("Sub POS Closing", {}))

		self.assertNotIn("ury_cash_shift_report", sub_hooks)
		self.assertIn(
			"ury.ury.api.ury_cash_shift_report.create_shift_report",
			doc_events["POS Closing Entry"]["on_submit"],
		)


class TestCurrentTerminal(FrappeTestCase):
	def _resolve(self, terminal, branch="Branch-1"):
		from ury.ury.api.ury_cash_shift_report import _current_terminal

		with patch("ury.ury.api.pos_pin._resolve_terminal_from_cookie", return_value=terminal):
			return _current_terminal(branch)

	def test_no_enrolled_device(self):
		self.assertIsNone(self._resolve(None))

	def test_terminal_of_the_same_branch(self):
		self.assertEqual(self._resolve(frappe._dict(name="TERM-1", branch="Branch-1")), "TERM-1")

	def test_terminal_of_another_branch_is_not_trusted(self):
		self.assertIsNone(self._resolve(frappe._dict(name="TERM-9", branch="Branch-2")))


class TestRegenerateShiftReport(FrappeTestCase):
	def test_rejects_unsubmitted_closing(self):
		with (
			patch(f"{MODULE}.frappe.only_for"),
			patch(f"{MODULE}.frappe.get_doc", return_value=_closing(docstatus=0)),
			patch(f"{MODULE}._insert_report") as insert,
		):
			self.assertRaises(frappe.ValidationError, regenerate_shift_report, "POS-CLO-2026-00001")

		insert.assert_not_called()

	def test_rebuilds_without_terminal(self):
		report = MagicMock()
		report.name = "POS-CLO-2026-00001"
		closing = _closing()
		with (
			patch(f"{MODULE}.frappe.only_for"),
			patch(f"{MODULE}.frappe.get_doc", return_value=closing),
			patch(f"{MODULE}.frappe.db.exists", return_value=None),
			patch(f"{MODULE}._insert_report", return_value=report) as insert,
		):
			self.assertEqual(regenerate_shift_report("POS-CLO-2026-00001"), "POS-CLO-2026-00001")

		insert.assert_called_once_with(closing, branch="Branch-1", terminal=None)


class TestPosProfileSettings(FrappeTestCase):
	def _options(self, settings):
		with patch(f"{MODULE}.frappe.db.get_value", return_value=settings):
			return shift_report_print_options("Profile-1")

	def test_sections_default_to_shown(self):
		# Profiles saved before the settings existed have no value yet.
		self.assertEqual(
			self._options(frappe._dict()),
			{"show_payment_modes": 1, "show_returns": 1},
		)

	def test_sections_can_be_turned_off(self):
		settings = frappe._dict(
			custom_shift_report_show_payment_modes=0,
			custom_shift_report_show_returns=0,
		)
		self.assertEqual(self._options(settings), {"show_payment_modes": 0, "show_returns": 0})

	def _db(self, profile_format=None):
		"""get_value stub: the profile's stored format, and each Print Format's doc_type."""

		def get_value(doctype, name, *args, **kwargs):
			if doctype == "POS Profile":
				return profile_format
			return FORMAT_DOCTYPES.get(name)

		return patch(f"{MODULE}.frappe.db.get_value", side_effect=get_value)

	def test_print_format_falls_back_to_bundled_one(self):
		with self._db(profile_format=None):
			self.assertEqual(get_shift_report_print_format("Profile-1"), DEFAULT_PRINT_FORMAT)

	def test_print_format_from_profile(self):
		with self._db(profile_format="My Z Report"):
			self.assertEqual(get_shift_report_print_format("Profile-1"), "My Z Report")

	def test_print_time_rejects_a_receipt_format_saved_on_the_profile(self):
		# e.g. a profile saved before the save-time check existed
		with self._db(profile_format="Receipt 80mm"):
			self.assertRaises(frappe.ValidationError, get_shift_report_print_format, "Profile-1")


# Print Format name -> its doc_type, for the stubs below.
FORMAT_DOCTYPES = {
	"Receipt 80mm": "POS Invoice",
	DEFAULT_PRINT_FORMAT: REPORT_DOCTYPE_NAME,
	"My Z Report": REPORT_DOCTYPE_NAME,
	"Kitchen Slip": "URY KOT",
}


def _print_format_doctype(doctype, name, *args, **kwargs):
	return FORMAT_DOCTYPES.get(name) if doctype == "Print Format" else None


class TestPrintFormatScope(FrappeTestCase):
	"""Customer receipts and shift reports must never use each other's layout."""

	def _validate_profile(self, **fields):
		with patch(f"{SCOPE_MODULE}.frappe.db.get_value", side_effect=_print_format_doctype):
			validate_print_formats(frappe._dict(fields))

	def test_profile_accepts_matching_formats(self):
		self._validate_profile(
			print_format="Receipt 80mm", custom_shift_report_print_format=DEFAULT_PRINT_FORMAT
		)
		self._validate_profile()  # both empty: defaults apply

	def test_receipt_field_rejects_a_shift_report_format(self):
		self.assertRaises(frappe.ValidationError, self._validate_profile, print_format=DEFAULT_PRINT_FORMAT)

	def test_shift_report_field_rejects_a_receipt_format(self):
		self.assertRaises(
			frappe.ValidationError,
			self._validate_profile,
			custom_shift_report_print_format="Receipt 80mm",
		)

	def test_any_other_doctype_is_rejected_too(self):
		self.assertRaises(frappe.ValidationError, self._validate_profile, print_format="Kitchen Slip")

	def test_unknown_format_is_rejected(self):
		with patch(f"{SCOPE_MODULE}.frappe.db.get_value", return_value=None):
			self.assertRaises(
				frappe.ValidationError, validate_print_format_doctype, "Deleted Format", "POS Invoice"
			)


class TestShiftReportPrintApi(FrappeTestCase):
	def _values(self, mapping):
		"""frappe.db.get_value stub keyed by doctype."""

		def get_value(doctype, *args, **kwargs):
			return mapping.get(doctype)

		return get_value

	def test_print_info_for_closing_with_report(self):
		values = {
			"POS Closing Entry": "Profile-1",
			REPORT_DOCTYPE_NAME: "POS-CLO-1",
			"POS Profile": None,  # auto print / format never set on this profile
			"Print Format": REPORT_DOCTYPE_NAME,  # the bundled format's doc_type
		}
		with (
			patch(f"{MODULE}.frappe.has_permission", return_value=True) as has_permission,
			patch(f"{MODULE}.frappe.db.get_value", side_effect=self._values(values)),
		):
			info = get_shift_report_print_info("POS-CLO-1")

		self.assertEqual(info, {"report": "POS-CLO-1", "print_format": DEFAULT_PRINT_FORMAT, "auto_print": 1})
		checked = [c.args[0] for c in has_permission.call_args_list]
		self.assertEqual(checked, ["POS Closing Entry", REPORT_DOCTYPE_NAME])

	def test_print_info_without_report(self):
		values = {
			"POS Closing Entry": "Profile-1",
			REPORT_DOCTYPE_NAME: None,
			"POS Profile": 0,
			"Print Format": REPORT_DOCTYPE_NAME,
		}
		with (
			patch(f"{MODULE}.frappe.has_permission", return_value=True),
			patch(f"{MODULE}.frappe.db.get_value", side_effect=self._values(values)),
		):
			info = get_shift_report_print_info("POS-CLO-1")

		self.assertIsNone(info["report"])
		self.assertEqual(info["auto_print"], 0)

	def test_print_info_requires_closing_permission(self):
		with patch(f"{MODULE}.frappe.has_permission", side_effect=frappe.PermissionError):
			self.assertRaises(frappe.PermissionError, get_shift_report_print_info, "POS-CLO-1")

	def test_network_print_needs_a_bill_printer(self):
		report = frappe._dict(doctype=REPORT_DOCTYPE_NAME, name="POS-CLO-1", pos_profile="Profile-1")
		with (
			patch(f"{MODULE}.frappe.get_doc", return_value=report),
			patch("frappe.www.printview.validate_print_permission"),
			patch(f"{MODULE}.frappe.db.get_value", return_value=None),
		):
			self.assertRaises(frappe.ValidationError, network_print_shift_report, "POS-CLO-1")
