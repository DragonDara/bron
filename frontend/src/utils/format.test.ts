import { afterEach, describe, expect, it } from 'vitest';
import { formatCompactCurrency, formatCurrency } from '@ury/core';

// ru-RU groups with non-breaking spaces; compare against plain spaces.
const plain = (value: string) => value.replace(/[\u00a0\u202f]/g, ' ');

describe('currency formatting', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('falls back to tenge when no currency symbol is stored', () => {
    expect(formatCurrency(1500)).toBe('₸ 1,500');
    expect(formatCompactCurrency(8200)).toBe('₸8.2K');
  });

  it('uses the stored currency symbol', () => {
    localStorage.setItem('currencySymbol', '$');
    expect(formatCurrency(1500)).toBe('$ 1,500');
  });

  it('uses Russian grouping and abbreviations for the Russian UI', () => {
    localStorage.setItem('ury_language', 'ru');
    expect(plain(formatCurrency(1250000.5))).toBe('₸ 1 250 000,5');
    expect(plain(formatCurrency(1714.2857))).toBe('₸ 1 714,29');
    expect(plain(formatCompactCurrency(8200))).toBe('₸8,2 тыс.');
    expect(plain(formatCompactCurrency(12500000))).toBe('₸12,5 млн');
    expect(plain(formatCompactCurrency(-640))).toBe('-₸640');
  });
});
