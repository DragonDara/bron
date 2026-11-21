import { resolveManagementLanguage } from '../../../i18n/language';

/** Locale files use base codes; Frappe boot may send regional variants. */
function matchSupportedLanguage(code: string | undefined | null): string | null {
  if (!code) return null;
  if (SUPPORTED_LANGUAGES[code]) return code;
  const base = code.split(/[-_]/)[0];
  if (base && SUPPORTED_LANGUAGES[base]) return base;
  return null;
}

/**
 * Resolves the active language using the following priority:
 * 1. localStorage key 'ury_language' (explicit user choice)
 * 2. frappe.boot.lang (Frappe site config / user preference)
 * 3. DEFAULT_LANGUAGE ('en')
 */
export function resolveLanguage(): string {
  return resolveManagementLanguage();
}
