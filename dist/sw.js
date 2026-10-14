// Handgeschreven service worker — bewust geen Workbox/vite-plugin-pwa-runtime, zodat wat
// daadwerkelijk naar de browser gaat volledig leesbaar/auditeerbaar blijft (zie plan §6).
//
// BELANGRIJK: verhoog CACHE_VERSION bij elke inhoudelijke release.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `rv-checker-${CACHE_VERSION}`;

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME);
  const indexResponse = await fetch('/index.html', { cache: 'no-store' });
  const indexHtml = await indexResponse.clone().text();
  const assetPaths = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);

  await cache.put('/index.html', indexResponse.clone());
  await cache.put('/', indexResponse);
  await Promise.all(
    assetPaths.map(async (path) => {
      const response = await fetch(path, { cache: 'no-store' });
      await cache.put(path, response);
    }),
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
      // Bewust GEEN self.clients.claim() hier: een reeds open pagina blijft tot haar eigen
      // volgende navigatie onder controle van de oude/geen SW. Dat is iets terughoudender,
      // maar vermijdt dat een actieve sessie midden in een navigatie van controller wisselt.
    })(),
  );
});

// Bekende beperking, bewust tijdelijk zo gelaten: een cache-eerst fetch-handler (meerdere
// varianten geprobeerd: een aparte navigate-tak, één uniforme strategie) liet in mijn
// eigen testomgeving (headless Chromium via Playwright, --no-sandbox) paginaherladingen
// hangen zodra deze SW de controller was — zelfs bij een volledig lege, niets-doende
// fetch-handler en zonder dat er iets offline werd gesimuleerd. Dat wijst sterk op een
// eigenaardigheid van die specifieke testomgeving, niet op een fout in de strategie zelf
// (een fetch-handler die nooit respondWith() aanroept kan per specificatie niets anders
// doen dan gewoon naar het netwerk laten gaan). Omdat ik dit vermoeden niet in een echte
// browser heb kunnen bevestigen, staat hier bewust GEEN fetch-interceptie: de app werkt
// daardoor gegarandeerd normaal, maar heeft nog geen echte offline-ondersteuning. De cache
// uit cacheAppShell() is al wel gevuld en vormt de basis voor een latere, in een echte
// browser geverifieerde fetch-strategie.
