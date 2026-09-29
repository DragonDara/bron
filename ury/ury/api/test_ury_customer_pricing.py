import unittest
from unittest.mock import MagicMock, patch

import frappe

from ury.ury.api.ury_customer_pricing import get_customer_price_menu

MOD = "ury.ury.api.ury_customer_pricing"


class TestGetCustomerPriceMenu(unittest.TestCase):
	def _resolve(self, price_list="Company Price List", price_list_row=None, menu_row=None, exists=True):
		price_list_row = price_list_row if price_list_row is not None else frappe._dict(
			enabled=1, selling=1, restaurant_menu="Company Menu"
		)
		menu_row = menu_row if menu_row is not None else frappe._dict(enabled=1, branch="Branch A")

		def _get_value(doctype, _name, _fields, as_dict=False):
			return {"Price List": price_list_row, "URY Menu": menu_row}[doctype]

		with patch(f"{MOD}.frappe.db.exists", return_value=exists), \
				patch(f"{MOD}.frappe.get_cached_doc", return_value=MagicMock()), \
				patch(f"{MOD}.get_default_price_list", return_value=price_list), \
				patch(f"{MOD}.frappe.db.get_value", side_effect=_get_value):
			return get_customer_price_menu("Acme LLP", "Branch A")

	def test_returns_menu_and_price_list(self):
		self.assertEqual(self._resolve(), ("Company Menu", "Company Price List"))

	def test_no_customer(self):
		self.assertEqual(get_customer_price_menu(None, "Branch A"), (None, None))

	def test_unknown_customer(self):
		self.assertEqual(self._resolve(exists=False), (None, None))

	def test_no_default_price_list(self):
		self.assertEqual(self._resolve(price_list=None), (None, None))

	def test_price_list_without_menu(self):
		row = frappe._dict(enabled=1, selling=1, restaurant_menu=None)
		self.assertEqual(self._resolve(price_list_row=row), (None, None))

	def test_disabled_or_buying_price_list(self):
		disabled = frappe._dict(enabled=0, selling=1, restaurant_menu="Company Menu")
		buying = frappe._dict(enabled=1, selling=0, restaurant_menu="Company Menu")
		self.assertEqual(self._resolve(price_list_row=disabled), (None, None))
		self.assertEqual(self._resolve(price_list_row=buying), (None, None))

	def test_menu_of_other_branch_or_disabled(self):
		other_branch = frappe._dict(enabled=1, branch="Branch B")
		disabled = frappe._dict(enabled=0, branch="Branch A")
		self.assertEqual(self._resolve(menu_row=other_branch), (None, None))
		self.assertEqual(self._resolve(menu_row=disabled), (None, None))


class TestValidateSyncItemsAgainstCustomerMenu(unittest.TestCase):
	@patch("ury.ury.doctype.ury_order.ury_order.frappe.db.get_value", return_value=0)
	@patch("ury.ury.doctype.ury_order.ury_order.frappe.get_all")
	@patch("ury.ury.doctype.ury_order.ury_order._resolve_menu_for_sync")
	def test_explicit_menu_skips_room_resolution(self, mock_resolve, mock_get_all, _mock_get_value):
		from ury.ury.doctype.ury_order.ury_order import _validate_sync_items_against_menu

		mock_get_all.return_value = [frappe._dict(item="Burger")]

		_validate_sync_items_against_menu(
			[{"item": "Burger"}], [], "Branch A", order_type="Take Away", menu="Company Menu"
		)

		mock_resolve.assert_not_called()
		self.assertEqual(mock_get_all.call_args.kwargs["filters"]["parent"], "Company Menu")
