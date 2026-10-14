import { beforeEach, describe, expect, it } from 'vitest';
import { getLocale, onLocaleChange, setLocale, t } from '../../src/i18n/t';

describe('t()', () => {
  beforeEach(() => {
    setLocale('nl');
  });

  it('vertaalt een bestaande sleutel', () => {
    expect(t('severity.fout')).toBe('Fout');
  });

  it('interpoleert parameters in de template', () => {
    const resultaat = t('rules.afwijkingTotalen.suggestion', { bedrag: '€ 150,00' });
    expect(resultaat).toContain('€ 150,00');
  });

  it('laat een placeholder ongemoeid als de bijbehorende parameter ontbreekt', () => {
    expect(t('rules.afwijkingTotalen.suggestion')).toContain('{bedrag}');
  });

  it('valt terug op de kale sleutel wanneer die nergens bestaat', () => {
    expect(t('niet.bestaande.sleutel')).toBe('niet.bestaande.sleutel');
  });

  it('vertaalt dezelfde sleutel anders na het wisselen van taal', () => {
    setLocale('en');
    expect(t('severity.fout')).toBe('Error');
  });
});

describe('setLocale / getLocale', () => {
  it('onthoudt de actieve taal', () => {
    setLocale('pl');
    expect(getLocale()).toBe('pl');
    setLocale('nl');
  });

  it('roept geregistreerde listeners aan bij een taalwissel', () => {
    const gezien: string[] = [];
    const unsubscribe = onLocaleChange((locale) => gezien.push(locale));
    setLocale('ar');
    setLocale('nl');
    unsubscribe();
    expect(gezien).toEqual(['ar', 'nl']);
  });
});
