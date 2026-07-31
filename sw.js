/*
 * GrooveCore service worker (WS-I)
 * Versioned precache of the full app shell; cache-first with network fallback.
 * Bump CACHE on every deploy so clients pick up the new shell.
 *
 * Cloudflare Pages: NEVER cache redirected responses. A followed 301/302 still
 * has response.ok === true and response.redirected === true; caching those
 * breaks later navigations ("loads once, then not again").
 */

const CACHE = 'gc-v8';

const PRECACHE = [
  // Shell (prefer index.html over "/" — "/" often 301/302 on Pages)
  '/index.html',
  '/styles.css',
  '/app.js',
  '/presets.js',
  '/inspiration-sequences.js',
  '/midi-mapping.js',
  '/midi_export_enhanced.js',
  '/manifest.webmanifest',
  '/404.html',

  // Boot loader + modules (plan section 6 file map)
  '/js/main.js',
  '/js/core/events.js',
  '/js/core/schema.js',
  '/js/audio/params.js',
  '/js/audio/voices.js',
  '/js/audio/bus.js',
  '/js/io/smf.js',
  '/js/io/export-midi.js',
  '/js/io/export-audio.js',
  '/js/io/export-name.js',
  '/js/io/wav-encode.js',
  '/js/io/zip.js',
  '/js/ui/ui-kit.js',
  '/js/ui/history.js',
  '/js/ui/autosave.js',
  '/js/ui/share.js',
  '/js/ui/project-io.js',
  '/js/ui/keys.js',
  '/js/ui/tempo-tools.js',
  '/js/ui/shortcut-overlay.js',
  '/js/ui/chain.js',
  '/js/ui/knob-engine.js',
  '/js/ui/export-menu.js',
  '/js/ui/preset-browser.js',
  '/js/ui/onboarding.js',
  '/js/ui/a11y.js',
  '/js/ui/mobile.js',
  '/js/ui/step-editor.js',
  '/js/ui/step-context.js',
  '/js/perf/pads.js',
  '/js/perf/midi-in.js',
  '/js/perf/record.js',
  '/js/data/preset-meta.js',

  // Override stylesheets
  '/css/tokens.css',
  '/css/polish.css',
  '/css/a11y.css',
  '/css/mobile.css',
  '/css/preset-browser.css',
  '/css/onboarding.css',
  '/css/step-editor.css',
  '/css/step-context.css',
  '/css/toast.css',
  '/css/brand.css',
  '/css/shell.css',
  '/js/io/ai-prompt.js',

  // Vendored libraries + fonts
  '/vendor/Tone.min.js',
  '/vendor/tailwind-play.js',
  '/vendor/fonts/fonts.css',
  '/vendor/fonts/roboto-latin.woff2',
  '/vendor/fonts/roboto-latin-ext.woff2',
  '/vendor/fonts/roboto-cyrillic.woff2',
  '/vendor/fonts/roboto-cyrillic-ext.woff2',
  '/vendor/fonts/roboto-greek.woff2',
  '/vendor/fonts/roboto-greek-ext.woff2',
  '/vendor/fonts/roboto-vietnamese.woff2',
  '/vendor/fonts/roboto-math.woff2',
  '/vendor/fonts/roboto-symbols.woff2',
  '/vendor/fonts/material-icons.woff2',
  '/vendor/fonts/material-symbols-outlined.woff2',
  '/vendor/fonts/climate-crisis.woff2',

  // Icons
  '/icons/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/og.png'
];

/** Only clean same-origin 200s — never redirects (Cloudflare Pages safe). */
function isCacheable(response) {
  return !!(
    response
    && response.status === 200
    && !response.redirected
    && response.type === 'basic'
  );
}

function precacheUrl(cache, url) {
  return fetch(url, { redirect: 'follow', cache: 'no-cache' })
    .then((response) => {
      if (!isCacheable(response)) {
        console.warn('[sw] precache skipped (not a clean 200):', url,
          response && response.status, response && response.redirected);
        return;
      }
      return cache.put(url, response);
    })
    .catch((err) => {
      console.warn('[sw] precache skipped:', url, err && err.message);
    });
}

self.addEventListener('install', (event) => {
  // Forces the waiting worker active immediately on update
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(PRECACHE.map((url) => precacheUrl(cache, url)))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GETs; let everything else hit the network.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigations resolve to the cached shell (ignore hash/query share params).
  const isNavigation = req.mode === 'navigate';
  const cacheKey = isNavigation ? '/index.html' : url.pathname;

  // Never try to cache the service worker script itself via this path.
  if (url.pathname === '/sw.js') return;

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(cacheKey).then((cached) => {
        if (cached) return cached;

        return fetch(req).then((networkResponse) => {
          // CRITICAL: do not cache redirected responses (Pages trailing-slash /
          // apex redirects). Followed redirects still report ok === true.
          if (isCacheable(networkResponse)) {
            cache.put(cacheKey, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Offline and not cached: fall back to the shell for navigations.
          if (isNavigation) return cache.match('/index.html');
          return Response.error();
        });
      })
    )
  );
});
