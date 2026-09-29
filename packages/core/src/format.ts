import { storage } from './storage';
import { resolveUryLanguage } from './i18n';

const DEFAULT_CURRENCY_SYMBOL = '₸';

/** Symbol stored from the POS profile's currency; the management app never sets it, so it falls back to tenge. */
export function getCurrencySymbol(): string {
  return storage.getItem('currencySymbol') || DEFAULT_CURRENCY_SYMBOL;
}

/** Locale used for amounts: Russian grouping ("1 250 000,5") unless the UI language is English. */
export function getAmountLocale(): string {
  return resolveUryLanguage() === 'ru' ? 'ru-RU' : 'en-US';
}

export function formatCurrency(amount: number): string {
  const symbol = getCurrencySymbol();
  const formattedVal =
    typeof amount === 'number' && !isNaN(amount)
      ? amount.toLocaleString(getAmountLocale(), { maximumFractionDigits: 2 })
      : amount;
  return `${symbol} ${formattedVal}`;
}

/**
 * Formats a number as compact currency for chart axes/labels,
 * e.g. 8200 -> "₸8,2 тыс.", 12500000 -> "₸12,5 млн" (English UI: "₸8.2K", "₸12.5M").
 */
export function formatCompactCurrency(amount: number): string {
  const symbol = getCurrencySymbol();
  if (typeof amount !== 'number' || isNaN(amount)) return `${symbol} ${amount}`;

  const sign = amount < 0 ? '-' : '';
  const compact = new Intl.NumberFormat(getAmountLocale(), {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return `${sign}${symbol}${compact}`;
}

export const formatInvoiceTime = (timestamp: string | null) => {
    if (!timestamp) return 'No bill activity yet';

    const parsedDate = new Date(timestamp);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    }

    const timeOnlyMatch = timestamp.match(/^(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))?$/);
    if (timeOnlyMatch) {
      const [, hours, minutes, seconds] = timeOnlyMatch;
      const date = new Date();
      date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
      const formatted = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      if (/^\d{1,2}:\d{2}$/.test(formatted)) {
        return formatted;
      }
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    return timestamp;
  };
