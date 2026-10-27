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
  const self = {
    addEventListener: (type: string, fn: Handler) => (handlers[type] = fn),
    skipWaiting: () => Promise.resolve(),
    clients: { claim: () => Promise.resolve() },
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
  return { handlers, store, deleted };
}

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
