'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';

export function ServiceWorkerRegistrar() {
  const addToast = useToast((s) => s.addToast);

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

            // Listen for service worker updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (!newWorker) return;

              newWorker.addEventListener('statechange', () => {
                // Trigger toast only if there's an existing controller (i.e. this is an update, not first install)
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  addToast({
                    message: 'A new update is available! Click refresh to apply the changes.',
                    type: 'info',
                    duration: 15000,
                    action: {
                      label: 'Refresh',
                      onClick: () => {
                        window.location.reload();
                      },
                    },
                  });
                }
              });
            });
          })
          .catch((error) => {
            console.error('SW registration failed:', error);
          });
      });
    }
  }, [addToast]);

  return null;
}
