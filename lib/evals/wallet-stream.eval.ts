import { describe, expect, it } from "vitest";
import {
  BalanceEvent,
  createStaleGuard,
  patchWalletCache,
  toBalanceMap,
} from "@/lib/walletStream";

// Property eval: thousands of seeded random event histories, delivered in
// shuffled order with duplicates, against a model of what the user should
// see. The model is the guide's rule: every currency shows the balance of its
// newest changedAt; a snapshot replaces everything it lists.
//
// Pass threshold: every history. A single wrong balance on screen is a bug.

const CURRENCIES = ["NGN", "USDT", "BTC", "ETH", "USDC"];

// mulberry32: small seeded PRNG so a failure reproduces from its seed.
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const envelope = (wallets: { currency: string; balance: number }[]) => ({
  success: true,
  data: { data: wallets.map((w) => ({ ...w, type: "FIAT", fiatEquivalent: null })) },
});

const shown = (cache: ReturnType<typeof envelope>) =>
  Object.fromEntries(cache.data.data.map((w) => [w.currency, w.balance]));

describe("wallet stream: screen matches the newest balance per currency", () => {
  it("over 5,000 shuffled histories", () => {
    for (let seed = 1; seed <= 5_000; seed++) {
      const r = rng(seed);
      const pick = <T>(xs: T[]) => xs[Math.floor(r() * xs.length)];

      // Some wallets the user holds; the stream may also mention others.
      const held = CURRENCIES.filter(() => r() < 0.7);
      if (held.length === 0) held.push("NGN");
      let cache = envelope(held.map((currency) => ({ currency, balance: 0 })));
      const guard = createStaleGuard();

      // Snapshot first, as the server sends it.
      const snapshot = CURRENCIES.map((currency) => ({
        currency,
        type: "FIAT",
        balance: Math.round(r() * 1e6) / 100,
      }));
      guard.reset();
      cache = patchWalletCache(cache, toBalanceMap(snapshot));
      const expected: Record<string, { at: number; balance: number }> = {};
      for (const w of snapshot) expected[w.currency] = { at: -1, balance: w.balance };

      // Random changes, then delivered out of order with duplicates.
      const events: BalanceEvent[] = Array.from(
        { length: 1 + Math.floor(r() * 12) },
        (_, i) => ({
          currency: pick(CURRENCIES),
          type: "FIAT",
          balance: Math.round(r() * 1e6) / 100,
          previousBalance: null,
          changedAt: new Date(Date.UTC(2026, 10, 4, 14, 0, i)).toISOString(),
        }),
      );
      const delivered = [...events, ...events.filter(() => r() < 0.2)].sort(
        () => r() - 0.5,
      );

      for (const event of delivered) {
        if (guard.accept(event)) {
          cache = patchWalletCache(cache, toBalanceMap([event]));
        }
      }
      for (const e of events) {
        const at = Date.parse(e.changedAt);
        if (at > expected[e.currency].at) {
          expected[e.currency] = { at, balance: e.balance };
        }
      }

      const want = Object.fromEntries(
        held.map((currency) => [currency, expected[currency].balance]),
      );
      expect(shown(cache), `seed ${seed}`).toEqual(want);
    }
  });
});
