/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("../../../public/sw.js", import.meta.url), "utf8");

type Handler = (event: any) => void;

function boot({ online }: { online: boolean }) {
  const handlers: Record<string, Handler> = {};
  const store = new Map<string, Response>();
  const caches = {
    open: async () => ({ add: async (req: Request) => void store.set(new URL(req.url).pathname, new Response("OFFLINE PAGE")) }),
    match: async (url: string) => store.get(url)?.clone(),
    keys: async () => ["xbanka-shell-v1", "stale-old"],
    delete: async (k: string) => { deleted.push(k); return true; },
  };
  const deleted: string[] = [];
  const shown: { title: string; options: any }[] = [];
  const badges: (number | "cleared")[] = [];
  const opened: string[] = [];
  const windows: any[] = [];
  const self = {
    addEventListener: (type: string, fn: Handler) => (handlers[type] = fn),
    skipWaiting: () => Promise.resolve(),
    clients: {
      claim: () => Promise.resolve(),
      matchAll: async () => windows,
      openWindow: async (url: string) => void opened.push(url),
    },
    registration: {
      showNotification: async (title: string, options: any) => void shown.push({ title, options }),
    },
    navigator: {
      setAppBadge: async (n: number) => void badges.push(n),
      clearAppBadge: async () => void badges.push("cleared"),
    },
    location: { origin: "http://x" },
  };
  const fetchImpl = async () => {
    if (!online) throw new TypeError("network down");
    return new Response("LIVE");
  };
  // Browsers resolve relative Request URLs against the worker's location; Node does not.
  const SwRequest = class extends Request {
    constructor(input: string | Request, init?: RequestInit) {
      super(typeof input === "string" ? new URL(input, "http://x").href : input, init);
    }
  };
  vm.runInNewContext(code, { self, caches, fetch: fetchImpl, Request: SwRequest, Response, URL, Promise });
  return { handlers, store, deleted, shown, badges, opened, windows };
}

/** Runs an event whose handler calls waitUntil, and waits for it. */
const dispatch = (handler: Handler, event: Record<string, unknown>) =>
  new Promise<void>((res, rej) =>
    handler({ ...event, waitUntil: (p: Promise<unknown>) => p.then(() => res(), rej) }),
  );

const pushData = (payload: unknown) => ({
  json: () => (typeof payload === "string" ? JSON.parse(payload) : payload),
  text: () => (typeof payload === "string" ? payload : JSON.stringify(payload)),
});

const fetchEvent = (request: Partial<Request>) => {
  let responded: Promise<Response> | undefined;
  return {
    event: { request, respondWith: (p: Promise<Response>) => (responded = p) },
    get responded() { return responded; },
  };
};

test("offline navigation gets the offline page", async () => {
  const sw = boot({ online: false });
  await new Promise<void>((res) => sw.handlers.install({ waitUntil: (p: Promise<void>) => p.then(res) }));
  const f = fetchEvent({ mode: "navigate", method: "GET", url: "http://x/wallet" } as any);
  sw.handlers.fetch(f.event);
  assert.equal(await (await f.responded!).text(), "OFFLINE PAGE");
});

test("online navigation passes through to the network", async () => {
  const sw = boot({ online: true });
  const f = fetchEvent({ mode: "navigate", method: "GET", url: "http://x/wallet" } as any);
  sw.handlers.fetch(f.event);
  assert.equal(await (await f.responded!).text(), "LIVE");
});

test("API calls, assets and non-GET requests are never intercepted", () => {
  const sw = boot({ online: false });
  for (const req of [
    { mode: "cors", method: "GET", url: "http://x/api/wallet/balance" },
    { mode: "no-cors", method: "GET", url: "http://x/_next/static/a.js" },
    { mode: "navigate", method: "POST", url: "http://x/sign-in" },
  ]) {
    const f = fetchEvent(req as any);
    sw.handlers.fetch(f.event);
    assert.equal(f.responded, undefined, `${req.method} ${req.url} was intercepted`);
  }
});

test("activate removes old caches but keeps the current one", async () => {
  const sw = boot({ online: true });
  await new Promise<void>((res) => sw.handlers.activate({ waitUntil: (p: Promise<void>) => p.then(res) }));
  assert.deepEqual(sw.deleted, ["stale-old"]);
});

test("service worker source never references API or auth data", () => {
  assert.doesNotMatch(code, /\/api|accessToken|cache\.put|cache\.addAll/);
});

test("a push shows a notification and sets the icon badge", async () => {
  const sw = boot({ online: true });
  await dispatch(sw.handlers.push, {
    data: pushData({ title: "Money received", body: "₦5,000 from Ada", url: "/wallet", badgeCount: 3, tag: "n1" }),
  });
  assert.equal(sw.shown.length, 1);
  assert.equal(sw.shown[0].title, "Money received");
  assert.equal(sw.shown[0].options.body, "₦5,000 from Ada");
  assert.equal(sw.shown[0].options.tag, "n1");
  assert.equal(sw.shown[0].options.data.url, "/wallet");
  assert.deepEqual(sw.badges, [3]);
});

test("a push without JSON or with an outside URL still shows safely", async () => {
  const sw = boot({ online: true });
  await dispatch(sw.handlers.push, {
    data: { json: () => { throw new Error("not json"); }, text: () => "Hello" },
  });
  await dispatch(sw.handlers.push, { data: pushData({ body: "x", url: "https://evil.example" }) });
  assert.equal(sw.shown[0].title, "Xbanka");
  assert.equal(sw.shown[0].options.body, "Hello");
  assert.equal(sw.shown[1].options.data.url, "/notifications");
});

test("tapping a notification focuses an open Xbanka window at its URL", async () => {
  const sw = boot({ online: true });
  const navigated: string[] = [];
  const win = { url: "http://x/", focus: async () => win, navigate: async (u: string) => void navigated.push(u) };
  sw.windows.push(win);
  let closed = false;
  await dispatch(sw.handlers.notificationclick, {
    notification: { data: { url: "/transactions" }, close: () => (closed = true) },
  });
  assert.ok(closed);
  assert.deepEqual(navigated, ["/transactions"]);
  assert.deepEqual(sw.opened, []);
});

test("tapping a notification opens Xbanka when no window is open", async () => {
  const sw = boot({ online: true });
  await dispatch(sw.handlers.notificationclick, {
    notification: { data: { url: "/wallet" }, close: () => {} },
  });
  assert.deepEqual(sw.opened, ["/wallet"]);
});

test("a notification without a URL opens /notifications", async () => {
  const sw = boot({ online: true });
  await dispatch(sw.handlers.push, { data: pushData({ title: "Hi", body: "x" }) });
  assert.equal(sw.shown[0].options.data.url, "/notifications");
  await dispatch(sw.handlers.notificationclick, {
    notification: { data: {}, close: () => {} },
  });
  assert.deepEqual(sw.opened, ["/notifications"]);
});
