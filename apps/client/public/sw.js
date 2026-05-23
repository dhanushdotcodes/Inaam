const CACHE_NAME = 'inaam-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install Event: cache static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use Promise.allSettled to ensure failure of one asset (e.g. 404) does not block SW installation
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`Failed to cache asset during install: ${url}`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: intercept and apply optimized caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Only handle GET requests; bypass cache for POST, PUT, DELETE, etc.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 2. Bypass caching completely for API routes, hot module reloading, and external domains
  if (!isSameOrigin || url.pathname.startsWith('/api/') || url.pathname.includes('/_next/webpack-hmr')) {
    return;
  }

  // 3. Network-First Strategy for HTML Documents & Next.js page data / RSC payloads
  // - Navigation requests (pages)
  // - Next.js App Router RSC payload requests (indicated by RSC header or _rsc query parameter)
  // - Next.js page data JSON requests (path contains /_next/data/)
  const isDocument = request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html');
  const isNextData = request.headers.get('RSC') || url.searchParams.has('_rsc') || url.pathname.includes('/_next/data/');

  if (isDocument || isNextData) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to the root document if specific page is not cached
            if (isDocument) return caches.match('/');
          });
        })
    );
    return;
  }

  // 4. Cache-First Strategy for Hashed Static Assets
  // Next.js hashed files (JS/CSS in /_next/static/) are immutable and safe to serve from cache immediately.
  const isHashedAsset = url.pathname.includes('/_next/static/');
  if (isHashedAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. Stale-While-Revalidate Strategy for unhashed local assets (images, manifest, icons, favicon)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Silent catch for offline or network issues during background fetch
        });

      return cachedResponse || fetchPromise;
    })
  );
});
