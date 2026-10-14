import nl from '../locales/nl.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import pl from '../locales/pl.json';
import { detectInitialLocale } from './detect';
import { RTL_LOCALES, type Locale } from './types';

type Dictionary = Record<string, string>;
const DICTIONARIES: Record<Locale, Dictionary> = { nl, en, ar, pl };

/** Eigen, kleine opslagsleutel — los van het R&V-concept, want taal is een UI-voorkeur, geen
 *  R&V-gegeven; zo reset "nieuwe controle starten" de taalkeuze niet. */
const LOCALE_STORAGE_KEY = 'rv-checker:locale:v1';

function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null; // bv. privénavigatie waarin localStorage is geblokkeerd
  }
}

function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Negeren: taalkeuze werkt dan alleen nog voor de huidige sessie, geen harde fout.
  }
}

function applyDocumentDirection(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

let currentLocale: Locale = detectInitialLocale(readStoredLocale());
applyDocumentDirection(currentLocale); // ook bij initieel laden, niet alleen bij een latere taalwissel

const listeners = new Set<(locale: Locale) => void>();

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  writeStoredLocale(locale);
  applyDocumentDirection(locale);
  listeners.forEach((listener) => listener(locale));
}

/** Meldt zich aan voor taalwisselingen; geeft een functie terug om weer af te melden. */
export function onLocaleChange(listener: (locale: Locale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Vertaalt `key` in de actieve taal en vult `{param}`-placeholders in. Valt terug op
 * Nederlands, en als laatste redmiddel op de kale sleutel — nooit een lege of kapotte string.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const template = DICTIONARIES[currentLocale][key] ?? DICTIONARIES.nl[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
