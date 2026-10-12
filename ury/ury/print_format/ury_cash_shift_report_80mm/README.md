# URY Cash Shift Report 80mm

Internal (non-fiscal) Z-report for an 80 mm thermal roll, printed from a `URY POS Shift Report`. The report is an immutable snapshot taken when the POS Closing Entry is submitted, so this template only displays stored values and never recalculates anything.

The editable source is `ury_cash_shift_report_80mm.html`. Run `node build.mjs` after editing it to regenerate the standard Frappe `ury_cash_shift_report_80mm.json` record, then run `bench --site <site> migrate`.

Layout notes:

- Content is 72 mm wide, the printable area of most 80 mm printers.
- Payment-method lines with no sales or no returns are hidden rather than printed as zero.
- Labels are Russian source strings wrapped in `_()` so they stay translatable.
- Only sales and sale returns are shown; URY has no purchase or cash top-up operations.
