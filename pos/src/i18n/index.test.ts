import { describe, it, expect } from 'vitest';
import { initI18n, applyDocumentLocale } from './index';

describe('applyDocumentLocale', () => {
    it('sets dir=rtl and lang=ar on <html> for Arabic', async () => {
        await initI18n('ar');
        applyDocumentLocale();
        expect(document.documentElement.lang).toBe('ar');
        expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    });

    it('sets dir=ltr and lang=en for English', async () => {
        await initI18n('en');
        applyDocumentLocale();
        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });
});