// https://developer.mozilla.org/zh-CN/docs/Web/API/Cache
// https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage

const CACHE_NAME = 'cache-demo';

self.addEventListener('install', function(event) {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './cat.png'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log(caches.keys())
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // console.log(cacheName)
          return cacheName != CACHE_NAME;
        }).map(function(cacheName) {
          // console.log(cacheName)
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(event.request)
      if (response) {
        console.log(' Found response in cache:', response);
        return response;
      }
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          console.log(cache)
          // cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});