import type { CentAmount } from './types';

// Nederlandse notatie: komma is het enige decimaalteken, een punt is altijd een
// duizendtal-scheiding (nooit een decimaalteken) — ongeacht welke UI-taal actief is.
// Bedragen in een R&V zijn altijd euro/NL-notatie, dus dit blijft vast, zie plan §5.
const NL_AMOUNT = /^(-)?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/;

/**
 * Parseert gebruikersinvoer in NL-notatie ("1.234,56") naar een geheel aantal cent.
 * Lege invoer is geldig en betekent "niet ingevuld" (`null`), geen fout.
 * Ongeldige invoer geeft `undefined` terug (het aanroepende veld blijft dan geblokkeerd
 * tot de invoer leesbaar is — zie de formuliervalidatie-filosofie in het plan).
 */
export function parseEuroInput(input: string): CentAmount | undefined {
  const trimmed = input.trim();
  if (trimmed === '') return null;

  const match = NL_AMOUNT.exec(trimmed);
  if (!match) return undefined;

  const [, sign, intPart, decPart] = match;
  const euros = Number(intPart!.replace(/\./g, ''));
  const cents = decPart ? Number(decPart.padEnd(2, '0')) : 0;
  const total = euros * 100 + cents;
  return sign ? -total : total;
}

/** Formatteert een geheel aantal cent naar "€ 1.234,56" — altijd NL/euro, ongeacht UI-taal. */
export function formatEuro(cents: CentAmount): string {
  if (cents === null) return '';
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const euros = Math.floor(abs / 100);
  const rest = abs % 100;
  const euroStr = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const centStr = rest.toString().padStart(2, '0');
  return `${negative ? '-' : ''}€ ${euroStr},${centStr}`;
}

/** Telt bedragen op; `null` ("niet ingevuld") telt als 0. */
export function sumCents(...values: CentAmount[]): number {
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}
