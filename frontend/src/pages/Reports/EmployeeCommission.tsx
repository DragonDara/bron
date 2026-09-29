import { useCallback, useEffect, useRef, useState } from 'react';
import { call, formatCurrency } from '@ury/core';
import { KpiStrip, type KpiItemProps, DataTable, type DataTableColumn, PageHeader } from '@ury/ui';
import { DollarSign, ChevronUp } from 'lucide-react';
import { useBranchContext } from '../../context/BranchContext';
import { DateRangeFilter, type DateRangeValue } from '../../components/reports/DateRangeFilter';
import { BarChartCard } from '../../components/reports/charts/BarChartCard';
import { toApiDate } from '../../lib/reportDate';
import { startOfMonth, endOfDay } from 'date-fns';

interface CommissionSettings {
  enabled: boolean;
  commission_base: string;
  attribution_mode: string;
  include_returns: boolean;
  tier_period: string;
  default_rate: number;
  rules: unknown[];
}

interface Period {
  period: string;
  branch: string;
  base: number;
  paid: number;
  rate: number;
  commission: number;
}

interface EmployeeCommissionRow {
  rank: number;
  employee: string;
  employee_name: string;
  designation: string | null;
  attributed_invoices: number;
  weighted_invoices: number;
  attributed_base: number;
  attributed_paid: number;
  effective_rate: number;
  rate_source: string | null;
  commission_amount: number;
  periods: Period[];
}

interface UnattributedData {
  invoices: number;
  base: number;
}

interface EmployeeCommissionSummary {
  total_employees: number;
  total_base: number;
  total_commission: number;
}

interface EmployeeCommissionData {
  settings: CommissionSettings;
  tier_period_partial: boolean;
  employees: EmployeeCommissionRow[];
  unattributed: UnattributedData;
  summary: EmployeeCommissionSummary;
}

interface InvoiceCommissionRow {
  invoice: string;
  posting_date: string;
  branch: string;
  base_amount: number;
  paid_amount: number;
  weight: number;
  attributed_base: number;
  is_return: boolean;
  period: string;
  rate: number;
  commission: number;
}

interface EmployeeCommissionDetail {
  invoices: InvoiceCommissionRow[];
  truncated: boolean;
}

const periodColumns: DataTableColumn<Period>[] = [
  { key: 'period', header: 'Period Start' },
  { key: 'branch', header: 'Branch' },
  { key: 'paid', header: 'Paid by Customer', render: (r) => formatCurrency(r.paid), align: 'right' },
  { key: 'base', header: 'Attributed Base', render: (r) => formatCurrency(r.base), align: 'right' },
  { key: 'rate', header: 'Rate', render: (r) => `${r.rate.toFixed(2)}%`, align: 'right' },
  { key: 'commission', header: 'Commission', render: (r) => formatCurrency(r.commission), align: 'right' },
];

const invoiceColumns: DataTableColumn<InvoiceCommissionRow>[] = [
  {
    key: 'invoice',
    header: 'Invoice',
    render: (r) => (
      <span className="inline-flex items-center gap-2">
        <a
          href={`/app/pos-invoice/${encodeURIComponent(r.invoice)}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          {r.invoice}
        </a>
        {r.is_return && <span className="text-xs text-red-700 bg-red-50 px-1.5 py-0.5 rounded">Return</span>}
      </span>
    ),
  },
  { key: 'posting_date', header: 'Date' },
  { key: 'paid_amount', header: 'Paid by Customer', render: (r) => formatCurrency(r.paid_amount), align: 'right' },
  { key: 'base_amount', header: 'Invoice Base', render: (r) => formatCurrency(r.base_amount), align: 'right' },
  { key: 'weight', header: 'Share', render: (r) => `${Number((r.weight * 100).toFixed(1))}%`, align: 'right' },
  { key: 'attributed_base', header: 'Attributed Base', render: (r) => formatCurrency(r.attributed_base), align: 'right' },
  { key: 'rate', header: 'Rate', render: (r) => `${r.rate.toFixed(2)}%`, align: 'right' },
  { key: 'commission', header: 'Commission', render: (r) => <span className="font-semibold">{formatCurrency(r.commission)}</span>, align: 'right' },
];
const columns: DataTableColumn<EmployeeCommissionRow>[] = [
  { key: 'rank', header: '#', align: 'center' },
  { key: 'employee_name', header: 'Employee' },
  { key: 'designation', header: 'Designation', render: (r) => r.designation || '—' },
  { key: 'attributed_invoices', header: 'Invoices', align: 'right' },
  { key: 'attributed_paid', header: 'Paid by Customer', render: (r) => formatCurrency(r.attributed_paid), align: 'right' },
  { key: 'attributed_base', header: 'Attributed Base', render: (r) => formatCurrency(r.attributed_base), align: 'right' },
  { key: 'effective_rate', header: 'Effective Rate', render: (r) => `${r.effective_rate.toFixed(2)}%`, align: 'right' },
  { key: 'rate_source', header: 'Rate Source', render: (r) => r.rate_source && <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">{r.rate_source}</span> },
  { key: 'commission_amount', header: 'Commission', render: (r) => <span className="font-semibold">{formatCurrency(r.commission_amount)}</span>, align: 'right' },
];

export function EmployeeCommission() {
  const { activeBranchId } = useBranchContext();
  const [range, setRange] = useState<DateRangeValue>(() => ({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  }));
  const [data, setData] = useState<EmployeeCommissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<EmployeeCommissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const detailRequest = useRef(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    detailRequest.current += 1;
    setExpandedEmployee(null);
    setDetailData(null);
    try {
      setError(null);
      const branch = activeBranchId === 'all' ? undefined : activeBranchId;
      const res = await call<{ message: EmployeeCommissionData }>('ury.ury.report_api.commission.get_employee_commission', {
        start_date: toApiDate(range.from),
        end_date: toApiDate(range.to),
        branch,
      });
      setData(res.message ?? (res as unknown as EmployeeCommissionData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report data.');
    } finally {
      setIsLoading(false);
    }
  }, [activeBranchId, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = async (employee: EmployeeCommissionRow) => {
    const requestId = ++detailRequest.current;
    setDetailData(null);
    if (expandedEmployee === employee.employee) {
      setExpandedEmployee(null);
      setDetailLoading(false);
      return;
    }

    setExpandedEmployee(employee.employee);
    setDetailLoading(true);
    try {
      const branch = activeBranchId === 'all' ? undefined : activeBranchId;
      const res = await call<{ message: EmployeeCommissionDetail }>('ury.ury.report_api.commission.get_employee_commission_detail', {
        employee: employee.employee,
        start_date: toApiDate(range.from),
        end_date: toApiDate(range.to),
        branch,
      });
      if (requestId !== detailRequest.current) return;
      setDetailData(res.message ?? (res as unknown as EmployeeCommissionDetail));
    } catch (err) {
      if (requestId !== detailRequest.current) return;
      console.error('Failed to load detail:', err);
    } finally {
      if (requestId === detailRequest.current) setDetailLoading(false);
    }
  };

  const top10 = data?.employees.slice(0, 10) ?? [];
  const blendedRate = data?.summary.total_commission && data.summary.total_base
    ? (data.summary.total_commission / data.summary.total_base) * 100
    : 0;

  // If commission tracking is disabled
  if (data && !data.settings.enabled) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Employee Commission"
          description={`Commission tracking ${activeBranchId === 'all' ? '· All Branches' : ''}`}
          actions={<DateRangeFilter value={range} onChange={setRange} />}
        />

        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <DollarSign className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Commission Tracking is Not Enabled</h2>
          <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
            Enable commission tracking in settings to see employee commission data.
          </p>
          <a
            href="/commission-settings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Commission"
        description={`Commission breakdown by employee ${activeBranchId === 'all' ? '· All Branches' : ''}`}
        actions={<DateRangeFilter value={range} onChange={setRange} />}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Unattributed invoices warning */}
          {data.unattributed.invoices > 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {data.unattributed.invoices} invoices ({formatCurrency(data.unattributed.base)}) could not be attributed to an employee. Set the Employee record's linked User first, then re-run the attribution backfill.
            </div>
          )}

          {/* Tier period warning */}
          {data.tier_period_partial && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Tier attainment is provisional for a partial period — rates may change once the full period is included.
            </div>
          )}

          {/* Policy strip */}
          <div className="text-xs text-muted-foreground bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
            <span className="font-medium">Commission Base:</span> {data.settings.commission_base} ·
            <span className="font-medium ml-2">Attribution:</span> {data.settings.attribution_mode} ·
            {data.settings.include_returns && <span className="font-medium ml-2">Includes Returns</span>}
          </div>

          {/* Stat cards */}
          <KpiStrip
            items={[
              { label: 'Total Commission', value: formatCurrency(data.summary.total_commission) },
              { label: 'Total Attributed Base', value: formatCurrency(data.summary.total_base) },
              { label: 'Employees Earning', value: data.summary.total_employees },
              { label: 'Effective Blended Rate', value: `${blendedRate.toFixed(2)}%` },
            ] satisfies KpiItemProps[]}
          />

          {/* Top 10 chart */}
          {top10.length >= 2 && (
            <BarChartCard
              title={`Top ${Math.min(10, top10.length)} Earners by Commission`}
              data={top10}
              xKey="employee_name"
              yKeys={['commission_amount']}
              labels={{ commission_amount: 'Commission Amount' }}
            />
          )}
        </>
      )}

      <DataTable
        columns={columns}
        rows={data?.employees ?? []}
        isLoading={isLoading}
        onRowClick={(row) => handleRowClick(row)}
        rowTone={(row) => (expandedEmployee === row.employee ? 'selected' : undefined)}
        isRowExpanded={(row) => expandedEmployee === row.employee}
        renderExpanded={(row) => (
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Period Details</h3>
              <button
                onClick={() => {
                  detailRequest.current += 1;
                  setExpandedEmployee(null);
                  setDetailData(null);
                  setDetailLoading(false);
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <section className="space-y-1.5">
                <h4 className="text-xs font-semibold text-muted-foreground">By Period</h4>
                <DataTable
                  columns={periodColumns}
                  rows={row.periods}
                  emptyMessage="No period data available"
                  className="bg-white"
                />
              </section>

              {detailLoading ? (
                <div className="text-sm text-muted-foreground">Loading details…</div>
              ) : detailData ? (
                <>
                  {detailData.truncated && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      Only the latest 2000 invoices are listed.
                    </div>
                  )}
                  <section className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-muted-foreground">Invoices</h4>
                    <DataTable
                      columns={invoiceColumns}
                      rows={detailData.invoices}
                      emptyMessage="No invoices for this employee in the selected range."
                      className="bg-white"
                      rowTone={(r) => (r.is_return ? 'danger' : undefined)}
                    />
                  </section>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Failed to load details</div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default EmployeeCommission;
