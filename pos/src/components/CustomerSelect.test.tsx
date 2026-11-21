import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CustomerSelect } from "./CustomerSelect";

let storeState: Record<string, unknown> = {};

vi.mock("../store/pos-store", () => ({
  usePOSStore: () => storeState,
}));

vi.mock("./AggregatorSelect", () => ({
  AggregatorSelect: () => <div data-testid="aggregator">Aggregator</div>,
}));

const pickerProps = vi.fn();
vi.mock("./CustomerPicker", () => ({
  CustomerPicker: (props: { optional?: boolean; orderType?: string }) => {
    pickerProps(props);
    return (
      <div data-testid="picker" data-optional={String(Boolean(props.optional))} data-order-type={props.orderType}>
        Picker
      </div>
    );
  },
}));

describe("CustomerSelect", () => {
  beforeEach(() => {
    storeState = {
      selectedCustomer: null,
      setSelectedCustomer: vi.fn(),
      selectedOrderType: "Regular",
      isUpdatingOrder: false,
    };
  });

  it("renders without crashing", () => {
    const { container } = render(<CustomerSelect />);
    expect(container).toBeTruthy();
  });

  it("renders picker component by default", () => {
    const { getByTestId } = render(<CustomerSelect />);
    expect(getByTestId("picker")).toBeInTheDocument();
  });

  it("does not pass an orderType filter to the picker (picker always searches all customers)", () => {
    pickerProps.mockClear();
    render(<CustomerSelect />);
    expect(pickerProps).toHaveBeenCalled();
    expect(pickerProps.mock.calls[0][0]).not.toHaveProperty("orderType");
  });

  it("keeps the picker enabled while an order is being updated (customer can change on an open order)", () => {
    storeState.isUpdatingOrder = true;
    pickerProps.mockClear();
    render(<CustomerSelect />);
    expect(pickerProps.mock.calls[0][0].disabled).toBeFalsy();
    storeState.isUpdatingOrder = false;
  });

  it("still disables the picker when the parent disables it", () => {
    pickerProps.mockClear();
    render(<CustomerSelect disabled />);
    expect(pickerProps.mock.calls[0][0].disabled).toBe(true);
  });

  it("accepts disabled prop", () => {
    const { container } = render(<CustomerSelect disabled={true} />);
    expect(container).toBeTruthy();
  });

  it("handles missing store gracefully", () => {
    const { container } = render(<CustomerSelect />);
    expect(container.firstChild).toBeTruthy();
  });

  it("marks the picker optional when the POS Profile allows orders without a customer", () => {
    storeState.posProfile = { custom_allow_order_without_customer: 1 };
    const { getByTestId } = render(<CustomerSelect />);
    expect(getByTestId("picker")).toHaveAttribute("data-optional", "true");
  });

  it("keeps the picker required when the POS Profile flag is off", () => {
    storeState.posProfile = { custom_allow_order_without_customer: 0 };
    const { getByTestId } = render(<CustomerSelect />);
    expect(getByTestId("picker")).toHaveAttribute("data-optional", "false");
  });

  it("passes the selected order type to the customer picker", () => {
    storeState.selectedOrderType = "Dine In";
    const { getByTestId } = render(<CustomerSelect />);
    expect(getByTestId("picker")).toHaveAttribute("data-order-type", "Dine In");
  });
});
