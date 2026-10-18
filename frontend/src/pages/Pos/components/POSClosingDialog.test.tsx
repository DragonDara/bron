import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../i18n", () => ({
  t: (key: string) => key,
}));

// Stable, mutable identity so a test can switch to a sub-cashier profile.
const { mockPosProfile } = vi.hoisted(() => ({
  mockPosProfile: {
    name: "POS-001",
    multiple_cashier: 0,
    owner: "test_user",
    branch: "Kozhikode",
    company: "URY",
  },
}));

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => ({
    posProfile: mockPosProfile,
  }),
}));

vi.mock("../store/root-store", () => ({
  useRootStore: () => ({
    user: { name: "test_user", full_name: "Test User" },
  }),
}));

vi.mock("../lib/pos-closing-api", () => ({
  getOpenPosOpeningEntries: vi.fn().mockResolvedValue([{
    name: "POO-001",
    user: "test_user",
    period_start_date: "2026-09-09 06:00:00",
  }]),
  getMainCashierPosInvoices: vi.fn().mockResolvedValue([]),
  getSubCashierPosInvoices: vi.fn().mockResolvedValue([]),
  createPosClosingEntry: vi.fn().mockResolvedValue({ name: "PCE-001" }),
  submitPosClosingEntry: vi.fn().mockResolvedValue({}),
  createSubPosClosing: vi.fn().mockResolvedValue({ name: "SPC-001" }),
  submitSubPosClosing: vi.fn().mockResolvedValue({}),
}));

vi.mock("@ury/core", () => ({
  call: {
    get: vi.fn(),
  },
  db: {
    getDoc: vi.fn().mockResolvedValue({
      name: "POO-001",
      balance_details: [{ mode_of_payment: "Cash", opening_amount: 1000 }],
    }),
  },
  formatCurrency: (amount: number) => `Rs. ${amount}`,
}));

vi.mock("../../../lib/pos/checklist-api", () => ({
  getChecklist: vi.fn(),
}));

vi.mock("../lib/shift-report-api", () => ({
  getShiftReportPrintInfo: vi.fn().mockResolvedValue({ report: null, print_format: "", auto_print: 0 }),
}));

const { MockPrintPopupBlockedError } = vi.hoisted(() => ({
  MockPrintPopupBlockedError: class extends Error {},
}));

vi.mock("../lib/print", () => ({
  PrintPopupBlockedError: MockPrintPopupBlockedError,
  printShiftReport: vi.fn(),
}));

vi.mock("./ClosingPaymentTable", () => ({
  default: ({ rows }: any) => (
    <div data-testid="closing-payment-table">
      {rows.map((row: any) => (
        <div key={row.mode_of_payment}>{row.mode_of_payment}</div>
      ))}
    </div>
  ),
}));

vi.mock("./ChecklistGateDialog", () => ({
  default: ({ onComplete }: any) => (
    <div data-testid="checklist-gate-dialog">
      <button onClick={onComplete}>Complete</button>
    </div>
  ),
}));

import POSClosingDialog from "./POSClosingDialog";
import * as checklistApi from "../../../lib/pos/checklist-api";
import * as posClosingApi from "../lib/pos-closing-api";
import * as shiftReportApi from "../lib/shift-report-api";
import * as printApi from "../lib/print";

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  onClosingSubmitted: vi.fn(),
};

describe("POSClosingDialog", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders dialog", async () => {
    render(<POSClosingDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("pos_closing.title")).toBeInTheDocument();
    });
  });

  it("shows loading state", () => {
    render(<POSClosingDialog {...defaultProps} />);
    expect(screen.getByText("pos_closing.loading")).toBeInTheDocument();
  });

  it("loads and displays totals", async () => {
    render(<POSClosingDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText("pos_closing.grand_total")).toBeInTheDocument();
    });
  });

  it("renders action buttons", async () => {
    render(<POSClosingDialog {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /common.cancel/i })).toBeInTheDocument();
    });
  });

  it("closes when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<POSClosingDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /common.cancel/i })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /common.cancel/i });
    await user.click(cancelButton);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("gates closing submission on a pending Closing checklist before creating the doc", async () => {
    const user = userEvent.setup();
    // First poll: checklist pending (role-based Dependent Checklist goal
    // without a Quality Review). After completion: Complete.
    (checklistApi.getChecklist as any)
      .mockResolvedValueOnce({ logStatus: null })
      .mockResolvedValue({ logStatus: "Complete" });

    render(<POSClosingDialog {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "pos_closing.submit" })).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: "pos_closing.submit" }));

    // The checklist gate fires BEFORE any closing doc is created.
    await waitFor(() => {
      expect(screen.getByTestId("checklist-gate-dialog")).toBeInTheDocument();
    });
    expect(posClosingApi.createPosClosingEntry).not.toHaveBeenCalled();
    expect(posClosingApi.createSubPosClosing).not.toHaveBeenCalled();

    // Completing the checklist resumes the close submission.
    await user.click(screen.getByRole("button", { name: "Complete" }));
    await waitFor(() => {
      expect(posClosingApi.createPosClosingEntry).toHaveBeenCalled();
    });
  });
});

describe("POSClosingDialog shift report printing", () => {
  const printInfo = {
    report: "PCE-001",
    print_format: "URY Cash Shift Report 80mm",
    auto_print: 1,
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockPosProfile.multiple_cashier = 0;
    mockPosProfile.owner = "test_user";
    vi.mocked(checklistApi.getChecklist).mockResolvedValue({ logStatus: "Complete" } as never);
    vi.mocked(shiftReportApi.getShiftReportPrintInfo).mockResolvedValue(printInfo);
    vi.mocked(printApi.printShiftReport).mockResolvedValue("qz");
  });

  afterEach(() => {
    cleanup();
    mockPosProfile.multiple_cashier = 0;
    mockPosProfile.owner = "test_user";
  });

  const closeShift = async () => {
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "pos_closing.submit" }));
    return user;
  };

  it("prints the report once after a successful main closing", async () => {
    render(<POSClosingDialog {...defaultProps} />);
    await closeShift();

    // Successful close continues to the post-close checklist step.
    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(shiftReportApi.getShiftReportPrintInfo).toHaveBeenCalledWith("PCE-001");
    expect(printApi.printShiftReport).toHaveBeenCalledTimes(1);
    expect(printApi.printShiftReport).toHaveBeenCalledWith({
      report: "PCE-001",
      printFormat: "URY Cash Shift Report 80mm",
      posProfile: mockPosProfile,
    });
  });

  it("hands the closing to the parent once the checklist is done", async () => {
    const onClosingSubmitted = vi.fn();
    render(<POSClosingDialog {...defaultProps} onClosingSubmitted={onClosingSubmitted} />);
    const user = await closeShift();

    await user.click(await screen.findByRole("button", { name: "Complete" }));

    await waitFor(() =>
      expect(onClosingSubmitted).toHaveBeenCalledWith({ posClosingEntry: "PCE-001" })
    );
  });

  it("explains a blocked print pop-up and prints on retry", async () => {
    vi.mocked(printApi.printShiftReport).mockRejectedValueOnce(new MockPrintPopupBlockedError());
    render(<POSClosingDialog {...defaultProps} />);
    const user = await closeShift();

    expect(await screen.findByText("pos_closing.report_popup_blocked")).toBeInTheDocument();

    // The retry is a real click, which browsers let open a pop-up.
    await user.click(screen.getByRole("button", { name: "pos_closing.report_print_again" }));

    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(printApi.printShiftReport).toHaveBeenCalledTimes(2);
  });

  it("does not print when auto print is off", async () => {
    vi.mocked(shiftReportApi.getShiftReportPrintInfo).mockResolvedValue({ ...printInfo, auto_print: 0 });
    render(<POSClosingDialog {...defaultProps} />);
    await closeShift();

    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(printApi.printShiftReport).not.toHaveBeenCalled();
  });

  it("keeps the closing and offers a retry when the printer fails", async () => {
    vi.mocked(printApi.printShiftReport).mockRejectedValueOnce(new Error("QZ Tray is not running"));
    render(<POSClosingDialog {...defaultProps} />);
    const user = await closeShift();

    expect(await screen.findByText("pos_closing.report_print_failed_title")).toBeInTheDocument();
    expect(screen.getByText("QZ Tray is not running")).toBeInTheDocument();
    expect(screen.queryByText("pos_closing.submit_failed")).not.toBeInTheDocument();
    expect(posClosingApi.submitPosClosingEntry).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "pos_closing.report_print_again" }));

    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(printApi.printShiftReport).toHaveBeenCalledTimes(2);
    expect(posClosingApi.submitPosClosingEntry).toHaveBeenCalledTimes(1);
  });

  it("can continue without the printout", async () => {
    vi.mocked(printApi.printShiftReport).mockRejectedValue(new Error("Printer offline"));
    render(<POSClosingDialog {...defaultProps} />);
    const user = await closeShift();

    await user.click(await screen.findByRole("button", { name: "pos_closing.report_continue" }));

    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(printApi.printShiftReport).toHaveBeenCalledTimes(1);
  });

  it("never prints a shift report for a Sub POS Closing", async () => {
    mockPosProfile.multiple_cashier = 1;
    mockPosProfile.owner = "main_cashier";
    const onClosingSubmitted = vi.fn();
    render(<POSClosingDialog {...defaultProps} onClosingSubmitted={onClosingSubmitted} />);
    const user = await closeShift();

    expect(await screen.findByTestId("checklist-gate-dialog")).toBeInTheDocument();
    expect(posClosingApi.submitSubPosClosing).toHaveBeenCalled();
    expect(shiftReportApi.getShiftReportPrintInfo).not.toHaveBeenCalled();
    expect(printApi.printShiftReport).not.toHaveBeenCalled();

    // No POS Closing Entry, so nothing for the parent to reprint.
    await user.click(screen.getByRole("button", { name: "Complete" }));
    await waitFor(() =>
      expect(onClosingSubmitted).toHaveBeenCalledWith({ posClosingEntry: null })
    );
  });
});
