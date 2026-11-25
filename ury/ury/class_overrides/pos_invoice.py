import frappe
from erpnext.accounts.doctype.pos_invoice.pos_invoice import (
	POSInvoice,
	get_stock_availability,
)

from frappe import _
from frappe.utils import add_days, flt, get_datetime, getdate, now_datetime

try:
	from erpnext.accounts.doctype.pos_invoice.pos_invoice import ProductBundleStockValidationError
except ImportError:
	class ProductBundleStockValidationError(frappe.ValidationError):
		pass

# ERPNext v16+ refactored stock validation into batched queries
try:
	from erpnext.accounts.doctype.pos_invoice.pos_invoice import (
		get_active_bundle_items,
		get_available_stock_qty,
		get_required_stock_qty,
		get_stock_item_details,
		is_stock_check_needed,
	)
	HAS_BATCHED_STOCK_CHECK = True
except ImportError:
	HAS_BATCHED_STOCK_CHECK = False

try:
	from erpnext.accounts.doctype.pos_invoice.pos_invoice import (
		get_product_bundle_stock_availability,
	)
except ImportError:
	def get_product_bundle_stock_availability(item_code, warehouse, item_qty):
		try:
			from erpnext.stock.stock_ledger import is_negative_stock_allowed
			from erpnext.accounts.doctype.pos_invoice.pos_invoice import (
				get_bin_qty,
				get_pos_reserved_qty,
			)

			is_stock_item = True
			bundle = frappe.get_doc("Product Bundle", item_code)
			availabilities = []
			for bundle_item in bundle.items:
				if frappe.get_value("Item", bundle_item.item_code, "is_stock_item"):
					bin_qty = get_bin_qty(bundle_item.item_code, warehouse)
					reserved_qty = get_pos_reserved_qty(bundle_item.item_code, warehouse)
					available = bin_qty - reserved_qty
					availabilities.append(
						{
							"item_code": bundle_item.item_code,
							"required": bundle_item.qty * item_qty,
							"available": available,
						}
					)

			return availabilities, is_stock_item, is_negative_stock_allowed(item_code=item_code)
		except Exception:
			return get_stock_availability(item_code, warehouse)


# URY business day starts at 05:00: until then it is still the previous day,
# so a shift opened in the evening keeps working after midnight.
BUSINESS_DAY_START_HOUR = 5


def get_business_date(now=None):
	now = get_datetime(now) if now else now_datetime()
	if now.hour < BUSINESS_DAY_START_HOUR:
		return getdate(add_days(now, -1))
	return getdate(now)


class CustomPOSInvoice(POSInvoice):
	def validate_pos_opening_entry(self):
		# Copy of ERPNext 16.60.0 SalesInvoice.validate_pos_opening_entry with one change:
		# the final "outdated" check uses URY's 05:00 business date instead of the calendar date.
		# Re-check this copy when ERPNext is upgraded.
		opening_entries = frappe.get_all(
			"POS Opening Entry",
			fields=["name", "period_start_date"],
			filters={"pos_profile": self.pos_profile, "status": "Open"},
			order_by="period_start_date desc",
		)
		if not opening_entries:
			frappe.throw(
				title=_("POS Opening Entry Missing"),
				msg=_("No open POS Opening Entry found for POS Profile {0}.").format(
					frappe.bold(self.pos_profile)
				),
			)
		if len(opening_entries) > 1:
			frappe.throw(
				title=_("Multiple POS Opening Entry"),
				msg=_(
					"POS Profile - {0} has multiple open POS Opening Entries. Please close or cancel the existing entries before proceeding."
				).format(self.pos_profile),
			)
		opening_entry = opening_entries[0]
		if self.set_posting_time:
			posting_datetime = get_datetime(f"{self.posting_date} {self.posting_time or '00:00:00'}")
			if getdate(posting_datetime) != getdate(opening_entry.period_start_date) or (
				posting_datetime < get_datetime(opening_entry.period_start_date)
			):
				frappe.throw(
					_(
						"Posting date and time must be on the same day as, and at or after, the start of POS Opening Entry {0}: {1}."
					).format(opening_entry.name, opening_entry.period_start_date)
				)
			if getdate(posting_datetime) < getdate():
				return

		if getdate(opening_entry.period_start_date) != get_business_date():  # URY: was getdate()
			frappe.throw(
				title=_("Outdated POS Opening Entry"),
				msg=_(
					"POS Opening Entry - {0} is outdated. Please close the POS and create a new POS Opening Entry."
				).format(opening_entry.name),
			)

	def validate_stock_availablility(self):
		if self.is_return or frappe.get_cached_doc("Stock Settings").allow_negative_stock:
			return

		if self.docstatus.is_draft() and not frappe.db.get_value(
			"POS Profile", self.pos_profile, "validate_stock_on_save"
		):
			return

		branch = self.branch or frappe.db.get_value("POS Profile", self.pos_profile, "branch")

		if HAS_BATCHED_STOCK_CHECK:
			rows = [
				d
				for d in self.get("items")
				if d.item_code
				and not d.serial_and_batch_bundle
				and not (branch and self._is_always_available(d.item_code, branch))
			]
			if not rows:
				return

			bundle_items = get_active_bundle_items({d.item_code for d in rows})
			required_qty = get_required_stock_qty(rows, bundle_items)
			available_qty, reserved_stock_keys = get_available_stock_qty(required_qty)
			items = get_stock_item_details({item_code for item_code, warehouse in required_qty})
			keys_to_check = {
				key
				for key in required_qty
				if is_stock_check_needed(items.get(key[0]), key in reserved_stock_keys)
			}

			for d in rows:
				if d.item_code in bundle_items:
					self.validate_bundle_stock(
						d, bundle_items[d.item_code], required_qty, available_qty, keys_to_check
					)
				elif (d.item_code, d.warehouse) in keys_to_check:
					self.validate_item_stock(d, required_qty, available_qty)
			return

		# Fallback stock validation for older ERPNext versions
		for d in self.get("items"):
			if d.serial_and_batch_bundle:
				continue

			if branch and self._is_always_available(d.item_code, branch):
				continue

			if frappe.db.exists("Product Bundle", d.item_code):
				(
					availability,
					is_stock_item,
					is_negative_stock_allowed,
				) = get_product_bundle_stock_availability(d.item_code, d.warehouse, d.stock_qty)

			else:
				availability, is_stock_item, is_negative_stock_allowed = get_stock_availability(
					d.item_code, d.warehouse
				)

			if is_negative_stock_allowed:
				continue

			if isinstance(availability, list):
				error_msgs = []
				for item in availability:
					if flt(item["available"]) < flt(item["required"]):
						error_msgs.append(
							_("<li>Packed Item {0}: Required {1}, Available {2}</li>").format(
								frappe.bold(item["item_code"]),
								frappe.bold(flt(item["required"], 2)),
								frappe.bold(flt(item["available"], 2)),
							)
						)

				if error_msgs:
					frappe.throw(
						_(
							"<b>Row #{0}:</b> Bundle {1} in warehouse {2} has insufficient packed items:<br><div style='margin-top: 15px;'><ul style='line-height: 0.8;'>{3}</ul></div>"
						).format(
							d.idx,
							frappe.bold(d.item_code),
							frappe.bold(d.warehouse),
							"<br>".join(error_msgs),
						),
						title=_("Insufficient Stock for Product Bundle Items"),
						exc=ProductBundleStockValidationError,
					)

			else:
				item_code, warehouse = frappe.bold(d.item_code), frappe.bold(d.warehouse)
				if is_stock_item and flt(availability) <= 0:
					frappe.throw(
						_("Row #{0}: Item {1} has no stock in warehouse {2}.").format(
							d.idx, item_code, warehouse
						),
						title=_("Item Out of Stock"),
					)
				elif flt(availability) < flt(d.stock_qty):
					frappe.throw(
						_(
							"Row #{0}: Item {1} in warehouse {2}: Available {3}, Needed {4}."
						).format(
							d.idx,
							item_code,
							warehouse,
							frappe.bold(flt(availability)),
							frappe.bold(d.stock_qty),
						),
						title=_("Insufficient Stock"),
					)

	@staticmethod
	def _is_always_available(item_code, branch):
		return frappe.db.exists(
			"URY Item Production Configuration",
			{
				"item": item_code,
				"branch": branch,
				"availability_mode": "Always Available",
				"active": 1,
			},
		)

