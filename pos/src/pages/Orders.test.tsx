import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { showToast } from "@ury/ui";
import Orders from "./Orders";

// Mock UI components first
vi.mock("@ury/ui", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge">{children}</span>
  ),
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  showToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Textarea: ({ value, onChange, ...props }: any) => (
    <textarea value={value} onChange={onChange} {...props} />
  ),
}));

// Create a mock store object with correct pagination structure
const mockRootStoreState = {
  orders: [],
  orderLoading: false,
  error: null,
  selectedStatus: "Unbilled",
  pagination: { currentPage: 1, hasNextPage: false },
  selectedOrder: null,
  selectedOrderItems: [],
  selectedOrderTaxes: [],
  selectedOrderLoading: false,
  selectedOrderError: null,
  fetchOrders: vi.fn(),
  setSelectedStatus: vi.fn(),
  goToNextPage: vi.fn(),
  goToPreviousPage: vi.fn(),
  selectOrder: vi.fn(),
  clearSelectedOrder: vi.fn(),
  orderSearchQuery: "",
};

vi.mock("../store/root-store", () => ({
  useRootStore: vi.fn(() => mockRootStoreState),
}));

const mockPosStore = {
  posProfile: { name: "POS-001" },
  openOrderForEdit: vi.fn(),
};

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => mockPosStore,
}));

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

// Mock core functions
vi.mock("@ury/core", () => ({
  formatCurrency: (amount: number) => `Rs. ${amount}`,
  call: {
    get: vi.fn().mockResolvedValue({ message: { has_permission: true } }),
  },
}));

// Mock order API
vi.mock("../lib/order-api", () => ({
  splitBill: vi.fn().mockResolvedValue(undefined),
}));

// Mock invoice API
vi.mock("../lib/invoice-api", () => ({
  getOrdersTabForInvoice: vi.fn(),
  getSplitGroup: vi.fn(),
  getCombinedOrderTotals: vi.fn(() => ({
    grandTotal: 1000,
    roundedTotal: 1000,
  })),
  isMergedBill: vi.fn(() => false),
  resolvePrintFormat: vi.fn(() => "Thermal"),
  mapSplitGroupInvoiceToPOSInvoice: vi.fn(),
}));

// Mock print
vi.mock("../lib/print", () => ({
  printOrder: vi.fn().mockResolvedValue(undefined),
}));

// Mock table utils
vi.mock("../lib/table-utils", () => ({
  formatMergedTableLabel: vi.fn((table) => table),
}));

// Mock i18n with proper number formatting support
vi.mock("../i18n", () => ({
  t: (key: string, opts?: any) => {
    if (key === 'orders.pagination.page' && opts?.number) {
      return `Page ${opts.number}`;
    }
    return key;
  },
}));

// Mock components
vi.mock("../components/OrderStatusSidebar", () => ({
  default: () => <div data-testid="order-status-sidebar" />,
}));

vi.mock("../components/PaymentDialog", () => ({
  default: () => <div data-testid="payment-dialog" />,
}));

vi.mock("../components/BillSplitDialog", () => ({
  default: () => <div data-testid="split-dialog" />,
}));

vi.mock("../components/BillMergeDialog", () => ({
  default: () => <div data-testid="merge-dialog" />,
}));

vi.mock("../components/OrderActionsMenu", () => ({
  default: () => <div data-testid="actions-menu" />,
}));

vi.mock("../components/SplitGroupPanel", () => ({
  default: () => <div data-testid="split-group-panel" />,
}));

vi.mock("../components/MergedBillPanel", () => ({
  default: () => <div data-testid="merged-bill-panel" />,
}));

describe("Orders Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRootStoreState.fetchOrders.mockClear();
  });

  it("renders the orders page", () => {
    render(<Orders />);

    expect(screen.getByTestId("order-status-sidebar")).toBeInTheDocument();
  });

  it("fetches orders on mount", async () => {
    render(<Orders />);

    await waitFor(() => {
      expect(mockRootStoreState.fetchOrders).toHaveBeenCalled();
    });
  });

  it("shows loading spinner when orders are loading", () => {
    mockRootStoreState.orderLoading = true;

    render(<Orders />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    mockRootStoreState.orderLoading = false;
  });

  it("renders with empty orders list initially", async () => {
    mockRootStoreState.orders = [];

    render(<Orders />);

    await waitFor(() => {
      expect(mockRootStoreState.fetchOrders).toHaveBeenCalled();
    });
  });

  it("has OrderStatusSidebar component", () => {
    render(<Orders />);

    expect(screen.getByTestId("order-status-sidebar")).toBeInTheDocument();
  });

  it("displays no order message when no order is selected", () => {
    mockRootStoreState.selectedOrder = null;
    render(<Orders />);

    expect(screen.getByText(/order.select_to_view/i)).toBeInTheDocument();
  });

  describe("edit order", () => {
    const draftOrder = {
      name: "INV-0038",
      status: "Draft",
      restaurant_table: "Table 5",
      invoice_printed: 0,
      customer: "CUST-1",
      posting_date: "2026-10-14",
      posting_time: "01:15:00",
      grand_total: 7348,
      rounded_total: 7348,
    };

    beforeEach(() => {
      mockRootStoreState.selectedOrder = draftOrder as never;
    });

    afterEach(() => {
      mockRootStoreState.selectedOrder = null;
    });

    it("opens the order through the store and goes to the register", async () => {
      mockPosStore.openOrderForEdit.mockResolvedValue(true);
      render(<Orders />);

      fireEvent.click(screen.getByLabelText("Edit order"));

      await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/register"));
      expect(mockPosStore.openOrderForEdit).toHaveBeenCalledWith("INV-0038", "Table 5");
    });

    it("stays on the page when the order is no longer open", async () => {
      mockPosStore.openOrderForEdit.mockResolvedValue(false);
      render(<Orders />);

      fireEvent.click(screen.getByLabelText("Edit order"));

      await waitFor(() => expect(showToast.error).toHaveBeenCalledWith("errors.failed_edit_order"));
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it("displays pagination controls", () => {
    mockRootStoreState.orders = [];
    render(<Orders />);

    expect(screen.getByText(/orders.pagination.previous/i)).toBeInTheDocument();
    expect(screen.getByText(/orders.pagination.next/i)).toBeInTheDocument();
  });
});
