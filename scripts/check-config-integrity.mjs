#!/usr/bin/env node
/**
 * Build-config integrity check.
 *
 * In June 2026 an obfuscated payload was injected into postcss.config.mjs and
 * went unnoticed for a month. It was hidden behind ~500 spaces on a single line,
 * so the file looked normal in an editor. It ran on every `next dev` / `next
 * build`, pulled encrypted instructions from a blockchain, executed them, and
 * spawned a detached background process.
 *
 * This guards the config files that execute at build time. Run it in CI and
 * from a pre-commit hook.
 *
 * Exit code 0 = clean, 1 = suspicious.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

// Files evaluated by the build toolchain — these run as code, so they are the
// valuable targets. Add new ones here as the project grows.
const WATCHED = [
  "postcss.config.mjs",
  "postcss.config.js",
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
  "tailwind.config.ts",
  "tailwind.config.js",
  "eslint.config.mjs",
];

const RULES = [
  {
    name: "hidden-whitespace-padding",
    // The signature of this incident: code pushed off-screen behind padding.
    test: (src) => / {80,}\S/.test(src),
    why: "long run of spaces followed by code — used to hide payloads off-screen",
  },
  {
    name: "excessively-long-line",
    test: (src) => src.split("\n").some((l) => l.length > 500),
    why: "a line over 500 chars in a config file usually means minified/injected code",
  },
  {
    name: "dynamic-code-execution",
    test: (src) =>
      /\beval\s*\(/.test(src) ||
      /\bnew\s+Function\s*\(/.test(src) ||
      /\[["']constructor["']\]\s*\(/.test(src),
    why: "config files should never build or evaluate code at runtime",
  },
  {
    name: "process-spawning",
    test: (src) => /child_process|\bspawn\s*\(|\bexecSync\s*\(/.test(src),
    why: "config files should never launch OS processes",
  },
  {
    name: "createRequire-in-config",
    test: (src) => /createRequire/.test(src),
    why: "used by the 2026 payload to obtain require() inside an ES module",
  },
  {
    name: "obfuscation-markers",
    test: (src) => /_0x[0-9a-f]{4,}|global\s*\[\s*['"]!['"]\s*\]/.test(src),
    why: "hex-mangled identifiers typical of obfuscated payloads",
  },
  {
    name: "network-access",
    test: (src) =>
      /trongrid|aptoslabs|bsc-dataseed|bsc-rpc|\bfetch\s*\(|https?:\/\/[^\s"')]+/.test(
        src,
      ),
    why: "config files should not contact the network",
  },
];

let failed = false;

for (const file of WATCHED) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;

  const src = readFileSync(path, "utf8");
  const hits = RULES.filter((rule) => rule.test(src));

  if (hits.length > 0) {
    failed = true;
    console.error(`\n  ✗ ${file}`);
    for (const hit of hits) {
      console.error(`      [${hit.name}] ${hit.why}`);
    }
  }
}

if (failed) {
  console.error(
    "\n  Build-config integrity check FAILED.\n" +
      "  Do not run or deploy this build. Inspect the files above — check for\n" +
      "  content hidden far to the right on a single line.\n",
  );
  process.exit(1);
}

console.log("  ✓ build config integrity check passed");
