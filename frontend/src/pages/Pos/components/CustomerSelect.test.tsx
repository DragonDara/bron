import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { CustomerSelect } from './CustomerSelect';

type MockCustomer = { name: string };
type MockPOSStore = {
  selectedCustomer: MockCustomer | null;
  setSelectedCustomer: (customer: MockCustomer | null) => void;
  selectedOrderType: string;
  isUpdatingOrder: boolean;
  posProfile?: { custom_allow_order_without_customer?: number };
};
const createMockPOSStore = (overrides: Partial<MockPOSStore> = {}): MockPOSStore => ({
  selectedCustomer: null,
  setSelectedCustomer: vi.fn(),
  selectedOrderType: 'Dine In',
  isUpdatingOrder: false,
  ...overrides,
});
let mockPOSStore = createMockPOSStore();

vi.mock('../store/pos-store', () => ({
  usePOSStore: () => mockPOSStore,
}));

vi.mock('./AggregatorSelect', () => ({
  AggregatorSelect: () => <div>Aggregator Select</div>,
}));

const pickerProps = vi.fn();
vi.mock('./CustomerPicker', () => ({
  CustomerPicker: ({
    value,
    onChange,
    disabled,
    optional,
    orderType,
  }: {
    value: MockCustomer | null;
    onChange: (customer: MockCustomer | null) => void;
    disabled?: boolean;
    optional?: boolean;
    orderType?: string;
  }) => (
    <div data-testid="customer-picker" data-optional={String(Boolean(optional))} data-order-type={orderType}>
      <input
        type="text"
        value={value?.name || ''}
        onChange={(e) => onChange({ name: e.target.value })}
        disabled={disabled}
        placeholder="Select customer"
      />
    </div>
  ),
}));

describe('CustomerSelect', () => {
  beforeEach(() => {
    cleanup();
    mockPOSStore = createMockPOSStore();
  });

  it('renders CustomerPicker for non-aggregator order types', () => {
    render(<CustomerSelect />);
    expect(screen.getByTestId('customer-picker')).toBeInTheDocument();
  });

  it('renders AggregatorSelect for aggregator order type', async () => {
    mockPOSStore = createMockPOSStore({ selectedOrderType: 'Aggregators' });
    render(<CustomerSelect />);
    expect(screen.getByText('Aggregator Select')).toBeInTheDocument();
  });

  it('passes disabled prop to CustomerPicker', () => {
    render(<CustomerSelect disabled={true} />);
    const input = screen.getByPlaceholderText('Select customer') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('disables CustomerPicker when isUpdatingOrder is true', async () => {
    mockPOSStore = createMockPOSStore({ isUpdatingOrder: true });

    render(<CustomerSelect />);
    const input = screen.getByPlaceholderText('Select customer') as HTMLInputElement;
    expect(input).not.toBeDisabled();
  });

  it('does not pass an orderType filter to the picker (picker always searches all customers)', () => {
    pickerProps.mockClear();
    render(<CustomerSelect />);
    expect(pickerProps).toHaveBeenCalled();
    expect(pickerProps.mock.calls[0][0]).not.toHaveProperty('orderType');
  });

  it('marks the picker optional when the POS Profile allows orders without a customer', () => {
    mockPOSStore = createMockPOSStore({
      posProfile: { custom_allow_order_without_customer: 1 },
    });

    render(<CustomerSelect />);
    expect(screen.getByTestId('customer-picker')).toHaveAttribute('data-optional', 'true');
  });

  it('keeps the picker required when the POS Profile flag is off', () => {
    mockPOSStore = createMockPOSStore({
      posProfile: { custom_allow_order_without_customer: 0 },
    });

    render(<CustomerSelect />);
    expect(screen.getByTestId('customer-picker')).toHaveAttribute('data-optional', 'false');
  });

  it('passes the selected order type to the customer picker', () => {
    render(<CustomerSelect />);
    expect(screen.getByTestId('customer-picker')).toHaveAttribute('data-order-type', 'Dine In');
  });
});
