/** Registreert de service worker. Alleen in productie-builds — tijdens `npm run dev` zou een
 *  cache-eerst-strategie verwarrende verouderde-inhoud-problemen geven terwijl Vite's eigen
 *  dev-server toch al elke wijziging direct serveert. */
export function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;
  // Vereist een secure context (https/localhost) — altijd "null origin" en dus kansloos
  // onder file:// (de standalone build). Niet eens proberen, scheelt een onnodige console-
  // foutmelding voor iets dat toch al geen effect zou hebben (zo'n lokaal bestand heeft an
  // sich al geen netwerk nodig om "offline" te werken).
  if (location.protocol === 'file:') return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.error('Service worker registratie mislukt:', error);
    });
  });
}
