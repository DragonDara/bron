"""Print Format / DocType pairing guard.

The POS Profile holds two layouts side by side: the customer receipt
(`print_format`, for POS Invoice) and the internal shift report
(`custom_shift_report_print_format`, for URY POS Shift Report). Each must only
ever render the DocType it was made for -- a receipt layout cannot print a
shift report and vice versa.
"""

import frappe
from frappe import _

RECEIPT_DOCTYPE = "POS Invoice"
SHIFT_REPORT_DOCTYPE = "URY POS Shift Report"


def validate_print_format_doctype(print_format, doctype, label=None):
	"""Throw unless `print_format` exists and is a format for `doctype`.

	An empty `print_format` is allowed: callers fall back to their default.
	"""
	if not print_format:
		return

	format_doctype = frappe.db.get_value("Print Format", print_format, "doc_type")
	if format_doctype == doctype:
		return

	frappe.throw(
		_("{0} {1} is a print format for {2}, not {3}.").format(
			label or _("Print Format"),
			frappe.bold(print_format),
			format_doctype or _("an unknown document type"),
			doctype,
		),
		title=_("Wrong Print Format"),
	)
