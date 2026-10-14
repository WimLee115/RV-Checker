import { SUPPORTED_LOCALES, type Locale } from './types';

function isSupportedLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Bepaalt de startaal: eerder opgeslagen keuze > eerste overeenkomende browsertaal > Nederlands.
 * `saved` wordt los meegegeven (niet hier uit localStorage gelezen) zodat deze functie ook
 * zonder browseromgeving te testen is.
 */
export function detectInitialLocale(saved: string | null): Locale {
  if (isSupportedLocale(saved)) return saved;

  if (typeof navigator !== 'undefined') {
    const browserLanguages = navigator.languages ?? [navigator.language];
    for (const lang of browserLanguages) {
      const base = lang.slice(0, 2).toLowerCase();
      if (isSupportedLocale(base)) return base;
    }
  }

  return 'nl';
}
