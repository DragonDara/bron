import frappe


@frappe.whitelist()
def cancel_check():
    if frappe.has_permission("POS Invoice", "cancel", throw=False):
        permission = True
    else:
        permission = False
    return permission
