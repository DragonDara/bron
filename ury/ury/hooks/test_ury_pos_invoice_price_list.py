"""Tests for `validate_price_list`: the POS Invoice header price list must
match the list sync_order priced the lines from."""

from unittest.mock import patch

import frappe
from frappe.tests.utils import FrappeTestCase

from ury.ury.hooks.ury_pos_invoice import validate_price_list

MODULE = "ury.ury.hooks.ury_pos_invoice"


def _invoice(order_type="Dine In", customer="CompanyName"):
	return frappe._dict(
		restaurant="My Company",
		restaurant_table=None,
		branch="My Company",
		order_type=order_type,
		customer=customer,
		selling_price_list=None,
	)


def _get_value(doctype, filters=None, fieldname=None, *args, **kwargs):
	if doctype == "URY Restaurant" and fieldname == "active_menu":
		return "Default Menu"
	if doctype == "Price List" and filters == {"restaurant_menu": "Default Menu", "enabled": 1}:
		return "Default Menu PL"
	if doctype == "Aggregator Settings":
		return "Aggregator PL"
	return None


class TestValidatePriceList(FrappeTestCase):
	def test_customer_price_list_is_kept_on_header(self):
		doc = _invoice()
		with patch(f"{MODULE}.frappe.db.get_value", side_effect=_get_value), \
			 patch(f"{MODULE}.get_customer_price_menu", return_value=("Company Menu2", "Company Menu2")) as pricing:
			validate_price_list(doc, "validate")

		pricing.assert_called_once_with("CompanyName", "My Company")
		self.assertEqual(doc.selling_price_list, "Company Menu2")

	def test_customer_without_price_list_uses_active_menu(self):
		doc = _invoice(customer="Walk In")
		with patch(f"{MODULE}.frappe.db.get_value", side_effect=_get_value), \
			 patch(f"{MODULE}.get_customer_price_menu", return_value=(None, None)):
			validate_price_list(doc, "validate")

		self.assertEqual(doc.selling_price_list, "Default Menu PL")

	def test_aggregator_ignores_customer_price_list(self):
		doc = _invoice(order_type="Aggregators")
		with patch(f"{MODULE}.frappe.db.get_value", side_effect=_get_value), \
			 patch(f"{MODULE}.get_customer_price_menu", return_value=("Company Menu2", "Company Menu2")) as pricing:
			validate_price_list(doc, "validate")

		pricing.assert_not_called()
		self.assertEqual(doc.selling_price_list, "Aggregator PL")
