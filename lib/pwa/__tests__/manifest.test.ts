import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import manifest from "../../../app/manifest.ts";

const root = new URL("../../../", import.meta.url);
const m = manifest();

function pngSize(path: URL) {
  const buf = readFileSync(path);
  assert.equal(buf.subarray(1, 4).toString(), "PNG", `${path.pathname} is not a PNG`);
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`;
}

test("manifest has the fields Chrome needs to offer install", () => {
  assert.equal(m.display, "standalone");
  assert.equal(m.start_url, "/");
  assert.equal(m.scope, "/");
  assert.equal(m.id, "/");
  assert.ok(m.name && m.short_name);
  assert.match(m.background_color ?? "", /^#[0-9a-f]{6}$/i);
  assert.match(m.theme_color ?? "", /^#[0-9a-f]{6}$/i);
  assert.ok(!/built with next/i.test(m.description ?? ""), "placeholder description left in");
});

test("every manifest icon exists on disk with the size it declares", () => {
  for (const icon of m.icons ?? []) {
    const file = new URL("public" + icon.src, root);
    assert.ok(existsSync(file), `${icon.src} missing`);
    assert.equal(pngSize(file), icon.sizes, `${icon.src} is not ${icon.sizes}`);
  }
});

test("has 192 + 512 'any' icons and a 512 maskable icon", () => {
  const icons = m.icons ?? [];
  const has = (sizes: string, purpose: string) =>
    icons.some((i) => i.sizes === sizes && i.purpose === purpose);
  assert.ok(has("192x192", "any"));
  assert.ok(has("512x512", "any"));
  assert.ok(has("512x512", "maskable"));
});

test("iOS apple-icon is 180x180", () => {
  assert.equal(pngSize(new URL("app/apple-icon.png", root)), "180x180");
});

test("layout declares iOS web-app metadata and viewport theme color", () => {
  const layout = readFileSync(new URL("app/layout.tsx", root), "utf8");
  assert.match(layout, /appleWebApp/);
  assert.match(layout, /export const viewport/);
  assert.match(layout, /<ServiceWorkerRegistration \/>/, "service worker is not mounted");
});

test("next.config serves sw.js uncached", () => {
  const cfg = readFileSync(new URL("next.config.ts", root), "utf8");
  assert.match(cfg, /source:\s*"\/sw\.js"/);
  assert.match(cfg, /no-cache/);
});
