import { describe, expect, it, vi, beforeEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShiftInvoices } from "./ShiftInvoices";
import { formatShiftLabel, type Shift } from "./shiftLabel";

vi.mock("../../context/BranchContext", () => ({
  useBranchContext: () => ({ activeBranchId: "Main" }),
}));

vi.mock("@ury/core", () => ({
  call: vi.fn(),
  formatCurrency: (val: number) => val.toString(),
  resolveUryLanguage: () => "en",
}));

vi.mock("../../components/DeskLink", () => ({
  DeskLink: () => <span>link</span>,
}));

import { call } from "@ury/core";

const closedShift: Shift = {
  name: "POS-OPE-0002",
  branch: "Main",
  cashier: "aidos@example.com",
  cashier_name: "Aidos",
  start: "2026-09-29 08:02:00",
  end: "2026-09-29 20:15:00",
  is_open: false,
  is_long: false,
};

const olderShift: Shift = { ...closedShift, name: "POS-OPE-0001", cashier_name: "Madina", start: "2026-09-28 08:10:00", end: "2026-09-28 20:40:00" };

const summary = { invoice_count: 2, total_paid: 16500, average_ticket: 8250, credit_total: 9500 };

const invoices = [
  {
    row_no: 1, invoice: "INV-00123", posting_date: "2026-09-29", posting_time: "09:10",
    courses: ["Sedan"], items: [{ item_name: "Body", qty: 1 }, { item_name: "Mats", qty: 2 }],
    employee: "HR-EMP-1", employee_name: "Erlan", paid_amount: 7000, is_return: false, on_credit: false,
  },
  {
    row_no: 2, invoice: "INV-00124", posting_date: "2026-09-29", posting_time: "10:20",
    courses: ["SUV"], items: [{ item_name: "Complex", qty: 1 }],
    employee: null, employee_name: null, paid_amount: 9500, is_return: false, on_credit: true,
  },
];

function mockApi(overrides: Record<string, unknown> = {}) {
  const responses: Record<string, unknown> = {
    "ury.ury.report_api.shift_invoices.get_shifts": { shifts: [closedShift, olderShift] },
    "ury.ury.report_api.shift_invoices.get_shift_invoices": { shift: closedShift, invoices, summary, truncated: false },
    "ury.ury.report_api.shift_invoices.get_period_invoices": {
      invoices, summary, pagination: { page: 1, page_size: 50, total: 120, total_pages: 3 },
    },
    ...overrides,
  };
  vi.mocked(call).mockImplementation(async (method: string) => ({ message: responses[method] }));
}

describe("ShiftInvoices", () => {
  beforeEach(() => {
    cleanup();
    vi.mocked(call).mockReset();
  });

  it("renders page title", () => {
    mockApi();
    render(<ShiftInvoices />);
    expect(screen.getByText("Shift Invoices")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    vi.mocked(call).mockReturnValue(new Promise(() => {}));
    render(<ShiftInvoices />);
    expect(screen.getByText(/Loading|loading/)).toBeInTheDocument();
  });

  it("loads the newest shift by default and renders invoice columns", async () => {
    mockApi();
    render(<ShiftInvoices />);

    await waitFor(() => expect(screen.getByText("INV-00123")).toBeInTheDocument());
    expect(call).toHaveBeenCalledWith("ury.ury.report_api.shift_invoices.get_shift_invoices", { shift: "POS-OPE-0002" });
    for (const header of ["Course", "Items", "Employee", "Paid"]) {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    }
    expect(screen.getByText("Sedan")).toBeInTheDocument();
    expect(screen.getByText("Body, Mats ×2")).toBeInTheDocument();
    expect(screen.getByText("Erlan")).toBeInTheDocument();
    // KPI label plus the badge on the credit invoice.
    expect(screen.getAllByText("On Credit")).toHaveLength(2);
    expect(screen.getByText("Average Ticket")).toBeInTheDocument();
  });

  it("warns when the shift is still open", async () => {
    const openShift = { ...closedShift, end: null, is_open: true };
    mockApi({
      "ury.ury.report_api.shift_invoices.get_shifts": { shifts: [openShift] },
      "ury.ury.report_api.shift_invoices.get_shift_invoices": { shift: openShift, invoices, summary, truncated: false },
    });
    render(<ShiftInvoices />);
    await waitFor(() => expect(screen.getByText(/Shift is still open/)).toBeInTheDocument());
  });

  it("shows an empty state when there are no shifts in the period", async () => {
    mockApi({ "ury.ury.report_api.shift_invoices.get_shifts": { shifts: [] } });
    render(<ShiftInvoices />);
    await waitFor(() => expect(screen.getByText("No results found.")).toBeInTheDocument());
    expect(screen.getByText("No shifts in this period")).toBeInTheDocument();
    expect(call).not.toHaveBeenCalledWith("ury.ury.report_api.shift_invoices.get_shift_invoices", expect.anything());
  });

  it("switches to period mode with pagination", async () => {
    mockApi();
    render(<ShiftInvoices />);
    await waitFor(() => expect(screen.getByText("INV-00123")).toBeInTheDocument());

    fireEvent.click(screen.getByText("By Period"));

    await waitFor(() => expect(screen.getByText("Page 1 of 3")).toBeInTheDocument());
    expect(call).toHaveBeenCalledWith(
      "ury.ury.report_api.shift_invoices.get_period_invoices",
      expect.objectContaining({ branch: "Main", page: 1, page_size: 50 }),
    );
    expect(screen.queryByLabelText("Shift")).not.toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(call).mockRejectedValueOnce(new Error("Network failed"));
    render(<ShiftInvoices />);
    await waitFor(() => expect(screen.getByText("Network failed")).toBeInTheDocument());
  });
});

describe("formatShiftLabel", () => {
  it("shows only the end time for a same-day shift", () => {
    expect(formatShiftLabel(closedShift, false)).toBe("29.09 08:02 – 20:15 · Aidos");
  });

  it("shows the end date for a shift that crosses midnight, and the branch when asked", () => {
    const overnight = { ...closedShift, end: "2026-09-30 01:05:00" };
    expect(formatShiftLabel(overnight, true)).toBe("29.09 08:02 – 30.09 01:05 · Aidos · Main");
  });

  it("marks an open shift", () => {
    expect(formatShiftLabel({ ...closedShift, end: null, is_open: true }, false)).toBe("29.09 08:02 – open · Aidos");
  });
});
