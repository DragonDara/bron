# Copyright (c) 2025, Tridz Technologies Pvt. Ltd and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from unittest.mock import patch, MagicMock
from ury.ury.doctype.sub_pos_closing.sub_pos_closing import (
	assert_no_open_invoices,
	get_pos_invoices,
)

MODULE = "ury.ury.doctype.sub_pos_closing.sub_pos_closing"


class TestAssertNoOpenInvoices(FrappeTestCase):
	"""Gate that blocks Sub / POS Closing while draft/unbilled invoices remain."""

	def test_blocks_when_open_invoices_exist(self):
		open_rows = [
			frappe._dict(name="POSINV-OPEN-1", restaurant_table="T1", invoice_printed=0),
			frappe._dict(name="POSINV-OPEN-2", restaurant_table="", invoice_printed=1),
		]
		with patch(f"{MODULE}.frappe.get_all", return_value=open_rows) as get_all:
			with self.assertRaises(frappe.ValidationError) as ctx:
				assert_no_open_invoices("Profile-1", user="cashier@ury.test")

		_, kwargs = get_all.call_args
		self.assertEqual(kwargs["filters"]["pos_profile"], "Profile-1")
		self.assertEqual(kwargs["filters"]["docstatus"], 0)
		self.assertEqual(kwargs["filters"]["cashier"], "cashier@ury.test")
		self.assertIn("POSINV-OPEN-1", str(ctx.exception))
		self.assertIn("POSINV-OPEN-2", str(ctx.exception))

	def test_allows_close_when_no_open_invoices(self):
		with patch(f"{MODULE}.frappe.get_all", return_value=[]) as get_all:
			assert_no_open_invoices("Profile-1", user="cashier@ury.test")

		_, kwargs = get_all.call_args
		self.assertEqual(kwargs["filters"]["docstatus"], 0)
		self.assertEqual(kwargs["filters"]["cashier"], "cashier@ury.test")

	def test_main_closing_scopes_to_profile_only(self):
		"""Main POS Closing Entry checks the whole profile (no cashier filter)."""
		with patch(f"{MODULE}.frappe.get_all", return_value=[]) as get_all:
			assert_no_open_invoices("Profile-1")

		_, kwargs = get_all.call_args
		self.assertEqual(kwargs["filters"]["pos_profile"], "Profile-1")
		self.assertEqual(kwargs["filters"]["docstatus"], 0)
		self.assertNotIn("cashier", kwargs["filters"])


class TestSubPOSClosingSEC09(FrappeTestCase):

    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.sql")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.has_permission")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.getBranch")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.get_value")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.get_roles")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.session")
    def test_normal_cashier_forced_user(self, mock_session, mock_get_roles, mock_get_value, mock_get_branch, mock_has_permission, mock_sql):
        # 1. Normal cashier sends another user's ID
        # Result: only their own invoices are returned (the SQL query is called with their session user).
        mock_session.user = "normal_cashier@test.com"
        mock_get_roles.return_value = ["Cashier"]
        mock_get_branch.return_value = "Branch A"
        mock_get_value.return_value = "Branch A" # POS Profile branch matches
        
        mock_sql.return_value = []
        
        get_pos_invoices("2023-01-01 00:00:00", "2023-01-02 00:00:00", "POS-A", "other_cashier@test.com")
        
        # Verify sql was called with normal_cashier@test.com
        called_args = mock_sql.call_args[0]
        self.assertEqual(called_args[1][0], "normal_cashier@test.com")

    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.has_permission")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.getBranch")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.get_value")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.get_roles")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.session")
    def test_normal_cashier_other_branch(self, mock_session, mock_get_roles, mock_get_value, mock_get_branch, mock_has_permission):
        # 2. Normal cashier requests another branch's POS Profile
        # Result: PermissionError.
        mock_session.user = "normal_cashier@test.com"
        mock_get_roles.return_value = ["Cashier"]
        mock_get_branch.return_value = "Branch A"
        mock_get_value.return_value = "Branch B" # POS Profile branch is different
        
        with self.assertRaises(frappe.PermissionError):
            get_pos_invoices("2023-01-01 00:00:00", "2023-01-02 00:00:00", "POS-B", "normal_cashier@test.com")

    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.getBranch")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.get_value")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.get_roles")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.session")
    def test_invalid_pos_profile(self, mock_session, mock_get_roles, mock_get_value, mock_get_branch):
        # 3. Invalid POS Profile
        # Result: DoesNotExistError.
        mock_session.user = "normal_cashier@test.com"
        mock_get_roles.return_value = ["Cashier"]
        mock_get_branch.return_value = "Branch A"
        mock_get_value.return_value = None # POS Profile not found
        
        with self.assertRaises(frappe.DoesNotExistError):
            get_pos_invoices("2023-01-01 00:00:00", "2023-01-02 00:00:00", "POS-INVALID", "normal_cashier@test.com")

    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.sql")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.has_permission")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.getBranch")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.get_value")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.get_roles")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.session")
    def test_supervisor_requests_another_cashier(self, mock_session, mock_get_roles, mock_get_value, mock_get_branch, mock_has_permission, mock_sql):
        # 4. Supervisor requests another cashier's invoices
        # Result: allowed.
        mock_session.user = "supervisor@test.com"
        mock_get_roles.return_value = ["URY Manager"]
        mock_get_branch.return_value = "Branch A"
        mock_get_value.return_value = "Branch A"
        
        mock_sql.return_value = []
        
        get_pos_invoices("2023-01-01 00:00:00", "2023-01-02 00:00:00", "POS-A", "other_cashier@test.com")
        
        # Verify sql was called with other_cashier@test.com
        called_args = mock_sql.call_args[0]
        self.assertEqual(called_args[1][0], "other_cashier@test.com")

    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.sql")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.has_permission")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.getBranch")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.db.get_value")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.get_roles")
    @patch("ury.ury.doctype.sub_pos_closing.sub_pos_closing.frappe.session")
    def test_administrator_bypass_branch(self, mock_session, mock_get_roles, mock_get_value, mock_get_branch, mock_has_permission, mock_sql):
        # Administrator branch bypass check
        mock_session.user = "Administrator"
        # Simulate Administrator not having a branch mapping (throws ValidationError)
        mock_get_branch.side_effect = frappe.ValidationError("User has no branch")
        mock_get_value.return_value = "Branch B"
        
        mock_sql.return_value = []
        
        get_pos_invoices("2023-01-01 00:00:00", "2023-01-02 00:00:00", "POS-B", "some_cashier@test.com")
        
        # Verify sql was called successfully with the requested user
        called_args = mock_sql.call_args[0]
        self.assertEqual(called_args[1][0], "some_cashier@test.com")
