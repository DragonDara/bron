import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import POSCloseFlow from "./POSCloseFlow";

vi.mock("../i18n", () => ({
  t: (key: string) => key,
}));

const { closingResult, mockPosProfile, MockPrintPopupBlockedError } = vi.hoisted(() => ({
  // What the mocked closing dialog reports back; a test can switch it to a
  // main closing (with a shift report) or a Sub POS Closing (none).
  closingResult: { posClosingEntry: null as string | null },
  mockPosProfile: { name: "POS-001", print_type: "socket" },
  MockPrintPopupBlockedError: class extends Error {},
}));

const getShiftReportPrintInfoMock = vi.fn();
const printShiftReportMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("./POSClosingDialog", () => ({
  default: ({ onOpenChange, onClosingSubmitted }: any) => (
    <div data-testid="pos-closing-dialog">
      <button onClick={() => onClosingSubmitted?.({ ...closingResult })}>Submit Closing</button>
    </div>
  ),
}));

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => ({ posProfile: mockPosProfile }),
}));

vi.mock("../lib/shift-report-api", () => ({
  getShiftReportPrintInfo: (...args: unknown[]) => getShiftReportPrintInfoMock(...args),
}));

vi.mock("../lib/print", () => ({
  PrintPopupBlockedError: MockPrintPopupBlockedError,
  printShiftReport: (...args: unknown[]) => printShiftReportMock(...args),
}));

vi.mock("@ury/ui", async () => {
  const actual = await vi.importActual<typeof import("@ury/ui")>("@ury/ui");
  return {
    ...actual,
    showToast: { ...actual.showToast, error: (message: string) => toastErrorMock(message) },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderPOSCloseFlow = () => {
  return render(
    <BrowserRouter>
      <POSCloseFlow />
    </BrowserRouter>
  );
};

describe("POSCloseFlow", () => {
  beforeEach(() => {
    cleanup();
    closingResult.posClosingEntry = null;
  });

  it("renders close pos card with button", () => {
    renderPOSCloseFlow();
    expect(screen.getByText("settings.close_pos_title")).toBeInTheDocument();
    expect(screen.getByText("settings.close_pos_description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings.close_pos_button/i })).toBeInTheDocument();
  });

  it("opens confirmation dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();

    const closeButton = screen.getByRole("button", { name: /settings.close_pos_button/i });
    await user.click(closeButton);

    expect(screen.getByText("settings.confirm_title")).toBeInTheDocument();
    expect(screen.getByText("settings.confirm_description")).toBeInTheDocument();
  });

  it("closes confirmation dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();

    const closeButton = screen.getByRole("button", { name: /settings.close_pos_button/i });
    await user.click(closeButton);

    const cancelButton = screen.getByRole("button", { name: /settings.confirm_cancel/i });
    await user.click(cancelButton);

    expect(screen.queryByText("settings.confirm_title")).not.toBeInTheDocument();
  });

  it("opens POSClosingDialog when confirm is clicked", async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();

    const closeButton = screen.getByRole("button", { name: /settings.close_pos_button/i });
    await user.click(closeButton);

    const confirmButton = screen.getByRole("button", { name: /settings.confirm_button/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByTestId("pos-closing-dialog")).toBeInTheDocument();
    });
  });

  it("shows success message after closing is submitted", async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();

    const closeButton = screen.getByRole("button", { name: /settings.close_pos_button/i });
    await user.click(closeButton);

    const confirmButton = screen.getByRole("button", { name: /settings.confirm_button/i });
    await user.click(confirmButton);

    const submitButton = await screen.findByText("Submit Closing");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("settings.closed_title")).toBeInTheDocument();
      expect(screen.getByText("settings.closed_description")).toBeInTheDocument();
    });
  });

  it("shows back to dashboard button after closing is submitted", async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();

    const closeButton = screen.getByRole("button", { name: /settings.close_pos_button/i });
    await user.click(closeButton);

    const confirmButton = screen.getByRole("button", { name: /settings.confirm_button/i });
    await user.click(confirmButton);

    const submitButton = await screen.findByText("Submit Closing");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /settings.back_to_dashboard/i })).toBeInTheDocument();
    });
  });
});

describe("POSCloseFlow shift report reprint", () => {
  const printInfo = {
    report: "PCE-001",
    print_format: "URY Cash Shift Report 80mm",
    auto_print: 1,
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    closingResult.posClosingEntry = "PCE-001";
    getShiftReportPrintInfoMock.mockResolvedValue(printInfo);
    printShiftReportMock.mockResolvedValue("browser");
  });

  const closeShift = async () => {
    const user = userEvent.setup();
    renderPOSCloseFlow();
    await user.click(screen.getByRole("button", { name: /settings.close_pos_button/i }));
    await user.click(screen.getByRole("button", { name: /settings.confirm_button/i }));
    await user.click(await screen.findByText("Submit Closing"));
    await screen.findByText("settings.closed_title");
    return user;
  };

  it("offers to print the shift report again after closing", async () => {
    const user = await closeShift();

    await user.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(printShiftReportMock).toHaveBeenCalledTimes(1));
    expect(getShiftReportPrintInfoMock).toHaveBeenCalledWith("PCE-001");
    expect(printShiftReportMock).toHaveBeenCalledWith({
      report: "PCE-001",
      printFormat: "URY Cash Shift Report 80mm",
      posProfile: mockPosProfile,
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("has no print button after a Sub POS Closing", async () => {
    closingResult.posClosingEntry = null;
    await closeShift();

    expect(screen.queryByRole("button", { name: /settings.print_shift_report/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings.back_to_dashboard/i })).toBeInTheDocument();
  });

  it("tells the cashier when the browser blocks the print window", async () => {
    printShiftReportMock.mockRejectedValueOnce(new MockPrintPopupBlockedError());
    const user = await closeShift();

    await user.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith("pos_closing.report_popup_blocked"));
    expect(screen.getByRole("button", { name: /settings.print_shift_report/ })).toBeEnabled();
  });

  it("reports a missing shift report without trying to print", async () => {
    getShiftReportPrintInfoMock.mockResolvedValue({ ...printInfo, report: null });
    const user = await closeShift();

    await user.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith("pos_closing.report_missing"));
    expect(printShiftReportMock).not.toHaveBeenCalled();
  });
});
