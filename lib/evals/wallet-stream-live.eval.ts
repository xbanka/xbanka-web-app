import { describe, expect, it } from "vitest";
import { streamUrl } from "@/lib/walletStream";

// Live contract eval for GET /wallets/stream (backend PR #40).
//
// The gate tests pin lib/walletStream.ts to the integration guide. This checks
// the deployed backend still matches the guide: ticket envelope, event-stream
// content type, snapshot first, single-use tickets, and that every wallet
// GET /wallets lists is in the snapshot (otherwise the UI cannot patch it).
//
// Pass threshold: every case. Read-only: no money moves.
//
// Required:
//   XBANKA_EVAL_API_URL        staging/preprod API base URL. Deliberately not
//                              read from NEXT_PUBLIC_API_URL, which may be prod.
//   XBANKA_EVAL_ACCESS_TOKEN   JWT of any test user

const env = process.env;
const API_URL = env.XBANKA_EVAL_API_URL?.replace(/\/$/, "");
const TOKEN = env.XBANKA_EVAL_ACCESS_TOKEN;
const configured = Boolean(API_URL && TOKEN);

// An eval that could not run is not a pass, so missing config fails loudly.
it.runIf(!configured)("is configured", () => {
  throw new Error("Set XBANKA_EVAL_API_URL and XBANKA_EVAL_ACCESS_TOKEN.");
});

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
  "x-device-id": "wallet-stream-eval",
  "x-device-name": "eval",
  "x-device-type": "desktop",
};

const getTicket = async () => {
  const res = await fetch(`${API_URL}/wallets/stream/ticket`, {
    method: "POST",
    headers,
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

/** Reads SSE frames until `count` named events arrive, then aborts. */
const readEvents = async (url: string, count: number) => {
  const controller = new AbortController();
  const res = await fetch(url, { signal: controller.signal });
  const events: { event: string; data: unknown }[] = [];
  if (!res.ok || !res.body) {
    controller.abort();
    return { res, events, body: await res.text().catch(() => "") };
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (events.length < count) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let end: number;
    while ((end = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      const field = (name: string) =>
        frame
          .split("\n")
          .filter((l) => l.startsWith(`${name}:`))
          .map((l) => l.slice(name.length + 1).trimStart())
          .join("\n");
      if (!field("data")) continue;
      events.push({ event: field("event") || "message", data: JSON.parse(field("data")) });
    }
  }
  controller.abort();
  return { res, events, body: "" };
};

describe.skipIf(!configured)("wallet stream: live backend contract", () => {
  it("issues a one-time ticket in the usual envelope", async () => {
    const { status, json } = await getTicket();
    expect(status).toBeLessThan(300);
    expect(typeof json.data?.ticket).toBe("string");
    expect(json.data?.expiresInSeconds).toBe(60);
  });

  it("streams a snapshot first that covers every wallet GET /wallets lists", async () => {
    const { json } = await getTicket();
    const { res, events } = await readEvents(streamUrl(API_URL!, json.data.ticket), 1);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);
    expect(events[0]?.event).toBe("snapshot");
    const wallets = (events[0].data as { wallets: { currency: string; type: string; balance: number }[] }).wallets;
    for (const w of wallets) {
      expect(typeof w.currency).toBe("string");
      expect(["FIAT", "CRYPTO"]).toContain(w.type);
      expect(Number.isFinite(w.balance)).toBe(true);
    }

    const listed = await fetch(`${API_URL}/wallets`, { headers }).then((r) => r.json());
    const streamed = new Map(wallets.map((w) => [w.currency.toUpperCase(), w.balance]));
    for (const w of listed.data as { currency: string; balance: number }[]) {
      expect(streamed.has(w.currency.toUpperCase()), w.currency).toBe(true);
      expect(streamed.get(w.currency.toUpperCase())).toBeCloseTo(Number(w.balance), 6);
    }
  });

  it("rejects a reused ticket and a missing ticket with a JSON 401", async () => {
    const { json } = await getTicket();
    const url = streamUrl(API_URL!, json.data.ticket);
    await readEvents(url, 1);

    const reused = await readEvents(url, 1);
    expect(reused.res.status).toBe(401);
    expect(reused.res.headers.get("content-type")).toMatch(/json/);

    const missing = await fetch(`${API_URL}/wallets/stream`);
    expect(missing.status).toBe(401);
  });
});
