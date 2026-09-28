import { describe, expect, it, vi, beforeEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployeeCommission } from "./EmployeeCommission";

vi.mock("../../context/BranchContext", () => ({
  useBranchContext: () => ({ activeBranchId: "Kozhikode" }),
}));

const mockCall = vi.fn();
vi.mock("@ury/core", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    call: (...args) => mockCall(...args),
    formatCurrency: (amount) => "Rs. " + amount,
  };
});

describe("EmployeeCommission", () => {
  beforeEach(() => { cleanup(); mockCall.mockReset(); });

  it("renders header", async () => {
    mockCall.mockResolvedValue({
      message: {
        settings: { enabled: true, commission_base: "Sales", attribution_mode: "Direct", include_returns: false, tier_period: "Monthly", default_rate: 5, rules: [] },
        tier_period_partial: false,
        employees: [],
        unattributed: { invoices: 0, base: 0 },
        summary: { total_employees: 0, total_base: 0, total_commission: 0 },
      },
    });
    render(<EmployeeCommission />);
    expect(screen.getByText("Employee Commission")).toBeInTheDocument();
  });

  it("shows disabled state when commission disabled", async () => {
    mockCall.mockResolvedValue({
      message: {
        settings: { enabled: false, commission_base: "", attribution_mode: "", include_returns: false, tier_period: "", default_rate: 0, rules: [] },
        tier_period_partial: false,
        employees: [],
        unattributed: { invoices: 0, base: 0 },
        summary: { total_employees: 0, total_base: 0, total_commission: 0 },
      },
    });
    render(<EmployeeCommission />);
    await waitFor(() => {
      expect(screen.getByText("Commission Tracking is Not Enabled")).toBeInTheDocument();
    });
  });

  it("displays employee commission data", async () => {
    mockCall.mockResolvedValue({
      message: {
        settings: { enabled: true, commission_base: "Sales", attribution_mode: "Direct", include_returns: false, tier_period: "Monthly", default_rate: 5, rules: [] },
        tier_period_partial: false,
        employees: [
          { rank: 1, employee: "emp-001", employee_name: "John", designation: "Manager", attributed_invoices: 50, weighted_invoices: 50, attributed_base: 10000, effective_rate: 5, rate_source: "Tier", commission_amount: 500, periods: [] },
        ],
        unattributed: { invoices: 0, base: 0 },
        summary: { total_employees: 1, total_base: 10000, total_commission: 500 },
      },
    });
    render(<EmployeeCommission />);
    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("shows KPI strip", async () => {
    mockCall.mockResolvedValue({
      message: {
        settings: { enabled: true, commission_base: "Sales", attribution_mode: "Direct", include_returns: false, tier_period: "Monthly", default_rate: 5, rules: [] },
        tier_period_partial: false,
        employees: [],
        unattributed: { invoices: 0, base: 0 },
        summary: { total_employees: 5, total_base: 50000, total_commission: 2500 },
      },
    });
    render(<EmployeeCommission />);
    await waitFor(() => {
      expect(screen.getByText("Total Commission")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  it("expands an employee into period and invoice breakdowns", async () => {
    const summary = {
      settings: { enabled: true, commission_base: "Individual Price", attribution_mode: "Opener", include_returns: true, tier_period: "Monthly", default_rate: 40, rules: [] },
      tier_period_partial: false,
      employees: [
        {
          rank: 1, employee: "emp-001", employee_name: "John", designation: "Waiter", attributed_invoices: 3, weighted_invoices: 3,
          attributed_base: 3428.57, attributed_paid: 7200, effective_rate: 40, rate_source: "default", commission_amount: 1371.43,
          periods: [{ period: "2026-09-01", branch: "My Company", base: 3428.57, paid: 7200, rate: 40, commission: 1371.43 }],
        },
        {
          rank: 2, employee: "emp-002", employee_name: "Jane", designation: "Waiter", attributed_invoices: 1, weighted_invoices: 1,
          attributed_base: 500, attributed_paid: 500, effective_rate: 40, rate_source: "default", commission_amount: 200,
          periods: [],
        },
      ],
      unattributed: { invoices: 0, base: 0 },
      summary: { total_employees: 1, total_base: 3428.57, total_commission: 1371.43 },
    };
    const invoice = (name: string, date: string, paid: number, base: number, commission: number, is_return = false) => ({
      invoice: name, posting_date: date, branch: "My Company", paid_amount: paid, base_amount: base, weight: 1,
      attributed_base: base, is_return, period: "2026-09-01", rate: 40, commission,
    });
    const detail = {
      invoices: [
        invoice("INV-00005", "2026-09-29", 3600, 1714.29, 685.72),
        invoice("INV-00006", "2026-09-29", -3600, -1714.29, -685.72, true),
        invoice("INV-00003", "2026-09-27", 7200, 3428.57, 1371.43),
      ],
      truncated: false,
    };
    mockCall.mockImplementation((method: string) =>
      Promise.resolve({ message: method.endsWith("get_employee_commission_detail") ? detail : summary })
    );

    render(<EmployeeCommission />);
    await userEvent.click(await screen.findByRole("cell", { name: "John" }));

    expect(await screen.findByText("By Period")).toBeInTheDocument();
    expect(screen.getByText("2026-09-01")).toBeInTheDocument();
    expect(mockCall).toHaveBeenCalledWith(
      "ury.ury.report_api.commission.get_employee_commission_detail",
      expect.objectContaining({ employee: "emp-001" })
    );

    const link = screen.getByRole("link", { name: "INV-00005" });
    expect(link).toHaveAttribute("href", "/app/pos-invoice/INV-00005");
    expect(screen.getByText("Return")).toBeInTheDocument();
    expect(screen.getByText("Rs. -685.72")).toBeInTheDocument();
    expect(screen.getAllByText("Paid by Customer")).toHaveLength(3);
    expect(screen.getByText("Rs. -3600")).toBeInTheDocument();
    // Employee row, period row and INV-00003.
    expect(screen.getAllByText("Rs. 7200")).toHaveLength(3);
    expect(screen.queryByText("By Day")).not.toBeInTheDocument();

    const johnRow = screen.getByRole("cell", { name: "John" }).closest("tr");
    const detailsRow = screen.getByText("Period Details").closest("tr");
    expect(johnRow?.nextElementSibling).toBe(detailsRow);
    expect(detailsRow?.nextElementSibling).toBe(screen.getByRole("cell", { name: "Jane" }).closest("tr"));
  });

  it("shows unattributed warning", async () => {
    mockCall.mockResolvedValue({
      message: {
        settings: { enabled: true, commission_base: "Sales", attribution_mode: "Direct", include_returns: false, tier_period: "Monthly", default_rate: 5, rules: [] },
        tier_period_partial: false,
        employees: [],
        unattributed: { invoices: 10, base: 2000 },
        summary: { total_employees: 0, total_base: 0, total_commission: 0 },
      },
    });
    render(<EmployeeCommission />);
    await waitFor(() => {
      expect(screen.getByText(/10 invoices/)).toBeInTheDocument();
    });
  });
});
