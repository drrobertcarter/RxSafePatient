/* RxSafeCheck service worker — offline app shell + safe runtime caching.
   Bump CACHE_VERSION whenever you deploy new app.html/index.html so users get the update. */
const CACHE_VERSION = "rxsafecheck-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/app.html",
  "/manifest.webmanifest",
  "/logo.svg",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png"
];

// Install: pre-cache the app shell so the app opens offline.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: clear old caches from previous versions.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Fetch strategy:
//  - Live data APIs (NIH, FDA, ClinicalTrials, OSM, Google): always go to the network,
//    never serve stale medical/search data from cache.
//  - Navigation + app shell + icons: cache-first with network fallback, so the app
//    works offline once installed.
const NETWORK_ONLY = [
  "rxnav.nlm.nih.gov", "api.fda.gov", "dailymed.nlm.nih.gov", "clinicaltrials.gov",
  "eutils.ncbi.nlm.nih.gov", "dsld.od.nih.gov", "overpass-api.de", "nominatim.openstreetmap.org",
  "accounts.google.com", "apis.google.com", "esm.sh", "cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"
];

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Never intercept live-data / third-party calls — let them hit the network directly.
  if (NETWORK_ONLY.some(host => url.hostname.includes(host))) return;

  // Only handle same-origin requests for the shell.
  if (url.origin !== self.location.origin) return;

  // Navigation requests: try network, fall back to cached app shell (offline).
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match("/app.html") || caches.match("/index.html")))
    );
    return;
  }

  // Everything else same-origin: cache-first, then network (and cache it).
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      if (resp && resp.status === 200 && resp.type === "basic") {
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
      }
      return resp;
    }).catch(() => cached))
  );
});
