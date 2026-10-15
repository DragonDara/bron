import { printWithQz } from '@ury/core';
import {
  getInvoicePrintHtml,
  networkPrint,
  selectNetworkPrinter,
  updatePrintStatus
} from './invoice-api';
import { PosProfileCombined } from './pos-profile-api';
import {
  getShiftReportPrintHtml,
  networkPrintShiftReport,
  SHIFT_REPORT_DOCTYPE,
} from './shift-report-api';

interface PrintOrderParams {
  orderId: string;
  posProfile: PosProfileCombined;
  printFormat?: string | null;
}

export async function printOrder({ orderId, posProfile, printFormat }: PrintOrderParams): Promise<'qz' | 'network' | 'socket'> {
  const { print_type, qz_host, print_format, printer, name, cashier, multiple_cashier } = posProfile;
  const format = printFormat || print_format;

  if (print_type === 'qz') {
    if (!qz_host) {
      throw new Error('QZ host is not set');
    }
    const html = await getInvoicePrintHtml(orderId, format as string);
    await printWithQz(qz_host, html);
    await updatePrintStatus(orderId);
    return 'qz';
  } else if (print_type === 'network') {
    if (cashier && !multiple_cashier) {
      await networkPrint(orderId, printer as string, format as string);
    } else {
      await selectNetworkPrinter(orderId, name, format);
    }
    await updatePrintStatus(orderId);
    return 'network';
  } else {
    // Redirect to printview page
    const url = `/printview?doctype=POS Invoice&name=${orderId}&format=${format}&no_letterhead=1&settings={}&letterhead=No Letterhead&trigger_print=1&_lang=en`;
    window.open(url, '_blank', 'noopener,noreferrer');
    await updatePrintStatus(orderId);
    return 'socket';
  }
}

/** The browser's pop-up blocker stopped the print tab from opening. */
export class PrintPopupBlockedError extends Error {
  constructor() {
    super('The browser blocked the print window');
    this.name = 'PrintPopupBlockedError';
  }
}

interface PrintShiftReportParams {
  report: string;
  printFormat: string;
  posProfile: PosProfileCombined;
}

/**
 * Prints the internal shift report over the profile's existing print channel
 * (QZ / network / browser), with its own print format. Unlike printOrder it
 * never calls updatePrintStatus: that marks a POS Invoice as printed.
 */
export async function printShiftReport({
  report,
  printFormat,
  posProfile,
}: PrintShiftReportParams): Promise<'qz' | 'network' | 'browser'> {
  const { print_type, qz_host } = posProfile;

  if (print_type === 'qz') {
    if (!qz_host) {
      throw new Error('QZ host is not set');
    }
    const html = await getShiftReportPrintHtml(report, printFormat);
    await printWithQz(qz_host, html);
    return 'qz';
  }

  if (print_type === 'network') {
    await networkPrintShiftReport(report);
    return 'network';
  }

  const params = new URLSearchParams({
    doctype: SHIFT_REPORT_DOCTYPE,
    name: report,
    format: printFormat,
    no_letterhead: '1',
    settings: '{}',
    letterhead: 'No Letterhead',
    trigger_print: '1',
  });
  // No 'noopener' here: with it window.open always returns null, so a tab
  // stopped by the pop-up blocker would look like a successful print. The
  // opener link is cut by hand instead.
  const printWindow = window.open(`/printview?${params.toString()}`, '_blank');
  if (!printWindow) {
    throw new PrintPopupBlockedError();
  }
  printWindow.opener = null;
  return 'browser';
}
