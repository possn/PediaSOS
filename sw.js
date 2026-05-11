/* PediaSOS Service Worker v17 */
const C = 'pediasos-v17';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/style.css',
  '/assets/main.js',
  '/assets/logo.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => k !== C).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Network first for HTML pages
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // Cache first for assets
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(C).then(c => c.put(e.request, clone));
        return response;
      }))
    );
  }
});
