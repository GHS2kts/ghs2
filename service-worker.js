const CACHE_NAME = 'ghs-dashboard-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/assets/js/index.js',
  '/assets/bg-morning.jpg',
  '/assets/bg-afternoon.jpg',
  '/assets/bg-evening.jpg',
  '/assets/qr-facebook-ghs.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
