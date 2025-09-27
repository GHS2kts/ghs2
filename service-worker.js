const CACHE_NAME = "ghs-dashboard-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/assets/js/index.js",
  "/assets/js/login.js",
  "/assets/js/teacher-portal.js",
  "/assets/js/admin.js",
  "/assets/js/display.js",
  "/pages/login.html",
  "/pages/admin.html",
  "/pages/teacher-portal.html",
  "/pages/display.html",
  "/assets/bg-morning.jpg",
  "/assets/bg-afternoon.jpg",
  "/assets/bg-evening.jpg",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
