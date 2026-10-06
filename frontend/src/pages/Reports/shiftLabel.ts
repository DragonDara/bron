import { format, isSameDay } from 'date-fns';
import { translate } from '../../i18n/translate';

export interface Shift {
  name: string;
  branch: string | null;
  cashier: string;
  cashier_name: string;
  start: string;
  end: string | null;
  is_open: boolean;
  is_long: boolean;
}

const parseDateTime = (value: string) => new Date(value.replace(' ', 'T'));

export function formatShiftLabel(shift: Shift, showBranch: boolean): string {
  const start = parseDateTime(shift.start);
  let period = `${format(start, 'dd.MM HH:mm')} – `;
  if (shift.end) {
    const end = parseDateTime(shift.end);
    period += isSameDay(start, end) ? format(end, 'HH:mm') : format(end, 'dd.MM HH:mm');
  } else {
    period += translate('open');
  }
  const branch = showBranch && shift.branch ? ` · ${shift.branch}` : '';
  return `${period} · ${shift.cashier_name}${branch}`;
}
