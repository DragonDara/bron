import { resolveUryLanguage } from './i18n';

type CurrencyBoot = {
  sysdefaults?: { currency?: string; number_format?: string };
  docs?: Array<{ doctype?: string; name?: string; symbol?: string }>;
};

function getCurrencyBoot(): CurrencyBoot | undefined {
  return typeof window === 'undefined'
    ? undefined
    : (window as Window & { frappe?: { boot?: CurrencyBoot } }).frappe?.boot;
}

/** A currency as configured on the Frappe Currency doctype. */
export interface CurrencyInfo {
  /** ISO code, e.g. AED. `null` means the scope spans several currencies. */
  code: string | null;
  symbol?: string | null;
}

/** A scope covering more than one currency must not display a guessed symbol. */
export const MIXED_CURRENCY: CurrencyInfo = Object.freeze({ code: null, symbol: null });

let activeCurrency: CurrencyInfo | undefined;
let profileCurrency: CurrencyInfo | undefined;

/** Publish the active company/branch scope for the current tab. */
export function setActiveCurrency(currency: CurrencyInfo | undefined): void {
  activeCurrency = currency;
}

export function getActiveCurrency(): CurrencyInfo | undefined {
  return activeCurrency;
}

/** Set or clear the currency loaded from the active POS Profile. */
export function setCurrency(code?: string, symbol?: string): void {
  profileCurrency = code ? { code, symbol } : undefined;
}

const digitsCache = new Map<string, number>();

/** Minor-unit digits for an ISO code (OMR/BHD/KWD = 3, JPY = 0, most = 2). */
export function currencyFractionDigits(code: string): number {
  const cached = digitsCache.get(code);
  if (cached !== undefined) return cached;

  let digits = 2;
  try {
    digits = new Intl.NumberFormat('en', { style: 'currency', currency: code })
      .resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    // Unknown/non-ISO codes configured in Frappe use the usual two decimals.
  }
  digitsCache.set(code, digits);
  return digits;
}

export function getCurrencyCode(): string {
  if (activeCurrency !== undefined) return activeCurrency.code ?? '';
  return profileCurrency?.code || getCurrencyBoot()?.sysdefaults?.currency || '';
}

export function getCurrencySymbol(currency = getCurrencyCode()): string {
  if (!currency) return '';
  if (activeCurrency?.code === currency && activeCurrency.symbol) return activeCurrency.symbol;
  if (profileCurrency?.code === currency && profileCurrency.symbol) return profileCurrency.symbol;

  const doc = getCurrencyBoot()?.docs?.find(
    (item) => (item.doctype === ':Currency' || item.doctype === 'Currency') && item.name === currency,
  );
  if (doc?.symbol) return doc.symbol;

  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0).find((part) => part.type === 'currency')?.value || currency;
  } catch {
    return currency;
  }
}

/** Site grouping takes precedence; UI language supplies grouping otherwise. */
export function getAmountLocale(currencyCode?: string | null): string {
  const code = currencyCode !== undefined
    ? currencyCode
    : activeCurrency !== undefined
      ? activeCurrency.code
      : profileCurrency?.code || getCurrencyBoot()?.sysdefaults?.currency;
  if (code === 'INR' || getCurrencyBoot()?.sysdefaults?.number_format?.startsWith('#,##,###')) {
    return 'en-IN';
  }

  try {
    const language = resolveUryLanguage();
    return language === 'ru' ? 'ru-RU' : language === 'kk' ? 'kk-KZ' : 'en-US';
  } catch {
    return 'en-US';
  }
}

function formatAmountParts(parts: Intl.NumberFormatPart[]): string {
  const pattern = getCurrencyBoot()?.sysdefaults?.number_format;
  const decimal = pattern?.match(/([^#]+)##$/)?.[1];
  const group = pattern?.match(/^#([^#]+)#{2,3}/)?.[1];
  return parts.map((part) =>
    part.type === 'decimal' && decimal
      ? decimal
      : part.type === 'group' && group
        ? group
        : part.value,
  ).join('');
}

function resolveCurrency(currency?: CurrencyInfo | string | null): CurrencyInfo | undefined {
  if (typeof currency === 'string') return { code: currency, symbol: getCurrencySymbol(currency) };
  if (currency !== undefined && currency !== null) return currency;
  if (activeCurrency !== undefined) return activeCurrency;
  if (profileCurrency) return profileCurrency;

  const code = getCurrencyBoot()?.sysdefaults?.currency;
  return code ? { code, symbol: getCurrencySymbol(code) } : undefined;
}

export function formatCurrency(amount: number, currency?: CurrencyInfo | string | null): string {
  const info = resolveCurrency(currency);
  const maximumFractionDigits = info?.code ? currencyFractionDigits(info.code) : 2;
  const formatted = typeof amount === 'number' && Number.isFinite(amount)
    ? formatAmountParts(new Intl.NumberFormat(getAmountLocale(info?.code), {
      maximumFractionDigits,
    }).formatToParts(amount))
    : String(amount);

  if (!info?.code) return formatted;
  const symbol = info.symbol || getCurrencySymbol(info.code) || info.code;
  return `${symbol} ${formatted}`;
}

function trimCompactValue(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0
    ? rounded.toString()
    : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

/** Compact currency for chart axes/labels, using lakh/crore for INR. */
export function formatCompactCurrency(amount: number, currency?: CurrencyInfo | string | null): string {
  const info = resolveCurrency(currency);
  const symbol = info?.code ? info.symbol || getCurrencySymbol(info.code) || info.code : '';
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return symbol ? `${symbol} ${amount}` : String(amount);
  }

  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (info?.code === 'INR') {
    if (abs >= 1_00_00_000) return `${sign}${symbol}${trimCompactValue(abs / 1_00_00_000)}Cr`;
    if (abs >= 1_00_000) return `${sign}${symbol}${trimCompactValue(abs / 1_00_000)}L`;
    if (abs >= 1_000) return `${sign}${symbol}${trimCompactValue(abs / 1_000)}k`;
    return `${sign}${symbol}${trimCompactValue(abs)}`;
  }

  const compact = formatAmountParts(new Intl.NumberFormat(getAmountLocale(info?.code), {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).formatToParts(abs));
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
    if (/^\d{1,2}:\d{2}$/.test(formatted)) return formatted;
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  return timestamp;
};
