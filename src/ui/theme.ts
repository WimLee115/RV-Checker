export type Thema = 'licht' | 'donker';

const THEMA_STORAGE_KEY = 'rv-checker:thema:v1';

function leesOpgeslagenThema(): Thema | null {
  try {
    const waarde = localStorage.getItem(THEMA_STORAGE_KEY);
    return waarde === 'licht' || waarde === 'donker' ? waarde : null;
  } catch {
    return null;
  }
}

function schrijfOpgeslagenThema(thema: Thema | null): void {
  try {
    if (thema === null) localStorage.removeItem(THEMA_STORAGE_KEY);
    else localStorage.setItem(THEMA_STORAGE_KEY, thema);
  } catch {
    // Negeren: thema-keuze werkt dan alleen voor de huidige sessie.
  }
}

function huidigSysteemThema(): Thema {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'donker' : 'licht';
}

function toepassen(thema: Thema | null): void {
  if (typeof document === 'undefined') return;
  if (thema === null) document.documentElement.removeAttribute('data-thema');
  else document.documentElement.setAttribute('data-thema', thema);
}

let expliciteKeuze: Thema | null = leesOpgeslagenThema();
toepassen(expliciteKeuze);

const listeners = new Set<() => void>();

/** Geeft het daadwerkelijk getoonde thema terug: de expliciete keuze, anders de systeemvoorkeur. */
export function getEffectiefThema(): Thema {
  return expliciteKeuze ?? huidigSysteemThema();
}

/** `true` als de gebruiker expliciet heeft gekozen (i.p.v. de systeemvoorkeur te volgen). */
export function heeftExplicieteKeuze(): boolean {
  return expliciteKeuze !== null;
}

export function zetThema(thema: Thema | null): void {
  expliciteKeuze = thema;
  schrijfOpgeslagenThema(thema);
  toepassen(thema);
  listeners.forEach((listener) => listener());
}

/** Wisselt tussen licht en donker, altijd als expliciete keuze (ongeacht de systeemvoorkeur). */
export function wisselThema(): void {
  zetThema(getEffectiefThema() === 'donker' ? 'licht' : 'donker');
}

export function onThemaChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
