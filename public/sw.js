self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

// Optional: basic fetch passthrough (no caching needed for now)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})