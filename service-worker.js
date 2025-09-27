const CACHE_NAME = 'ghs-dashboard-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/assets/js/index.js',
  '/assets/js/display.js',
  '/assets/bg-morning.jpg',
  '/assets/bg-afternoon.jpg',
  '/assets/bg-evening.jpg',
  '/assets/qr-facebook-ghs.png',
  '/pages/display.html',
  '/pages/login.html',
  '/pages/teacher-portal.html',
  '/pages/admin.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching dashboard assets');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});
