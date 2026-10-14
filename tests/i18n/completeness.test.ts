import { describe, expect, it } from 'vitest';
import nl from '../../src/locales/nl.json';
import en from '../../src/locales/en.json';
import ar from '../../src/locales/ar.json';
import pl from '../../src/locales/pl.json';

/**
 * Permanente bewaker: als iemand een Nederlandse sleutel toevoegt en vergeet de andere drie
 * talen bij te werken, faalt deze test direct — in plaats van dat het pas in de praktijk
 * opvalt als een niet-Nederlandstalige gebruiker een kale sleutel of lege tekst te zien krijgt.
 */
describe('vertaalbestanden hebben identieke sleutelsets', () => {
  const nlKeys = new Set(Object.keys(nl));

  it.each([
    ['en', en],
    ['ar', ar],
    ['pl', pl],
  ])('%s.json mist geen sleutels uit nl.json en heeft er geen extra', (_locale, dict) => {
    const keys = new Set(Object.keys(dict));
    const missing = [...nlKeys].filter((key) => !keys.has(key));
    const extra = [...keys].filter((key) => !nlKeys.has(key));
    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
  });

  it('geen enkele sleutel heeft een lege vertaling', () => {
    for (const [locale, dict] of [
      ['nl', nl],
      ['en', en],
      ['ar', ar],
      ['pl', pl],
    ] as const) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${locale}.json["${key}"] is leeg`).not.toBe('');
      }
    }
  });
});
