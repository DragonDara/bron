import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import POSCloseFlow from "./POSCloseFlow";
import { BrowserRouter } from "react-router-dom";

const { closingResult, mockPosProfile, MockPrintPopupBlockedError } = vi.hoisted(() => ({
  // What the mocked closing dialog reports back; a test can switch it to a
  // main closing (with a shift report) or a Sub POS Closing (none).
  closingResult: { posClosingEntry: null as string | null },
  mockPosProfile: { name: "POS-1", print_type: "socket" },
  MockPrintPopupBlockedError: class extends Error {},
}));

const getShiftReportPrintInfoMock = vi.fn();
const printShiftReportMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("./POSClosingDialog", () => ({
  default: ({ open, onOpenChange, onClosingSubmitted }: any) => (
    open ? (
      <div data-testid="pos-closing-dialog">
        <button onClick={() => onClosingSubmitted?.({ ...closingResult })}>Complete</button>
      </div>
    ) : null
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

vi.mock("../i18n", () => ({
  t: (key: string) => key,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("POSCloseFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    closingResult.posClosingEntry = null;
  });

  it("renders the initial close POS card", () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    expect(screen.getByText("settings.close_pos_title")).toBeInTheDocument();
    expect(screen.getByText("settings.close_pos_description")).toBeInTheDocument();
  });

  it("renders a danger button to close POS", () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    expect(closeButton).toBeInTheDocument();
  });

  it("opens confirmation dialog when close button is clicked", async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText("settings.confirm_title")).toBeInTheDocument();
      expect(screen.getByText("settings.confirm_description")).toBeInTheDocument();
    });
  });

  it("closes confirmation dialog when cancel is clicked", async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    await userEvent.click(closeButton);

    const cancelButton = await screen.findByText("settings.confirm_cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("settings.confirm_title")).not.toBeInTheDocument();
    });
  });

  it("opens POSClosingDialog when confirm button is clicked", async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    await userEvent.click(closeButton);

    const confirmButton = await screen.findByText("settings.confirm_button");
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByTestId("pos-closing-dialog")).toBeInTheDocument();
    });
  });

  it("shows success message after closing is submitted", async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    await userEvent.click(closeButton);

    const confirmButton = await screen.findByText("settings.confirm_button");
    await userEvent.click(confirmButton);

    const completeButton = await screen.findByText("Complete");
    await userEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText("settings.closed_title")).toBeInTheDocument();
      expect(screen.getByText("settings.closed_description")).toBeInTheDocument();
    });
  });

  it("shows back to dashboard button after successful close", async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );

    const closeButton = screen.getByText("settings.close_pos_button");
    await userEvent.click(closeButton);

    const confirmButton = await screen.findByText("settings.confirm_button");
    await userEvent.click(confirmButton);

    const completeButton = await screen.findByText("Complete");
    await userEvent.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText("settings.back_to_dashboard")).toBeInTheDocument();
    });
  });
});

describe("POSCloseFlow shift report reprint", () => {
  const printInfo = {
    report: "POS-CLO-1",
    print_format: "URY Cash Shift Report 80mm",
    auto_print: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    closingResult.posClosingEntry = "POS-CLO-1";
    getShiftReportPrintInfoMock.mockResolvedValue(printInfo);
    printShiftReportMock.mockResolvedValue("browser");
  });

  const closeShift = async () => {
    render(
      <BrowserRouter>
        <POSCloseFlow />
      </BrowserRouter>
    );
    await userEvent.click(screen.getByText("settings.close_pos_button"));
    await userEvent.click(await screen.findByText("settings.confirm_button"));
    await userEvent.click(await screen.findByText("Complete"));
    await screen.findByText("settings.closed_title");
  };

  it("offers to print the shift report again after closing", async () => {
    await closeShift();

    await userEvent.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(printShiftReportMock).toHaveBeenCalledTimes(1));
    expect(getShiftReportPrintInfoMock).toHaveBeenCalledWith("POS-CLO-1");
    expect(printShiftReportMock).toHaveBeenCalledWith({
      report: "POS-CLO-1",
      printFormat: "URY Cash Shift Report 80mm",
      posProfile: mockPosProfile,
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("has no print button after a Sub POS Closing", async () => {
    closingResult.posClosingEntry = null;
    await closeShift();

    expect(screen.queryByRole("button", { name: /settings.print_shift_report/ })).not.toBeInTheDocument();
    expect(screen.getByText("settings.back_to_dashboard")).toBeInTheDocument();
  });

  it("tells the cashier when the browser blocks the print window", async () => {
    printShiftReportMock.mockRejectedValueOnce(new MockPrintPopupBlockedError());
    await closeShift();

    await userEvent.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith("pos_closing.report_popup_blocked"));
    // The button stays usable for another attempt.
    expect(screen.getByRole("button", { name: /settings.print_shift_report/ })).toBeEnabled();
  });

  it("reports a missing shift report without trying to print", async () => {
    getShiftReportPrintInfoMock.mockResolvedValue({ ...printInfo, report: null });
    await closeShift();

    await userEvent.click(screen.getByRole("button", { name: /settings.print_shift_report/ }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith("pos_closing.report_missing"));
    expect(printShiftReportMock).not.toHaveBeenCalled();
  });
});
