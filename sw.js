// Сервис-воркер: приложение грузится офлайн после первого открытия с сайта
const CACHE = 'shifa-v1';
const FILES = ['index.html', 'styles.css', 'app.js', 'data.js', 'manifest.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      return r || fetch(e.request).then(function (res) {
        return caches.open(CACHE).then(function (cache) {
          if (res && res.status === 200 && res.url.indexOf('http') === 0) {
            cache.put(e.request, res.clone());
          }
          return res;
        });
      });
    })
  );
});
