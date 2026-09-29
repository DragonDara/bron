import { getManagementLocale } from '../i18n/language';

export { formatCurrency } from '@ury/core';

export function formatInvoiceTime(timestamp: string | null): string {
  if (!timestamp) return 'No bill activity yet';
  const parsedDate = new Date(timestamp);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleTimeString(getManagementLocale(), { hour: 'numeric', minute: 'numeric' });
  }
  return timestamp;
}
