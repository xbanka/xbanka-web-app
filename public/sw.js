// XBanka service worker.
//
// Scope is deliberately tiny: it exists so the app is installable, shows a
// friendly page when the network is down, and shows push notifications while
// the app is closed. It NEVER caches API calls, auth responses, balances or
// transactions. Stale money data is worse than none.

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

// ---- Push notifications ----
//
// The backend sends a JSON payload (see lib/push/push-notifications.ts):
//   { title, body, url?, tag?, badgeCount?, notificationId? }
// It is shown as a system notification; tapping it opens or focuses Xbanka
// at `url`. `badgeCount` sets the unread count on the installed app's icon.

const parsePush = (event) => {
  if (!event.data) return {};
  try {
    return event.data.json() || {};
  } catch {
    return { body: event.data.text() };
  }
};

self.addEventListener("push", (event) => {
  const data = parsePush(event);
  const title = typeof data.title === "string" && data.title ? data.title : "Xbanka";
  const url = typeof data.url === "string" && data.url.startsWith("/") ? data.url : "/";

  const jobs = [
    self.registration.showNotification(title, {
      body: typeof data.body === "string" ? data.body : "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: typeof data.tag === "string" ? data.tag : data.notificationId || undefined,
      data: { url },
    }),
  ];
  if (typeof data.badgeCount === "number" && self.navigator && self.navigator.setAppBadge) {
    jobs.push(
      (data.badgeCount > 0
        ? self.navigator.setAppBadge(data.badgeCount)
        : self.navigator.clearAppBadge()
      ).catch(() => {}),
    );
  }
  event.waitUntil(Promise.all(jobs));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) {
        return open.focus().then((w) => (w && "navigate" in w ? w.navigate(url) : w));
      }
      return self.clients.openWindow(url);
    }),
  );
});
