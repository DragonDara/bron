import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderPanel from './OrderPanel';
import { syncOrder } from '../lib/order-api';
import { getCartServiceChargeQuote } from '../lib/pos-billing-api';

vi.mock('../i18n', () => ({
  t: (key: string) => key,
}));

vi.mock('@ury/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ury/ui')>()),
  showToast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@ury/core', () => ({
  formatCurrency: (amount: number) => `Rs. ${amount}`,
}));

vi.mock('../lib/order-api', () => ({
  syncOrder: vi.fn().mockResolvedValue({ status: 'success' }),
}));

vi.mock('../lib/pos-billing-api', () => ({
  getCartServiceChargeQuote: vi.fn(),
}));

let mockPOSStoreState = {
  activeOrders: [
    {
      uniqueId: 'item-1',
      id: 'ITEM-001',
      item: 'ITEM-001',
      name: 'Chicken Biryani',
      price: 250,
      quantity: 1,
      selectedVariant: null,
      selectedAddons: [],
      comment: null,
      variants: [],
      addons: [],
    },
  ],
  removeFromOrder: vi.fn(),
  updateQuantity: vi.fn(),
  clearOrder: vi.fn(),
  setSelectedItem: vi.fn(),
  orderLoading: false,
  isOrderInteractionDisabled: () => false,
  isUpdatingOrder: false,
  posProfile: { name: 'POS-001', cashier: 'user1', owner: 'user1', custom_enable_service_charge: 0, custom_service_charge_percentage: 0, custom_service_charge_order_types: '', custom_allow_order_without_customer: 0 },
  selectedOrderType: 'Dine In',
  selectedTable: 'T1' as string | null,
  selectedRoom: 'Main Hall',
  selectedCustomer: { name: 'CUST-001' } as { name: string } | null,
  selectedAggregator: null,
  resetOrderState: vi.fn(),
  paymentModes: ['Cash'],
  orderId: null,
  orderComment: '',
  setOrderComment: vi.fn(),
  noOfPax: 2,
  setNoOfPax: vi.fn(),
  lastModifiedTime: null,
};

vi.mock('../store/pos-store', () => ({
  usePOSStore: () => mockPOSStoreState,
}));

vi.mock('../store/root-store', () => ({
  useRootStore: (selector: (state: { user: { name: string } }) => unknown) => selector({ user: { name: 'cashier@ury.test' } }),
}));

vi.mock('./CustomerSelect', () => ({
  CustomerSelect: () => <div>Customer Select</div>,
}));

vi.mock('./PerformerSelect', () => ({
  PerformerSelect: () => <div>Performer Select</div>,
}));

vi.mock('./ProductDialog', () => ({
  default: () => <div>Product Dialog</div>,
}));

vi.mock('./OrderTypeSelect', () => ({
  default: () => <div>Order Type Select</div>,
}));

vi.mock('./CommentDialog', () => ({
  default: ({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) => (
    isOpen ? <div onClick={() => onClose()}>Comment Dialog</div> : null
  ),
}));

describe('OrderPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    mockPOSStoreState = {
      activeOrders: [
        {
          uniqueId: 'item-1',
          id: 'ITEM-001',
          item: 'ITEM-001',
          name: 'Chicken Biryani',
          price: 250,
          quantity: 1,
          selectedVariant: null,
          selectedAddons: [],
          comment: null,
          variants: [],
          addons: [],
        },
      ],
      removeFromOrder: vi.fn(),
      updateQuantity: vi.fn(),
      clearOrder: vi.fn(),
      setSelectedItem: vi.fn(),
      orderLoading: false,
      isOrderInteractionDisabled: () => false,
      isUpdatingOrder: false,
      posProfile: { name: 'POS-001', cashier: 'user1', owner: 'user1', custom_enable_service_charge: 0, custom_service_charge_percentage: 0, custom_service_charge_order_types: '', custom_allow_order_without_customer: 0 },
      selectedOrderType: 'Dine In',
      selectedTable: 'T1' as string | null,
      selectedRoom: 'Main Hall',
      selectedCustomer: { name: 'CUST-001' } as { name: string } | null,
      selectedAggregator: null,
      resetOrderState: vi.fn(),
      paymentModes: ['Cash'],
      orderId: null,
      orderComment: '',
      setOrderComment: vi.fn(),
      noOfPax: 2,
      setNoOfPax: vi.fn(),
      lastModifiedTime: null,
    };
  });

  it('shows the server-quoted dine-in service charge and inclusive total', async () => {
    mockPOSStoreState.posProfile.custom_enable_service_charge = 1;
    mockPOSStoreState.posProfile.custom_service_charge_percentage = 10;
    mockPOSStoreState.posProfile.custom_service_charge_order_types = 'Dine In';
    vi.mocked(getCartServiceChargeQuote).mockResolvedValue({
      subtotal: 5590, discount_amount: 0, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 559, service_charge_percentage: 10,
      grand_total: 6149, rounded_total: 6149, currency: 'KZT', policy: {},
    });

    render(<OrderPanel />);

    await waitFor(() => expect(getCartServiceChargeQuote).toHaveBeenCalledWith(expect.objectContaining({
      items: [{ item: 'ITEM-001', qty: 1 }], pos_profile: 'POS-001', order_type: 'Dine In',
    })));
    await waitFor(() => expect(screen.getByText('cart.subtotal_excluding_service')).toBeInTheDocument());
    expect(screen.getByText('cart.service_charge')).toBeInTheDocument();
    expect(screen.getByText('Rs. 6149')).toBeInTheDocument();
  });

  it('quotes the service-inclusive total and submits when performer selection is disabled', async () => {
    Object.assign(mockPOSStoreState.posProfile, {
      custom_enable_service_charge: 1,
      custom_service_charge_order_types: 'Dine In',
      custom_enable_order_on_behalf: 0,
      custom_require_performer_on_order: 1,
    });
    vi.mocked(getCartServiceChargeQuote).mockResolvedValueOnce({
      subtotal: 250, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 25, service_charge_percentage: 10,
      grand_total: 275, rounded_total: 275, currency: 'KZT', policy: {},
    });

    render(<OrderPanel />);

    expect(await screen.findByText('Rs. 275')).toBeInTheDocument();
    expect(screen.getByText('cart.service_charge')).toBeInTheDocument();
    expect(screen.queryByText('errors.select_performer')).not.toBeInTheDocument();
    expect(vi.mocked(getCartServiceChargeQuote).mock.calls[0][0]).not.toHaveProperty('performed_by');
    await userEvent.click(screen.getByText('cart.add_new_order'));
    await waitFor(() => expect(syncOrder).toHaveBeenCalledWith(expect.objectContaining({
      performed_by: undefined,
    })));
  });

  it('prompts for the required performer without making failing quote requests', async () => {
    Object.assign(mockPOSStoreState.posProfile, {
      custom_enable_service_charge: 1,
      custom_service_charge_order_types: 'Dine In',
      custom_enable_order_on_behalf: 1,
      custom_require_performer_on_order: 1,
    });
    const { rerender } = render(<OrderPanel />);
    expect(screen.getByText('errors.select_performer')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getCartServiceChargeQuote).not.toHaveBeenCalled();
    expect(screen.queryByText('cart.service_charge_quote_error')).not.toBeInTheDocument();
    vi.mocked(getCartServiceChargeQuote).mockResolvedValueOnce({
      subtotal: 250, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 25, service_charge_percentage: 10,
      grand_total: 275, rounded_total: 275, currency: 'KZT', policy: {},
    });
    Object.assign(mockPOSStoreState, { selectedPerformer: 'EMP-1' });
    rerender(<OrderPanel />);
    expect(await screen.findByText('Rs. 275')).toBeInTheDocument();
    expect(getCartServiceChargeQuote).toHaveBeenCalledWith(expect.objectContaining({ performed_by: 'EMP-1' }));
    delete (mockPOSStoreState as typeof mockPOSStoreState & { selectedPerformer?: string }).selectedPerformer;
  });

  it('does not request or show service charge for takeaway', () => {
    mockPOSStoreState.selectedOrderType = 'Take Away';
    mockPOSStoreState.posProfile.custom_enable_service_charge = 1;
    mockPOSStoreState.posProfile.custom_service_charge_percentage = 10;
    mockPOSStoreState.posProfile.custom_service_charge_order_types = 'Dine In';
    render(<OrderPanel />);

    expect(getCartServiceChargeQuote).not.toHaveBeenCalled();
    expect(screen.queryByText('cart.service_charge')).not.toBeInTheDocument();
    expect(screen.getAllByText('Rs. 250')).toHaveLength(2);
  });

  it('never presents the meal subtotal as payable while quoting or after a failure, and can retry', async () => {
    mockPOSStoreState.posProfile.custom_enable_service_charge = 1;
    mockPOSStoreState.posProfile.custom_service_charge_order_types = 'Dine In';
    vi.mocked(getCartServiceChargeQuote).mockRejectedValueOnce(new Error('Offline'));
    render(<OrderPanel />);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('cart.add_new_order').closest('button')).toBeDisabled();
    expect(await screen.findByText('cart.service_charge_quote_error')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    vi.mocked(getCartServiceChargeQuote).mockResolvedValueOnce({
      subtotal: 250, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 25, service_charge_percentage: 10,
      grand_total: 275, rounded_total: 275, currency: 'KZT', policy: {},
    });
    await userEvent.click(screen.getByText('cart.retry_total'));
    expect(await screen.findByText('Rs. 275')).toBeInTheDocument();
    expect(screen.getByText('cart.add_new_order').closest('button')).not.toBeDisabled();
  });

  it('invalidates the previous total immediately when quantities change', async () => {
    mockPOSStoreState.posProfile.custom_enable_service_charge = 1;
    mockPOSStoreState.posProfile.custom_service_charge_order_types = 'Dine In';
    vi.mocked(getCartServiceChargeQuote).mockResolvedValueOnce({
      subtotal: 250, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 25, service_charge_percentage: 10,
      grand_total: 275, rounded_total: 275, currency: 'KZT', policy: {},
    });
    const { rerender } = render(<OrderPanel />);
    expect(await screen.findByText('Rs. 275')).toBeInTheDocument();
    mockPOSStoreState.activeOrders = [{ ...mockPOSStoreState.activeOrders[0], quantity: 2 }];
    vi.mocked(getCartServiceChargeQuote).mockResolvedValueOnce({
      subtotal: 500, manual_discount_amount: 0, tax_amount: 0,
      service_charge: 50, service_charge_percentage: 10,
      grand_total: 550, rounded_total: 550, currency: 'KZT', policy: {},
    });
    rerender(<OrderPanel />);
    expect(screen.queryByText('Rs. 275')).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(await screen.findByText('Rs. 550')).toBeInTheDocument();
  });

});
