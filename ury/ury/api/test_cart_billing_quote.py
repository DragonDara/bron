"""The register quote uses server prices and never writes an invoice."""

from contextlib import ExitStack
from unittest.mock import patch

import frappe
from frappe.tests.utils import FrappeTestCase

from ury.ury.api.pos_billing import get_cart_service_charge_quote
from ury.ury.api.test_pos_billing import invoice

MODULE = "ury.ury.api.pos_billing"
ORDER = "ury.ury.doctype.ury_order.ury_order"


class TestCartBillingQuote(FrappeTestCase):
    def setUp(self):
        super().setUp()
        self.previous_user = frappe.session.user
        frappe.set_user("register-cashier@example.test")
        self.addCleanup(frappe.set_user, self.previous_user)
        self.stack = ExitStack()
        self.addCleanup(self.stack.close)
        self.profile = frappe._dict(
            name="Test Profile", disabled=0, company="Test Co", branch="Test Branch",
            customer="Walk In", applicable_for_users=[], custom_enable_multiple_cashier=0,
            custom_enable_service_charge=1, custom_service_charge_order_types="Dine In",
            custom_service_charge_percentage=10, custom_service_charge_payable_account="PAYABLE",
        )
        self.doc = invoice()
        self.doc.set_missing_values = lambda: None
        self.doc.save = lambda: self.fail("Quoting must not save an invoice")
        self.mock("ury.ury_pos.api.getBranch", return_value="Test Branch")
        self.mock(f"{MODULE}.frappe.get_doc", side_effect=lambda dt, *args: self.profile if dt == "POS Profile" else frappe._dict(name="Walk In"))
        self.mock(f"{MODULE}.frappe.new_doc", return_value=self.doc)
        self.mock(f"{MODULE}.frappe.get_cached_doc", return_value=self.profile)
        self.values = self.mock(f"{MODULE}.frappe.db.get_value", side_effect=self.lookup)
        self.mock(f"{MODULE}._apply_staff_policy", return_value={"reason": "no_applicable_policy"})
        self.mock(f"{ORDER}._resolve_menu_for_sync", return_value="MENU")
        self.mock(f"{ORDER}.get_menu_name", return_value="MENU")
        self.mock(f"{ORDER}._validate_sync_items_against_menu")
        self.mock(f"{ORDER}.price_items_for_invoice", return_value=[frappe._dict(item_code="FOOD", qty=1, rate=100)])
        self.mock("ury.ury.api.ury_customer_pricing.get_customer_price_menu", return_value=(None, None))
        self.mock("ury.ury.api.ury_order_attribution.resolve_order_performer", return_value=None)
        self.mock("ury.ury.hooks.ury_pos_invoice._employee_for_user", return_value="EMP-WAITER")

    def mock(self, target, **kwargs):
        return self.stack.enter_context(patch(target, **kwargs))

    def lookup(self, doctype, name, field=None, **kwargs):
        if doctype == "Branch":
            return 1 if field == "custom_no_taxes" else "Test Co"
        if doctype == "URY Restaurant":
            return "RESTAURANT"
        if doctype == "Price List":
            return "PRICES"
        if doctype == "Account":
            return frappe._dict(company="Test Co", root_type="Liability", is_group=0)
        if doctype == "Employee":
            return frappe._dict(status="Active", branch="Test Branch")
        if doctype == "URY Table":
            return "Other Branch", "Other Room"

    def test_non_administrator_quote_uses_server_price_and_includes_service(self):
        quote = get_cart_service_charge_quote(
            [{"item": "FOOD", "qty": 1, "rate": 1}], self.profile.name, "Dine In",
        )
        self.assertEqual(quote["service_charge"], 10)
        self.assertEqual(quote["rounded_total"], 110)
        self.assertEqual(quote["subtotal"], 100)

    def test_non_administrator_cannot_quote_another_branch_profile(self):
        self.profile.branch = "Other Branch"
        with self.assertRaises(frappe.PermissionError):
            get_cart_service_charge_quote([{"item": "FOOD", "qty": 1}], self.profile.name, "Dine In")

    def test_disabled_performer_selection_can_quote_without_linked_employee(self):
        self.profile.custom_enable_order_on_behalf = 0
        self.profile.custom_require_performer_on_order = 1
        self.doc.custom_waiter_employee = None
        with patch("ury.ury.hooks.ury_pos_invoice._employee_for_user", return_value=None):
            quote = get_cart_service_charge_quote(
                [{"item": "FOOD", "qty": 1}], self.profile.name, "Dine In",
            )
        self.assertEqual(quote["service_charge"], 10)
        self.assertEqual(quote["rounded_total"], 110)
        self.assertIsNone(self.doc.custom_waiter_employee)

    def test_non_administrator_cannot_quote_another_branch_table(self):
        with self.assertRaises(frappe.PermissionError):
            get_cart_service_charge_quote([{"item": "FOOD", "qty": 1}], self.profile.name, "Dine In", table="OTHER")

    def test_non_finite_quantity_is_rejected(self):
        with self.assertRaises(frappe.ValidationError):
            get_cart_service_charge_quote([{"item": "FOOD", "qty": float("nan")}], self.profile.name, "Dine In")
