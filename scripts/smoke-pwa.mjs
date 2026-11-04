#!/usr/bin/env node
/**
 * Smoke test for installability against a running server, no cookies, no
 * redirect following (exactly how a browser fetches these).
 *
 *   npm run build && npm start &   # then:
 *   node scripts/smoke-pwa.mjs [baseUrl]
 */
const BASE = (process.argv[2] ?? process.env.PWA_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const CHECKS = [
  { path: "/manifest.webmanifest", type: /json/ },
  { path: "/sw.js", type: /javascript/, headers: { "cache-control": /no-cache/ } },
  { path: "/offline.html", type: /html/ },
  { path: "/icons/icon-192.png", type: /image\/png/ },
  { path: "/icons/icon-512.png", type: /image\/png/ },
  { path: "/icons/icon-maskable-512.png", type: /image\/png/ },
  { path: "/apple-icon.png", type: /image\/png/ },
];

let failed = 0;
for (const c of CHECKS) {
  const res = await fetch(BASE + c.path, { redirect: "manual" });
  const problems = [];
  if (res.status !== 200) problems.push(`status ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`);
  const type = res.headers.get("content-type") ?? "";
  if (!c.type.test(type)) problems.push(`content-type "${type}"`);
  for (const [h, re] of Object.entries(c.headers ?? {})) {
    const v = res.headers.get(h) ?? "";
    if (!re.test(v)) problems.push(`${h} "${v}"`);
  }
  if (c.path === "/manifest.webmanifest" && problems.length === 0) {
    const m = await res.json();
    if (m.display !== "standalone" || !m.icons?.length) problems.push("manifest JSON missing display/icons");
  }
  console.log(`${problems.length ? "  ✗" : "  ✓"} ${c.path}${problems.length ? "  " + problems.join("; ") : ""}`);
  if (problems.length) failed++;
}
if (failed) {
  console.error(`\n  ${failed} PWA check(s) failed against ${BASE}`);
  process.exit(1);
}
console.log(`\n  PWA smoke test passed against ${BASE}`);
