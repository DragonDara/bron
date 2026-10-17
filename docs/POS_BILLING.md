# URY POS billing adjustments

## Service charge

In URY, open **POS Profiles**, edit the branch's profile, and use the **Waiter Service Charge** section. Enable the charge, set its percentage, and choose a non-group liability account in the profile's company. The same fields are available in ERPNext's POS Profile form. The charge is off by default.

The charge applies only to **Dine In** orders. URY calculates it on the invoice's net item amount after discounts and before taxes. It is an `Actual` accounting charge posted to the selected liability account after tax rows, so no tax is calculated on the charge. The credited waiter must be an active Employee assigned to the invoice branch. The submitted POS Invoice records that employee and the guest-funded amount, and the waiter service payable report totals those amounts by employee for later payout. It appears separately in payment, URY receipts, and sales reports. Ordinary employee commission excludes it; it is not a Staff Discount Policy.

The waiter service report shows accrued charges, not payouts already made. Record each later payout against the same liability account in accounting; reconcile those payments with the per-waiter invoice detail before clearing the liability.

## Register sidebar

The register sidebar also requests a read-only server quote for a dine-in cart when the profile enables service charge. It shows the subtotal, applicable discounts and taxes, service charge, and the inclusive payable total. Quotes are recalculated when the cart or billing context changes; stale totals are hidden while a new quote loads. A failed quote offers a retry and does not present the meal subtotal as payable. Takeaway, delivery, and profiles without service charge retain their existing display.

The cart quote uses the same server price lookup and billing calculator as invoice settlement. It does not save invoices, reserve stock, or create kitchen tickets. When editing a saved draft, its authorized billing context is retained so discounts are included in the preview.

The unsaved cart can preview the service charge without a linked waiter Employee when performer selection is disabled. Performer requirements still apply when enabled on the profile. Saved invoice billing and settlement require an active waiter Employee in the invoice branch before accruing the payable.

## Staff Discount Policy

Create and enable a **Staff Discount Policy** in Frappe Desk. Set its branch (or leave it empty for all branches), validity, eligibility, eligible item groups, discount type and value, and optional caps. A branch policy takes precedence over a global policy. Within the same branch scope, the policy with the highest **Priority** wins; equal top priorities cause a configuration error instead of an arbitrary choice.

The POS payment dialog requests a server-calculated quote. The server resolves the cashier's linked Employee, invoice customer and branch, and item groups from saved documents. It applies percentage or fixed discounts only to eligible invoice lines. Manual percentage discounts remain a separate authorized action and suppress automatic staff policy discounts on that invoice. The policy, applied amount, and service charge are stored on the POS Invoice and shown on URY receipts and reports.

For a new site, run the normal `bench --site <site> migrate` flow after installing or updating URY. Existing sites receive the custom fields and print-format refresh from the v3.31 patches and the payable account field from v3.32. The old income account field is retained, but the charge requires a separately configured liability account. Before enabling the charge in a production profile, have the local accountant confirm the payable account and tax treatment for that jurisdiction.
