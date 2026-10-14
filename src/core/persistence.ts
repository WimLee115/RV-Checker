import type { RVData } from './types';

const DRAFT_STORAGE_KEY = 'rv-checker:draft:v1';

function hasExpectedShape(value: unknown): value is RVData {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    record.schemaVersion === 1 &&
    typeof record.dossiergegevens === 'object' &&
    typeof record.inkomen === 'object' &&
    typeof record.uitgaven === 'object'
  );
}

/** Slaat een concept direct op (geen debounce hier — zie ui/store.ts voor het debouncen zelf). */
export function saveDraft(data: RVData): void {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Opslag kan vol of geblokkeerd zijn (bv. privénavigatie) — het formulier blijft werken,
    // alleen het automatisch bewaren mislukt dan stilletjes in plaats van de app te breken.
  }
}

/**
 * Laadt een eerder opgeslagen concept. Geeft `null` terug zodra er niets is, de opslag
 * niet beschikbaar is, of de inhoud niet (meer) op een RVData lijkt — degradeert altijd naar
 * "geen concept gevonden" in plaats van te crashen op corrupte of verouderde data.
 */
export function loadDraft(): RVData | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return hasExpectedShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Niets te doen als opslag niet beschikbaar is.
  }
}

export function hasDraft(): boolean {
  try {
    return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
