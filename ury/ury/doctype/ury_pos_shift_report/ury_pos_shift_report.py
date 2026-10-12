# Copyright (c) 2026, Tridz Technologies Pvt. Ltd and contributors
# For license information, please see license.txt

from frappe.model.document import Document


class URYPOSShiftReport(Document):
	"""Immutable snapshot of a submitted POS Closing Entry.

	Only created and cancelled by `ury.ury.api.ury_cash_shift_report`; no role
	has create/write permission, so the stored figures never change after the
	closing that produced them.
	"""

	pass
