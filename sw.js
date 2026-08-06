// Service Worker v2 - Cache Updated
var CACHE_NAME = 'crypto-analyzer-v8';

var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/bundle.js',
  '/manifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

// Install - clear old cache, cache new files
self.addEventListener('install', function(event) {
  console.log('[SW v2] Installing...');
  
  // Delete ALL old caches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          console.log('[SW v2] Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    }).then(function() {
      // Cache new files
      return caches.open(CACHE_NAME).then(function(cache) {
        console.log('[SW v2] Caching new files');
        return cache.addAll(ASSETS_TO_CACHE).catch(function(err) {
          console.warn('[SW v2] Some assets failed to cache:', err);
        });
      });
    })
  );
  
  self.skipWaiting();
});

// Activate - claim all clients
self.addEventListener('activate', function(event) {
  console.log('[SW v2] Activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) {
            console.log('[SW v2] Deleting:', name);
            return caches.delete(name);
          })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  
  var url;
  try {
    url = new URL(event.request.url);
  } catch(e) {
    return;
  }
  
  // Skip external API calls
  if (url.hostname.indexOf('binance') !== -1 || 
      url.hostname.indexOf('coingecko') !== -1 || 
      url.hostname.indexOf('alternative.me') !== -1 ||
      url.hostname.indexOf('tradingview') !== -1 ||
      url.hostname.indexOf('googleapis') !== -1 ||
      url.hostname.indexOf('gstatic') !== -1) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        return caches.match(event.request).then(function(response) {
          return response || caches.match('/');
        });
      })
  );
});

// Notification events
self.addEventListener('push', function(event) {
  if (!event.data) return;
  
  var data = event.data.json();
  var title = data.title || 'Crypto Signal';
  var options = {
    body: data.body || 'New trading signal!',
    icon: '/img/icon-192.png',
    badge: '/img/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/', signal: data.signal },
    actions: [
      { action: 'view', title: '📊 View' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ],
    requireInteraction: true,
    tag: 'signal-' + Date.now()
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;
  
  var urlToOpen = '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
