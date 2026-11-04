import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Next reads `config.matcher` statically from the source, so do the same.
const src = readFileSync(new URL("../../../proxy.ts", import.meta.url), "utf8");
const literal = src.match(/matcher:\s*\[\s*(?:\/\*[\s\S]*?\*\/\s*)?"([^"]+)"/);
assert.ok(literal, "could not find matcher literal in proxy.ts");
const matcher = new RegExp("^" + JSON.parse(`"${literal![1]}"`) + "$");

const runsProxy = (path: string) => matcher.test(path);

test("PWA files bypass the auth proxy (the bug that broke installability)", () => {
  for (const path of ["/manifest.webmanifest", "/sw.js", "/offline.html"]) {
    assert.equal(runsProxy(path), false, `${path} must not be redirected to /sign-in`);
  }
});

test("icons bypass the auth proxy", () => {
  for (const path of [
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-maskable-512.png",
    "/apple-icon.png",
    "/favicon-square.png",
  ]) {
    assert.equal(runsProxy(path), false, `${path} must be public`);
  }
});

test("app pages still go through the auth proxy", () => {
  for (const path of ["/", "/wallet", "/crypto", "/account", "/sign-in"]) {
    assert.equal(runsProxy(path), true, `${path} must still hit the proxy`);
  }
});
