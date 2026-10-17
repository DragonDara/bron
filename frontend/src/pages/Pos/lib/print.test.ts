import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrintPopupBlockedError, printShiftReport } from './print';
import type { PosProfileCombined } from './pos-profile-api';

const printWithQzMock = vi.fn();
const getShiftReportPrintHtmlMock = vi.fn();
const networkPrintShiftReportMock = vi.fn();

vi.mock('@ury/core', () => ({
  printWithQz: (...args: unknown[]) => printWithQzMock(...args),
}));

vi.mock('./invoice-api', () => ({
  getInvoicePrintHtml: vi.fn(),
  networkPrint: vi.fn(),
  selectNetworkPrinter: vi.fn(),
  updatePrintStatus: vi.fn(),
}));

vi.mock('./shift-report-api', () => ({
  SHIFT_REPORT_DOCTYPE: 'URY POS Shift Report',
  getShiftReportPrintHtml: (...args: unknown[]) => getShiftReportPrintHtmlMock(...args),
  networkPrintShiftReport: (...args: unknown[]) => networkPrintShiftReportMock(...args),
}));

const profile = (overrides: Partial<PosProfileCombined>) =>
  ({ print_type: 'socket', qz_host: null, ...overrides }) as PosProfileCombined;

const params = (posProfile: PosProfileCombined) => ({
  report: 'POS-CLO-1',
  printFormat: 'URY Cash Shift Report 80mm',
  posProfile,
});

describe('printShiftReport', () => {
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    openSpy = vi.spyOn(window, 'open');
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  it('opens the shift report print view in a new tab', async () => {
    const printWindow = { opener: window } as unknown as Window;
    openSpy.mockReturnValue(printWindow);

    await expect(printShiftReport(params(profile({})))).resolves.toBe('browser');

    const url = String(openSpy.mock.calls[0][0]);
    expect(url).toContain('/printview?');
    expect(url).toContain('doctype=URY+POS+Shift+Report');
    expect(url).toContain('name=POS-CLO-1');
    expect(url).toContain('format=URY+Cash+Shift+Report+80mm');
    expect(url).toContain('trigger_print=1');
    // The new tab must not keep a handle on the POS window.
    expect(printWindow.opener).toBeNull();
  });

  it('reports a blocked pop-up instead of claiming success', async () => {
    openSpy.mockReturnValue(null);

    await expect(printShiftReport(params(profile({})))).rejects.toBeInstanceOf(PrintPopupBlockedError);
  });

  it('prints over QZ with the shift report format', async () => {
    getShiftReportPrintHtmlMock.mockResolvedValue('<p>report</p>');

    await expect(
      printShiftReport(params(profile({ print_type: 'qz', qz_host: 'localhost' })))
    ).resolves.toBe('qz');

    expect(getShiftReportPrintHtmlMock).toHaveBeenCalledWith('POS-CLO-1', 'URY Cash Shift Report 80mm');
    expect(printWithQzMock).toHaveBeenCalledWith('localhost', '<p>report</p>');
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('fails clearly when QZ printing has no host', async () => {
    await expect(printShiftReport(params(profile({ print_type: 'qz' })))).rejects.toThrow('QZ host is not set');
    expect(printWithQzMock).not.toHaveBeenCalled();
  });

  it('prints over the network printer on the server', async () => {
    await expect(printShiftReport(params(profile({ print_type: 'network' })))).resolves.toBe('network');

    expect(networkPrintShiftReportMock).toHaveBeenCalledWith('POS-CLO-1');
    expect(openSpy).not.toHaveBeenCalled();
  });
});
