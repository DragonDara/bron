# URY POS billing adjustments

## Service charge

In URY, open **POS Profiles**, edit the branch's profile, and use the **Service Charge** section. Enable the charge, set its percentage, and choose a non-group income account in the profile's company. The same fields are available in ERPNext's POS Profile form. The charge is off by default.

The charge applies only to **Dine In** orders. URY calculates it on the invoice's net item amount after discounts and before taxes. It is an `Actual` accounting charge posted to the selected income account after tax rows, so no tax is calculated on the service charge. It appears separately in payment, URY receipts, and sales reports. Employee commission excludes it.

## Staff Discount Policy

Create and enable a **Staff Discount Policy** in Frappe Desk. Set its branch (or leave it empty for all branches), validity, eligibility, eligible item groups, discount type and value, and optional caps. A branch policy takes precedence over a global policy. Within the same branch scope, the policy with the highest **Priority** wins; equal top priorities cause a configuration error instead of an arbitrary choice.

The POS payment dialog requests a server-calculated quote. The server resolves the cashier's linked Employee, invoice customer and branch, and item groups from saved documents. It applies percentage or fixed discounts only to eligible invoice lines. Manual percentage discounts remain a separate authorized action and suppress automatic staff policy discounts on that invoice. The policy, applied amount, and service charge are stored on the POS Invoice and shown on URY receipts and reports.

For a new site, run the normal `bench --site <site> migrate` flow after installing or updating URY. Existing sites receive the custom fields and print-format refresh from the v3.31 patches. Before enabling the charge in a production profile, have the local accountant confirm the selected income account and the approved tax treatment for that jurisdiction.
