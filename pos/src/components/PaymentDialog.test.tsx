import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PaymentDialog from "./PaymentDialog";
import { call } from "@ury/core";
import type { ComponentProps, ReactNode } from "react";

const mockUsePOSStore = vi.fn();

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => mockUsePOSStore(),
}));

vi.mock("../lib/print", () => ({
  printOrder: vi.fn().mockResolvedValue("qz"),
}));

vi.mock("@ury/core", () => ({
  formatCurrency: (amount: number) => `Rs. ${amount.toFixed(2)}`,
  parseFrappeError: vi.fn((err: any, fallback: string) => err?.message || fallback),
  call: {
    get: vi.fn().mockResolvedValue({ message: {
      subtotal: 1000, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 0, service_charge_percentage: 0,
      grand_total: 1000, rounded_total: 1000, currency: "INR",
      policy: { reason: "no_applicable_policy" },
    } }),
    post: vi.fn().mockResolvedValue({ ok: true }),
  },
}));

vi.mock("@ury/ui", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => <button {...props}>{children}</button>,
  Input: (props: ComponentProps<"input">) => <input {...props} />,
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../i18n", () => ({
  t: (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}: ${JSON.stringify(params)}`;
    return key;
  },
}));

describe("PaymentDialog", () => {
  beforeEach(() => {
    vi.mocked(call.get).mockClear();
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash", "Card"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 0 },
    });
  });

  it("shows the server policy and service charge before payment", async () => {
    vi.mocked(call.get).mockResolvedValueOnce({ message: {
      subtotal: 1000, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 90, service_charge_percentage: 10,
      grand_total: 990, rounded_total: 990, currency: "INR",
      policy: { name: "POL-1", policy_name: "Staff", discount_type: "Percentage", value: 10, amount: 100, remaining_limit: 50 },
    } } as never);
    render(
      <PaymentDialog onClose={vi.fn()} grandTotal={1000} roundedTotal={1000}
        invoice="INV001" customer="CUST001" posProfile="POS001" table={null}
        cashier="user1" owner="user1" fetchOrders={vi.fn()} clearSelectedOrder={vi.fn()} />
    );
    expect(await screen.findByText(/payment.staff_policy_discount/)).toBeInTheDocument();
    expect(screen.getByText(/payment.service_charge/)).toBeInTheDocument();
    expect(call.get).toHaveBeenCalledWith(
      "ury.ury.api.pos_billing.get_invoice_billing_quote",
      { invoice: "INV001", manual_discount_percentage: 0 },
    );
  });

  it("renders payment dialog", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("displays order summary with subtotal", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByText(/payment.subtotal/)).toBeInTheDocument();
  });

  it("displays payment mode labels", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
  });

  it("renders pay button", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows discount section when enable_discount is true", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByText(/payment.apply_discount/)).toBeInTheDocument();
  });

  it("hides discount section when enable_discount is false", () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash", "Card"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 0 },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.queryByText(/payment.apply_discount/)).not.toBeInTheDocument();
  });

  it("displays table name when provided", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table="TABLE1"
        tableLabel="Table A"
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByText("Table A")).toBeInTheDocument();
  });

  it("displays order summary section", () => {
    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );
    
    expect(screen.getByText(/payment.order_summary/)).toBeInTheDocument();
  });

  it("shows print invoice checkbox checked by default when enable_payment_without_printing is 1", () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash", "Card"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 1 },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);
  });

  it("hides print invoice checkbox when enable_payment_without_printing is 0", () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash", "Card"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 0 },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("prints invoice and completes payment when print invoice is checked", async () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 1, print_format: "Standard" },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect((checkbox as HTMLInputElement).checked).toBe(true);

    const payButton = screen.getByText(/payment.pay_button/);
    fireEvent.click(payButton);

    await waitFor(() => {
      // Step 1: make_invoice with submit_invoice: 0
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.make_invoice",
        expect.objectContaining({ submit_invoice: 0 })
      );
      // Step 2: printOrder called
      expect(printOrder).toHaveBeenCalledWith(
        expect.objectContaining({ orderId: "INV001" })
      );
      // Step 3: submit_order_invoice called
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.submit_order_invoice",
        { invoice: "INV001" }
      );
    });
  });

  it("does not complete payment if print fails when print invoice is checked", async () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 1, print_format: "Standard" },
    });

    vi.mocked(printOrder).mockRejectedValueOnce(new Error("Printer is offline"));

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
      />
    );

    const payButton = screen.getByText(/payment.pay_button/);
    fireEvent.click(payButton);

    await waitFor(() => {
      // Step 1 was called
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.make_invoice",
        expect.objectContaining({ submit_invoice: 0 })
      );
      // print was called
      expect(printOrder).toHaveBeenCalled();
      // submit_order_invoice was NOT called!
      expect(call.post).not.toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.submit_order_invoice",
        expect.anything()
      );
    });
  });

  it("completes payment directly without printing when enable_payment_without_printing is 1 and print invoice is unchecked", async () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 1, print_format: "Standard" },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
        order={{ invoice_printed: 0 }}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect((checkbox as HTMLInputElement).checked).toBe(false);

    const payButton = screen.getByText(/payment.pay_button/);
    fireEvent.click(payButton);

    await waitFor(() => {
      // Payment completes directly without printing and without error
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.make_invoice",
        expect.objectContaining({ submit_invoice: 1 })
      );
    });
    expect(printOrder).not.toHaveBeenCalled();
    expect(showToast.error).not.toHaveBeenCalled();
  });

  it("does not call printOrder when enable_payment_without_printing is 0 and Pay is clicked", async () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 0, print_format: "Standard" },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
        order={{ invoice_printed: 1 }}
      />
    );

    // Checkbox is hidden when the flag is disabled
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    const payButton = screen.getByText(/payment.pay_button/);
    fireEvent.click(payButton);

    await waitFor(() => {
      // Submits directly with no duplicate reprint
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.make_invoice",
        expect.objectContaining({ submit_invoice: 1 })
      );
    });
    expect(printOrder).not.toHaveBeenCalled();
    expect(call.post).not.toHaveBeenCalledWith(
      "ury.ury.doctype.ury_order.ury_order.submit_order_invoice",
      expect.anything()
    );
  });

  it("completes payment directly if print invoice is unchecked but invoice was already printed", async () => {
    mockUsePOSStore.mockReturnValue({
      paymentModes: ["Cash"],
      fetchPaymentModes: vi.fn(),
      posProfile: { enable_discount: 1, enable_payment_without_printing: 1, print_format: "Standard" },
    });

    render(
      <PaymentDialog
        onClose={vi.fn()}
        grandTotal={1000}
        roundedTotal={1000}
        invoice="INV001"
        customer="CUST001"
        posProfile="POS001"
        table={null}
        cashier="user1"
        owner="user1"
        fetchOrders={vi.fn()}
        clearSelectedOrder={vi.fn()}
        order={{ invoice_printed: 1 }}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect((checkbox as HTMLInputElement).checked).toBe(false);

    const payButton = screen.getByText(/payment.pay_button/);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(call.post).toHaveBeenCalledWith(
        "ury.ury.doctype.ury_order.ury_order.make_invoice",
        expect.objectContaining({ submit_invoice: 1 })
      );
    });
  });
});


