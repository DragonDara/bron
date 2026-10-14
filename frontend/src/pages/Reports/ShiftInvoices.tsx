import { useCallback, useEffect, useMemo, useState } from 'react';
import { call, formatCurrency } from '@ury/core';
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  KpiStrip,
  type KpiItemProps,
  PageHeader,
  Select,
} from '@ury/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { endOfDay, startOfMonth } from 'date-fns';
import { useBranchContext } from '../../context/BranchContext';
import { DateRangeFilter, type DateRangeValue } from '../../components/reports/DateRangeFilter';
import { DeskLink } from '../../components/DeskLink';
import { toApiDate } from '../../lib/reportDate';
import { formatShiftLabel, type Shift } from './shiftLabel';

type Mode = 'shift' | 'period';

interface InvoiceRow {
  row_no: number;
  invoice: string;
  posting_date: string;
  posting_time: string;
  courses: string[];
  items: { item_name: string; qty: number }[];
  employee: string | null;
  employee_name: string | null;
  paid_amount: number;
  is_return: boolean;
  on_credit: boolean;
}

interface Summary {
  invoice_count: number;
  total_paid: number;
  average_ticket: number;
  credit_total: number;
}

interface ShiftInvoicesData {
  shift: Shift;
  invoices: InvoiceRow[];
  summary: Summary;
  truncated: boolean;
}

interface PeriodInvoicesData {
  invoices: InvoiceRow[];
  summary: Summary;
  pagination: { page: number; page_size: number; total: number; total_pages: number };
}

const PAGE_SIZE = 50;

const formatItems = (items: InvoiceRow['items']) =>
  items.map((i) => (i.qty > 1 ? `${i.item_name} ×${i.qty}` : i.item_name)).join(', ');

const columns: DataTableColumn<InvoiceRow>[] = [
  { key: 'row_no', header: '#' },
  {
    key: 'invoice',
    header: 'Invoice',
    render: (r) => (
      <span className="inline-flex items-center gap-1.5">
        {r.invoice}
        <DeskLink doctype="POS Invoice" name={r.invoice} iconOnly />
      </span>
    ),
  },
  { key: 'courses', header: 'Course', render: (r) => r.courses.join(', ') || '—' },
  { key: 'items', header: 'Items', render: (r) => formatItems(r.items) || '—' },
  { key: 'employee', header: 'Employee', render: (r) => r.employee_name || '—' },
  {
    key: 'paid_amount',
    header: 'Paid',
    align: 'right',
    render: (r) => (
      <span className="inline-flex items-center justify-end gap-1.5">
        {r.is_return && <Badge variant="tagDestructive" size="tag">Return</Badge>}
        {r.on_credit && <Badge variant="tagWarning" size="tag">On Credit</Badge>}
        {formatCurrency(r.paid_amount)}
      </span>
    ),
  },
];

export function ShiftInvoices() {
  const { activeBranchId } = useBranchContext();
  const branch = activeBranchId === 'all' ? undefined : activeBranchId;

  const [mode, setMode] = useState<Mode>('shift');
  const [range, setRange] = useState<DateRangeValue>(() => ({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  }));
  const [page, setPage] = useState(1);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState('');
  const [shiftData, setShiftData] = useState<ShiftInvoicesData | null>(null);
  const [periodData, setPeriodData] = useState<PeriodInvoicesData | null>(null);
  const [shiftsLoading, setShiftsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShifts = useCallback(async () => {
    setShiftsLoading(true);
    try {
      setError(null);
      const res = await call<{ message: { shifts: Shift[] } }>('ury.ury.report_api.shift_invoices.get_shifts', {
        branch,
        start_date: toApiDate(range.from),
        end_date: toApiDate(range.to),
      });
      const list = (res.message ?? (res as unknown as { shifts: Shift[] })).shifts ?? [];
      setShifts(list);
      setSelectedShift((current) => (list.some((s) => s.name === current) ? current : list[0]?.name ?? ''));
      if (!list.length) setShiftData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report data.');
    } finally {
      setShiftsLoading(false);
    }
  }, [branch, range]);

  const fetchShiftInvoices = useCallback(async (shift: string) => {
    setIsLoading(true);
    try {
      setError(null);
      const res = await call<{ message: ShiftInvoicesData }>('ury.ury.report_api.shift_invoices.get_shift_invoices', {
        shift,
      });
      setShiftData(res.message ?? (res as unknown as ShiftInvoicesData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPeriodInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      setError(null);
      const res = await call<{ message: PeriodInvoicesData }>('ury.ury.report_api.shift_invoices.get_period_invoices', {
        branch,
        start_date: toApiDate(range.from),
        end_date: toApiDate(range.to),
        page,
        page_size: PAGE_SIZE,
      });
      setPeriodData(res.message ?? (res as unknown as PeriodInvoicesData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report data.');
    } finally {
      setIsLoading(false);
    }
  }, [branch, range, page]);

  useEffect(() => {
    setPage(1);
  }, [branch, range, mode]);

  useEffect(() => {
    if (mode === 'shift') fetchShifts();
  }, [mode, fetchShifts]);

  useEffect(() => {
    if (mode === 'shift' && selectedShift) fetchShiftInvoices(selectedShift);
  }, [mode, selectedShift, fetchShiftInvoices]);

  useEffect(() => {
    if (mode === 'period') fetchPeriodInvoices();
  }, [mode, fetchPeriodInvoices]);

  const data = mode === 'shift' ? shiftData : periodData;
  const summary = data?.summary;
  const pagination = mode === 'period' ? periodData?.pagination : undefined;
  const currentShift = mode === 'shift' ? shiftData?.shift : undefined;

  const kpis = useMemo<KpiItemProps[]>(() => {
    if (!summary) return [];
    const items: KpiItemProps[] = [
      { label: 'Invoices', value: summary.invoice_count },
      { label: 'Total Paid', value: formatCurrency(summary.total_paid) },
      { label: 'Average Ticket', value: formatCurrency(summary.average_ticket) },
    ];
    if (summary.credit_total) {
      items.push({ label: 'On Credit', value: formatCurrency(summary.credit_total), tone: 'warning' });
    }
    return items;
  }, [summary]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift Invoices"
        description={`Invoices per cashier shift ${activeBranchId === 'all' ? '· All Branches' : ''}`}
        actions={
          <>
            <div className="inline-flex gap-1" role="group" aria-label="Report mode">
              <Button
                variant={mode === 'shift' ? 'default' : 'chrome'}
                aria-pressed={mode === 'shift'}
                onClick={() => setMode('shift')}
              >
                By Shift
              </Button>
              <Button
                variant={mode === 'period' ? 'default' : 'chrome'}
                aria-pressed={mode === 'period'}
                onClick={() => setMode('period')}
              >
                By Period
              </Button>
            </div>
            <DateRangeFilter value={range} onChange={setRange} />
            {mode === 'shift' && (
              <Select
                className="w-72"
                aria-label="Shift"
                value={selectedShift}
                onValueChange={setSelectedShift}
                disabled={!shifts.length}
                placeholder={shifts.length ? 'Select shift' : 'No shifts in this period'}
              >
                {shifts.map((s) => (
                  <option key={s.name} value={s.name}>
                    {formatShiftLabel(s, !branch)}
                  </option>
                ))}
              </Select>
            )}
          </>
        }
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {currentShift?.is_open && (
        <div className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          Shift is still open — totals will change until it is closed.
        </div>
      )}
      {currentShift?.is_long && (
        <div className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          This shift lasted more than 24 hours — check that it was closed on time.
        </div>
      )}
      {mode === 'shift' && shiftData?.truncated && (
        <div className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800">
          Only the first 5000 invoices of this shift are shown.
        </div>
      )}

      {summary && <KpiStrip items={kpis} />}

      <DataTable
        columns={columns}
        rows={mode === 'shift' && !selectedShift ? [] : data?.invoices ?? []}
        isLoading={isLoading || (mode === 'shift' && shiftsLoading)}
        rowTone={(r) => (r.is_return ? 'danger' : undefined)}
      />

      {summary && (data?.invoices.length ?? 0) > 0 && (
        <div className="flex justify-end gap-3 px-[14px] text-sm font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatCurrency(summary.total_paid)}</span>
        </div>
      )}

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button
              variant="outline"
              disabled={page >= pagination.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
