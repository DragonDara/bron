/**
 * API facade for the internal shift report (URY POS Shift Report) that the
 * backend snapshots when a POS Closing Entry is submitted.
 *
 * Backend source: ury/ury/api/ury_cash_shift_report.py
 */

import { call } from '@ury/core';

export const SHIFT_REPORT_DOCTYPE = 'URY POS Shift Report';

export interface ShiftReportPrintInfo {
  /** Report name, or null if the backend failed to create it (see Error Log). */
  report: string | null;
  /** The profile's shift report layout -- never the receipt print_format. */
  print_format: string;
  /** POS Profile "Auto Print Shift Report" (1 = print right after closing). */
  auto_print: number;
}

export async function getShiftReportPrintInfo(posClosingEntry: string): Promise<ShiftReportPrintInfo> {
  const response = await call.get<{ message: ShiftReportPrintInfo }>(
    'ury.ury.api.ury_cash_shift_report.get_shift_report_print_info',
    { pos_closing_entry: posClosingEntry }
  );
  return response.message;
}

export async function getShiftReportPrintHtml(report: string, printFormat: string): Promise<string> {
  const response = await call.get<{ message: { html: string } }>(
    'frappe.www.printview.get_html_and_style',
    {
      doc: SHIFT_REPORT_DOCTYPE,
      name: report,
      print_format: printFormat,
      no_letterhead: 1,
      letterhead: 'No Letterhead',
      settings: {},
    }
  );
  return response.message.html;
}

/** Server-side CUPS print to the profile's bill printer; throws on failure. */
export async function networkPrintShiftReport(report: string): Promise<void> {
  await call.post('ury.ury.api.ury_cash_shift_report.network_print_shift_report', { report });
}
