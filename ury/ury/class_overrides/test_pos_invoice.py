from unittest.mock import patch

import frappe
from frappe.tests import IntegrationTestCase
from frappe.utils import get_datetime, getdate

from ury.ury.class_overrides.pos_invoice import get_business_date

MODULE = "ury.ury.class_overrides.pos_invoice"


class TestPosOpeningBusinessDay(IntegrationTestCase):
	def _validate(self, now, shift_starts):
		"""Run the opening-entry check at time `now` with the given open shifts."""
		doc = frappe.new_doc("POS Invoice")
		doc.pos_profile = "Test POS Profile"
		doc.set_posting_time = 0
		shifts = [
			frappe._dict(name=f"POS-OPE-TEST-{i}", period_start_date=get_datetime(start))
			for i, start in enumerate(shift_starts)
		]
		with self.freeze_time(now), patch(f"{MODULE}.frappe.get_all", return_value=shifts):
			doc.validate_pos_opening_entry()

	# --- the bug: last night's shift must keep working until 05:00 ---
	def test_last_night_shift_allowed_at_2am(self):
		self._validate("2026-11-24 02:00:00", ["2026-11-23 22:00:00"])

	def test_last_night_shift_allowed_at_4_59(self):
		self._validate("2026-11-24 04:59:59", ["2026-11-23 22:00:00"])

	# --- after 05:00 the old shift is outdated, as before ---
	def test_last_night_shift_outdated_at_5am(self):
		with self.assertRaises(frappe.ValidationError):
			self._validate("2026-11-24 05:00:00", ["2026-11-23 22:00:00"])

	def test_shift_from_two_days_ago_outdated_at_2am(self):
		with self.assertRaises(frappe.ValidationError):
			self._validate("2026-11-24 02:00:00", ["2026-11-22 22:00:00"])

	# --- normal daytime work is unchanged ---
	def test_todays_shift_allowed_in_the_afternoon(self):
		self._validate("2026-11-24 14:00:00", ["2026-11-24 10:00:00"])

	def test_no_open_shift_still_rejected(self):
		with self.assertRaises(frappe.ValidationError):
			self._validate("2026-11-24 14:00:00", [])


class TestGetBusinessDate(IntegrationTestCase):
	def test_before_5am_is_previous_day(self):
		self.assertEqual(get_business_date("2026-11-24 04:59:59"), getdate("2026-11-23"))

	def test_from_5am_is_same_day(self):
		self.assertEqual(get_business_date("2026-11-24 05:00:00"), getdate("2026-11-24"))
