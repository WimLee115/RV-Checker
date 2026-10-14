/** Genereert een lokaal uniek rij-id voor herhaalbare formulierrijen (bankrekeningen, schuldeisers, ...). */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback voor omgevingen zonder crypto.randomUUID (bv. oudere testrunners).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
