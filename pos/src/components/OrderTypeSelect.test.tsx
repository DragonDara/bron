import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderTypeSelect from "./OrderTypeSelect";

const mockUsePOSStore = vi.fn();
const mockUseRootStore = vi.fn();
const mockIsRestricted = vi.fn(() => false);

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => mockUsePOSStore(),
}));

vi.mock("../store/root-store", () => ({
  useRootStore: () => mockUseRootStore(),
}));

vi.mock("../lib/table-utils", () => ({
  formatMergedTableLabel: (table: string) => table,
}));

vi.mock("@ury/core", () => ({
  isUserRestrictedFromTableOrders: () => mockIsRestricted(),
}));

vi.mock("./TableSelectionDialog", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="table-dialog"><button onClick={onClose}>Close picker</button></div>
  ),
}));

vi.mock("../i18n", () => ({
  t: (key: string) => key,
}));

describe("OrderTypeSelect", () => {
  beforeEach(() => {
    mockIsRestricted.mockReturnValue(false);
    mockUsePOSStore.mockReturnValue({
      selectedOrderType: "Takeaway",
      setSelectedOrderType: vi.fn(),
      selectedTable: null,
      tableOrder: null,
      posProfile: {},
      isUpdatingOrder: false,
    });

    mockUseRootStore.mockReturnValue({
      user: { name: "user1" },
    });
  });

  it("prompts for a table on entry and after starting the next dine-in order", async () => {
    const state = {
      ...mockUsePOSStore(),
      selectedOrderType: "Dine In",
      posProfile: { branch: "Main" },
    };
    mockUsePOSStore.mockReturnValue(state);
    const { rerender } = render(<OrderTypeSelect />);
    expect(screen.getByTestId("table-dialog")).toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole("button", { name: "Close picker" }));
    rerender(<OrderTypeSelect />);
    expect(screen.queryByTestId("table-dialog")).not.toBeInTheDocument();
    expect(state.setSelectedOrderType).not.toHaveBeenCalled();

    mockUsePOSStore.mockReturnValue({ ...state, selectedTable: "Table 1" });
    rerender(<OrderTypeSelect />);
    expect(screen.queryByTestId("table-dialog")).not.toBeInTheDocument();

    mockUsePOSStore.mockReturnValue(state);
    rerender(<OrderTypeSelect />);
    expect(screen.getByTestId("table-dialog")).toBeInTheDocument();
  });

  it.each([
    { selectedTable: "Table 1" },
    { isUpdatingOrder: true },
    { posProfile: null },
    { selectedOrderType: "Take Away" },
  ])("does not prompt when the order is ineligible: %j", (overrides) => {
    mockUsePOSStore.mockReturnValue({
      ...mockUsePOSStore(),
      selectedOrderType: "Dine In",
      posProfile: { branch: "Main" },
      ...overrides,
    });
    render(<OrderTypeSelect />);
    expect(screen.queryByTestId("table-dialog")).not.toBeInTheDocument();
  });

  it("waits until interaction is enabled and respects table-order restrictions", () => {
    mockUsePOSStore.mockReturnValue({
      ...mockUsePOSStore(),
      selectedOrderType: "Dine In",
      posProfile: { branch: "Main" },
    });
    const { rerender } = render(<OrderTypeSelect disabled />);
    expect(screen.queryByTestId("table-dialog")).not.toBeInTheDocument();
    mockIsRestricted.mockReturnValue(true);
    rerender(<OrderTypeSelect />);
    expect(screen.queryByTestId("table-dialog")).not.toBeInTheDocument();
    mockIsRestricted.mockReturnValue(false);
    rerender(<OrderTypeSelect />);
    expect(screen.getByTestId("table-dialog")).toBeInTheDocument();
  });

  it("renders order type buttons", () => {
    render(<OrderTypeSelect />);
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls setSelectedOrderType when clicking an order type", async () => {
    const user = userEvent.setup();
    const setSelectedOrderType = vi.fn();
    
    mockUsePOSStore.mockReturnValue({
      selectedOrderType: "Takeaway",
      setSelectedOrderType,
      selectedTable: null,
      tableOrder: null,
      posProfile: {},
      isUpdatingOrder: false,
    });

    render(<OrderTypeSelect />);
    
    const buttons = screen.getAllByRole("button");
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      expect(setSelectedOrderType).toHaveBeenCalled();
    }
  });

  it("respects disabled prop", () => {
    render(<OrderTypeSelect disabled={true} />);
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toHaveAttribute("disabled");
    });
  });

  it("disables buttons when isUpdatingOrder is true", () => {
    mockUsePOSStore.mockReturnValue({
      selectedOrderType: "Takeaway",
      setSelectedOrderType: vi.fn(),
      selectedTable: null,
      tableOrder: null,
      posProfile: {},
      isUpdatingOrder: true,
    });

    render(<OrderTypeSelect />);
    
    const buttons = screen.getAllByRole("button");
    buttons.forEach(button => {
      expect(button).toHaveAttribute("disabled");
    });
  });
});
