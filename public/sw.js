// XBanka service worker.
//
// Scope is deliberately tiny: it exists so the app is installable and shows a
// friendly page when the network is down. It NEVER caches API calls, auth
// responses, balances or transactions. Stale money data is worse than none.

const CACHE = "xbanka-shell-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Page navigations only. Everything else (API, assets, RSC payloads) goes
// straight to the network with no interception.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode !== "navigate" || request.method !== "GET") return;

  event.respondWith(
    fetch(request).catch(() =>
      caches.match(OFFLINE_URL).then(
        (res) =>
          res ||
          new Response("You are offline.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }),
      ),
    ),
  );
});
