import { test } from "node:test";
import assert from "node:assert/strict";
import { handlePwaEvent } from "../events-route.ts";
import { PWA_EVENTS } from "../telemetry.ts";

const post = (body: string) => handlePwaEvent(new Request("http://x/api/pwa-events", { method: "POST", body }));

function captureLogs<T>(fn: () => Promise<T>) {
  const lines: string[] = [];
  const orig = console.info;
  console.info = (l: string) => void lines.push(l);
  return fn().then(
    (r) => ((console.info = orig), { r, lines }),
    (e) => ((console.info = orig), Promise.reject(e)),
  );
}

test("accepts every allowlisted event and logs one structured line", async () => {
  for (const event of PWA_EVENTS) {
    const { r, lines } = await captureLogs(() => post(JSON.stringify({ event })));
    assert.equal(r.status, 204);
    assert.equal(lines.length, 1);
    const parsed = JSON.parse(lines[0]);
    assert.equal(parsed.type, "pwa_event");
    assert.equal(parsed.event, event);
  }
});

test("rejects unknown events, bad JSON and oversized bodies without logging", async () => {
  for (const [body, status] of [
    [JSON.stringify({ event: "drop_table" }), 400],
    ["not json", 400],
    [JSON.stringify({}), 400],
    [JSON.stringify({ event: "x".repeat(2000) }), 413],
  ] as const) {
    const { r, lines } = await captureLogs(() => post(body));
    assert.equal(r.status, status);
    assert.equal(lines.length, 0);
  }
});
