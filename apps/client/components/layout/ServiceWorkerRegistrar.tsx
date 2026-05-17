'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // In development mode, automatically unregister the service worker to avoid caching stale assets
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((unregistered) => {
            if (unregistered) {
              console.log('Successfully unregistered service worker in development mode.');
            }
          });
        }
      });
      return;
    }

    // Only register in production on HTTPS or localhost/127.0.0.1 (standard PWA requirements)
    if (
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration.scope);
          })
          .catch((error) => {
            console.error('SW registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
