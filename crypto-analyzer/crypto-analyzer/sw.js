// Service Worker for Crypto Analyzer Pro
const CACHE_NAME = 'crypto-analyzer-v1';
const OFFLINE_URL = '/';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/analysis.js',
  '/js/i18n.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external API calls (always fetch fresh data)
  const url = new URL(event.request.url);
  if (url.hostname.includes('coingecko') || 
      url.hostname.includes('alternative.me') ||
      url.hostname.includes('tradingview')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((response) => {
          return response || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const title = data.title || 'Crypto Signal';
  const options = {
    body: data.body || 'New trading signal detected!',
    icon: '/img/icon-192.png',
    badge: '/img/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      signal: data.signal,
      probability: data.probability
    },
    actions: [
      { action: 'view', title: '📊 View Analysis' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ],
    requireInteraction: true,
    tag: `signal-${Date.now()}`
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') return;
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Periodic background sync (for notifications)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'crypto-analysis-sync') {
    event.waitUntil(fetchAndNotify());
  }
});

async function fetchAndNotify() {
  try {
    // This would fetch fresh data and send notifications
    // Implementation depends on backend integration
    console.log('[SW] Background sync triggered');
  } catch (err) {
    console.error('[SW] Background sync failed:', err);
  }
}
