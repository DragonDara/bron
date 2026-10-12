"""Internal (non-fiscal) cash shift report.

One `URY POS Shift Report` is snapshotted for every submitted POS Closing
Entry. Sub POS Closing is a separate doctype and never reaches these hooks, so
sub-cashier closings never produce a report.

Figures come only from the invoices recorded on the closing entry itself
(`pos_transactions`), using the same per-payment arithmetic as the closing's
expected amounts: the invoice's change is taken off the payment row booked to
`account_for_change_amount` (see `refresh_payments` in ERPNext's
pos_closing_entry.js and `POSClosingDialog.tsx`).
"""

import frappe
from frappe import _
from frappe.utils import cint, flt

REPORT_DOCTYPE = "URY POS Shift Report"
DEFAULT_PRINT_FORMAT = "URY Cash Shift Report 80mm"
SAVEPOINT = "ury_pos_shift_report"


def create_shift_report(doc, method=None):
	"""POS Closing Entry on_submit.

	Never blocks the closing: the money is already reconciled, so a failure
	here is logged and the report can be rebuilt with
	`regenerate_shift_report`.
	"""
	if frappe.db.exists(REPORT_DOCTYPE, {"pos_closing_entry": doc.name}):
		return

	frappe.db.savepoint(SAVEPOINT)
	try:
		branch = _closing_branch(doc)
		_insert_report(doc, branch=branch, terminal=_current_terminal(branch))
	except Exception:
		frappe.db.rollback(save_point=SAVEPOINT)
		frappe.log_error(title=f"URY POS Shift Report failed for {doc.name}")


def cancel_shift_report(doc, method=None):
	"""POS Closing Entry on_cancel: the snapshot follows its closing."""
	name = frappe.db.get_value(REPORT_DOCTYPE, {"pos_closing_entry": doc.name, "docstatus": 1})
	if not name:
		return
	report = frappe.get_doc(REPORT_DOCTYPE, name)
	report.flags.ignore_permissions = True
	report.cancel()


@frappe.whitelist(methods=["POST"])
def regenerate_shift_report(pos_closing_entry):
	"""Rebuild a report that failed to be created on submit.

	The original device is unknown at this point, so the terminal is left
	empty rather than guessed.
	"""
	frappe.only_for("System Manager")

	closing = frappe.get_doc("POS Closing Entry", pos_closing_entry)
	if closing.docstatus != 1:
		frappe.throw(_("POS Closing Entry {0} is not submitted.").format(closing.name))
	if frappe.db.exists(REPORT_DOCTYPE, {"pos_closing_entry": closing.name}):
		frappe.throw(_("A shift report already exists for {0}.").format(closing.name))

	return _insert_report(closing, branch=_closing_branch(closing), terminal=None).name


def build_shift_totals(invoices, payments):
	"""Aggregate submitted POS invoices and their payment rows.

	Returns the report-level totals plus one row per mode of payment. Return
	amounts are kept positive for display; `net = sales - returns`. Counts are
	per invoice, not per item or payment row, so an invoice split across cash
	and card counts once in the totals and once under each mode.
	"""
	invoices_by_name = {inv.name: inv for inv in invoices}
	modes = {}

	for payment in payments:
		invoice = invoices_by_name.get(payment.parent)
		if not invoice:
			continue

		amount = flt(payment.amount)
		if invoice.account_for_change_amount and payment.account == invoice.account_for_change_amount:
			amount -= flt(invoice.change_amount)
		if not amount:
			# POS invoices carry a zero row for every mode on the profile.
			continue

		mode = modes.setdefault(
			payment.mode_of_payment,
			{"sales_amount": 0.0, "return_amount": 0.0, "sales": set(), "returns": set()},
		)
		if invoice.is_return:
			mode["return_amount"] += abs(amount)
			mode["returns"].add(invoice.name)
		else:
			mode["sales_amount"] += amount
			mode["sales"].add(invoice.name)

	payment_rows = []
	for mode_of_payment in sorted(modes):
		mode = modes[mode_of_payment]
		sales_amount = flt(mode["sales_amount"], 2)
		return_amount = flt(mode["return_amount"], 2)
		payment_rows.append(
			{
				"mode_of_payment": mode_of_payment,
				"sales_amount": sales_amount,
				"sales_count": len(mode["sales"]),
				"return_amount": return_amount,
				"return_count": len(mode["returns"]),
				"net_amount": flt(sales_amount - return_amount, 2),
			}
		)

	sales_amount = flt(sum(row["sales_amount"] for row in payment_rows), 2)
	return_amount = flt(sum(row["return_amount"] for row in payment_rows), 2)
	return {
		"sales_amount": sales_amount,
		"sales_count": sum(1 for inv in invoices if not inv.is_return),
		"return_amount": return_amount,
		"return_count": sum(1 for inv in invoices if inv.is_return),
		"grand_total": flt(sales_amount - return_amount, 2),
		"payments": payment_rows,
	}


def _insert_report(closing, branch, terminal):
	invoices, payments = _fetch_closing_invoices(closing)
	report = frappe.get_doc(
		{
			"doctype": REPORT_DOCTYPE,
			"pos_closing_entry": closing.name,
			"pos_opening_entry": closing.pos_opening_entry,
			"pos_profile": closing.pos_profile,
			"branch": branch,
			"company": closing.company,
			"cashier": closing.user,
			"terminal": terminal,
			"posting_date": closing.posting_date,
			"period_start_date": closing.period_start_date,
			"period_end_date": closing.period_end_date,
			**build_shift_totals(invoices, payments),
			**shift_report_print_options(closing.pos_profile),
		}
	)
	report.flags.ignore_permissions = True
	report.insert()
	report.submit()
	return report


def shift_report_print_options(pos_profile):
	"""Section toggles copied from the POS Profile onto the snapshot, so a
	reprint never changes when the profile is edited later. Unset means on."""
	settings = (
		frappe.db.get_value(
			"POS Profile",
			pos_profile,
			["custom_shift_report_show_payment_modes", "custom_shift_report_show_returns"],
			as_dict=True,
		)
		or {}
	)
	return {
		"show_payment_modes": _enabled(settings.get("custom_shift_report_show_payment_modes")),
		"show_returns": _enabled(settings.get("custom_shift_report_show_returns")),
	}


def _enabled(value):
	return 1 if value is None else cint(value)


def get_shift_report_print_format(pos_profile):
	"""The profile's chosen shift report layout, else the bundled 80 mm one.
	Never the profile's receipt `print_format`."""
	return (
		frappe.db.get_value("POS Profile", pos_profile, "custom_shift_report_print_format")
		or DEFAULT_PRINT_FORMAT
	)


def _fetch_closing_invoices(closing):
	invoice_names = [row.pos_invoice for row in closing.get("pos_transactions") or [] if row.pos_invoice]
	if not invoice_names:
		return [], []

	# docstatus = 1 drops anything cancelled since it was listed on the closing.
	invoices = frappe.get_all(
		"POS Invoice",
		filters={"name": ["in", invoice_names], "docstatus": 1},
		fields=["name", "is_return", "change_amount", "account_for_change_amount"],
	)
	if not invoices:
		return [], []

	payments = frappe.get_all(
		"Sales Invoice Payment",
		filters={"parenttype": "POS Invoice", "parent": ["in", [inv.name for inv in invoices]]},
		fields=["parent", "mode_of_payment", "amount", "account"],
	)
	return invoices, payments


def _closing_branch(closing):
	return closing.get("branch") or frappe.db.get_value("POS Profile", closing.pos_profile, "branch")


def _current_terminal(branch):
	"""The enrolled device that sent this request, from its httpOnly
	credential cookie -- never a value supplied by the browser. A terminal
	enrolled for another branch is not trusted for this shift."""
	from ury.ury.api.pos_pin import _resolve_terminal_from_cookie

	terminal = _resolve_terminal_from_cookie()
	if not terminal:
		return None
	if branch and terminal.branch and terminal.branch != branch:
		return None
	return terminal.name
