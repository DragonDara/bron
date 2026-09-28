import frappe
from erpnext.accounts.party import get_default_price_list


def get_customer_price_menu(customer, branch):
	"""Return (menu, price_list) when the customer is priced from a URY Menu on this branch.

	The price list follows ERPNext's default resolution (Customer, then its
	Customer Group). It only applies when it is an enabled selling price list
	linked to an enabled URY Menu of the same branch; otherwise (None, None)
	and the regular room / order-type / active menu stays in effect.
	"""
	if not customer or not frappe.db.exists("Customer", customer):
		return None, None

	price_list = get_default_price_list(frappe.get_cached_doc("Customer", customer))
	if not price_list:
		return None, None

	price_list_row = frappe.db.get_value(
		"Price List", price_list, ["enabled", "selling", "restaurant_menu"], as_dict=True
	)
	if not (
		price_list_row
		and price_list_row.enabled
		and price_list_row.selling
		and price_list_row.restaurant_menu
	):
		return None, None

	menu_row = frappe.db.get_value(
		"URY Menu", price_list_row.restaurant_menu, ["enabled", "branch"], as_dict=True
	)
	if not (menu_row and menu_row.enabled and menu_row.branch == branch):
		return None, None

	return price_list_row.restaurant_menu, price_list
