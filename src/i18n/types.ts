export type Locale = 'nl' | 'en' | 'ar' | 'pl';

export const SUPPORTED_LOCALES: readonly Locale[] = ['nl', 'en', 'ar', 'pl'];
export const RTL_LOCALES: readonly Locale[] = ['ar'];

export const LOCALE_NAMES: Record<Locale, string> = {
  nl: 'Nederlands',
  en: 'English',
  ar: 'العربية',
  pl: 'Polski',
};
