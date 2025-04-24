// service-worker.js
const CACHE_NAME = 'offline-app-cache-v1';

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker installed');
        // Cache the index page by default
        return cache.add('/index.html');
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    // Try the cache first
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise try to fetch it
        return fetch(event.request)
          .then(response => {
            // If we got a valid response, clone it and store in cache
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(error => {
            // For navigation requests, return the cached index.html if available
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            console.error('Fetch failed:', error);
            // You can return a custom offline page or asset here
            return new Response('You are offline and this resource is not cached.');
          });
      })
  );
});

// Clean old caches when a new service worker activates
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Immediately claim clients so the SW can control current pages
  return self.clients.claim();
});