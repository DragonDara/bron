import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@ury/core', async (importOriginal) => ({
  ...await importOriginal<typeof import('@ury/core')>(),
  storage: { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() },
}));
vi.mock('../lib/menu-api', () => ({
  getRestaurantMenu: vi.fn(),
  getAggregatorMenu: vi.fn(),
}));
vi.mock('../lib/menu-course-api', () => ({ getMenuCourses: vi.fn(async () => []) }));
vi.mock('../lib/pos-profile-api', () => ({
  getCurrencyInfo: vi.fn(),
  getCombinedPosProfile: vi.fn(),
}));
vi.mock('../lib/customer-api', () => ({
  getCustomerGroups: vi.fn(),
  getCustomerTerritories: vi.fn(),
}));
vi.mock('../lib/order-api', () => ({ getTableOrder: vi.fn(), getOrderForEdit: vi.fn() }));
vi.mock('../lib/payment-api', () => ({ getPaymentModes: vi.fn() }));

import { usePOSStore, type OrderItem } from './pos-store';
import { getRestaurantMenu } from '../lib/menu-api';
import { getMenuCourses } from '../lib/menu-course-api';
import { getCombinedPosProfile, getCurrencyInfo } from '../lib/pos-profile-api';
import { getOrderForEdit, type POSInvoice } from '../lib/order-api';
import { getCurrencySymbol, setCurrency } from '@ury/core';

const menuRow = (item: string, rate: number) => ({
  item,
  item_name: item,
  item_image: null,
  rate,
  course: 'Main',
});

describe('POS currency hydration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
    setCurrency();
  });

  it('loads the current profile despite a stale cached profile and symbol', async () => {
    sessionStorage.setItem('posProfile', JSON.stringify({ currency: 'INR' }));
    localStorage.setItem('currencySymbol', '₹');
    vi.mocked(getCombinedPosProfile).mockResolvedValue({ currency: 'KZT' } as never);
    vi.mocked(getCurrencyInfo).mockResolvedValue({ symbol: '₸' } as never);
    await usePOSStore.getState().fetchPosProfile();
    expect(getCombinedPosProfile).toHaveBeenCalledOnce();
    expect(getCurrencyInfo).toHaveBeenCalledWith('KZT');
    expect(getCurrencySymbol()).toBe('₸');

    localStorage.clear();
    sessionStorage.clear();
    await usePOSStore.getState().fetchPosProfile();
    expect(getCurrencySymbol()).toBe('₸');
  });

  it('replaces the previous symbol when the profile currency changes', async () => {
    setCurrency('INR', '₹');
    vi.mocked(getCombinedPosProfile).mockResolvedValue({ currency: 'EUR' } as never);
    vi.mocked(getCurrencyInfo).mockResolvedValue({ symbol: '€' } as never);
    await usePOSStore.getState().fetchPosProfile();
    expect(getCurrencySymbol()).toBe('€');
    expect(usePOSStore.getState().currencySymbol).toBe('€');
  });
});

const cartLine = (id: string, price: number) =>
  ({ id, name: id, price, quantity: 1, uniqueId: `${id}-1` }) as unknown as OrderItem;

const company = { id: 'CompanyName', name: 'CompanyName', phone: '' };

describe('usePOSStore customer-priced menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    usePOSStore.setState({
      posProfile: { name: 'POS-1', restaurant: 'R-1' } as never,
      selectedRoom: 'Hall',
      selectedOrderType: 'Dine In' as never,
      selectedCustomer: null,
      menuCustomer: null,
      menuItems: [],
      activeOrders: [],
    });
  });

  it('reloads the menu for the new customer and reprices cart lines', async () => {
    vi.mocked(getRestaurantMenu).mockResolvedValue([menuRow('Burger', 500), menuRow('Tea', 120)]);
    usePOSStore.setState({ activeOrders: [cartLine('Burger', 180), cartLine('Off-menu', 99)] });

    usePOSStore.getState().setSelectedCustomer(company);
    await vi.waitFor(() => expect(usePOSStore.getState().menuCustomer).toBe('CompanyName'));
    await vi.waitFor(() => expect(usePOSStore.getState().activeOrders[0].price).toBe(500));

    expect(getRestaurantMenu).toHaveBeenCalledWith('POS-1', 'Hall', 'Dine In', 'CompanyName');
    expect(getMenuCourses).toHaveBeenCalledWith('POS-1', 'Hall', 'Dine In', 'CompanyName');
    expect(usePOSStore.getState().activeOrders[1].price).toBe(99);
  });

  it('does not refetch when the menu already belongs to the selected customer', async () => {
    usePOSStore.setState({ selectedCustomer: company, menuCustomer: 'CompanyName' });

    await usePOSStore.getState().syncMenuWithCustomer();

    expect(getRestaurantMenu).not.toHaveBeenCalled();
  });

  it('leaves the aggregator menu alone', async () => {
    usePOSStore.setState({ selectedOrderType: 'Aggregators' as never, selectedCustomer: company });

    await usePOSStore.getState().syncMenuWithCustomer();

    expect(getRestaurantMenu).not.toHaveBeenCalled();
  });

  it('ignores a stale menu response that resolves after a newer one', async () => {
    let resolveStale!: (rows: ReturnType<typeof menuRow>[]) => void;
    vi.mocked(getRestaurantMenu)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveStale = resolve; }))
      .mockResolvedValueOnce([menuRow('Burger', 500)]);

    const stale = usePOSStore.getState().fetchMenuItems();
    usePOSStore.setState({ selectedCustomer: company });
    await usePOSStore.getState().fetchMenuItems();
    resolveStale([menuRow('Burger', 180)]);
    await stale;

    expect(usePOSStore.getState().menuItems[0].price).toBe(500);
    expect(usePOSStore.getState().menuCustomer).toBe('CompanyName');
    expect(usePOSStore.getState().menuLoading).toBe(false);
  });
});

const invoiceRow = (name: string, itemCode: string, qty: number, comment: string, key: string | null) => ({
  name,
  item_code: itemCode,
  item_name: itemCode,
  description: '',
  item_group: 'Food',
  image: '',
  qty,
  comment,
  reservation_line_key: key,
  rate: 500,
  amount: 500 * qty,
  discount_percentage: 0,
  discount_amount: 0,
});

const openInvoice = (overrides: Partial<POSInvoice> = {}) =>
  ({
    name: 'INV-0038',
    customer: 'CUST-1',
    customer_name: 'Walk-in',
    mobile_number: '+7700',
    order_type: 'Dine In',
    restaurant_table: 'Table 5',
    custom_restaurant_room: 'Hall',
    custom_waiter_employee: 'EMP-7',
    no_of_pax: 4,
    custom_comments: 'Birthday',
    modified: '2026-10-14 01:15:42.123456',
    items: [
      invoiceRow('row-1', 'Burger', 2, 'no onion', 'key-burger-1'),
      invoiceRow('row-2', 'Burger', 1, 'spicy', 'key-burger-2'),
    ],
    ...overrides,
  }) as POSInvoice;

describe('usePOSStore.openOrderForEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.mocked(getRestaurantMenu).mockResolvedValue([]);
    usePOSStore.setState({
      posProfile: { name: 'POS-1', restaurant: 'R-1' } as never,
      selectedCustomer: null,
      menuCustomer: null,
      activeOrders: [],
      isUpdatingOrder: false,
      orderId: null,
      lastModifiedTime: null,
    });
  });

  it('loads the order with the same state as the table path, including the stale-write stamp', async () => {
    vi.mocked(getOrderForEdit).mockResolvedValue({ message: openInvoice() });

    const opened = await usePOSStore.getState().openOrderForEdit('INV-0038', 'Table 5');

    expect(opened).toBe(true);
    expect(getOrderForEdit).toHaveBeenCalledWith('INV-0038', 'Table 5');
    const state = usePOSStore.getState();
    expect(state.isUpdatingOrder).toBe(true);
    expect(state.orderId).toBe('INV-0038');
    expect(state.lastModifiedTime).toBe('2026-10-14 01:15:42.123456');
    expect(state.noOfPax).toBe(4);
    expect(state.selectedPerformer).toBe('EMP-7');
    expect(state.orderComment).toBe('Birthday');
    expect(state.selectedOrderType).toBe('Dine In');
    expect(state.selectedTable).toBe('Table 5');
    expect(state.selectedRoom).toBe('Hall');
    expect(state.selectedCustomer).toEqual({ id: 'CUST-1', name: 'Walk-in', phone: '+7700' });
  });

  it('keeps each saved line separate with its persisted key, comment and row name', async () => {
    vi.mocked(getOrderForEdit).mockResolvedValue({ message: openInvoice() });

    await usePOSStore.getState().openOrderForEdit('INV-0038', 'Table 5');

    const lines = usePOSStore.getState().activeOrders;
    expect(lines).toHaveLength(2);
    expect(lines.map((line) => [line.quantity, line.comment, line.reservationLineKey, line.invoiceItemName])).toEqual([
      [2, 'no onion', 'key-burger-1', 'row-1'],
      [1, 'spicy', 'key-burger-2', 'row-2'],
    ]);
  });

  it('does not touch the cart when the order is no longer open', async () => {
    vi.mocked(getOrderForEdit).mockResolvedValue({ message: openInvoice({ name: undefined as never, items: [] }) });
    usePOSStore.setState({ activeOrders: [cartLine('Tea', 120)], orderId: 'INV-OTHER', isUpdatingOrder: true });

    const opened = await usePOSStore.getState().openOrderForEdit('INV-0038', 'Table 5');

    expect(opened).toBe(false);
    expect(usePOSStore.getState().activeOrders).toHaveLength(1);
    expect(usePOSStore.getState().orderId).toBe('INV-OTHER');
  });

  it('propagates load errors instead of treating them as an empty order', async () => {
    vi.mocked(getOrderForEdit).mockRejectedValue(new Error('Not permitted to view this order'));

    await expect(usePOSStore.getState().openOrderForEdit('INV-0038', null)).rejects.toThrow(
      'Not permitted to view this order'
    );
  });
});
