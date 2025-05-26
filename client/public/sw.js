const CACHE_NAME = "ToDoListApp_v1";
const urlsToCache = [
  "/favicon.ico",
  "/robots.txt",
  "/",
  "/manifest.json",
  "/Screenshot.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response)
    )
  );
});
