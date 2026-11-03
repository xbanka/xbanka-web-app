import { describe, expect, it } from "vitest";
import { checkBalanceCap, checkDailyLimit } from "../transaction-limit";

// Spec: XBanka KYC & Transaction Access Architecture v4.0, section 9.
const SPEC = [
  { tier: 0, limit: 150_000, onBreach: "upgrade" },
  { tier: 1, limit: 500_000, onBreach: "upgrade" },
  { tier: 2, limit: 2_000_000, onBreach: "support" },
] as const;

// Every amount near each boundary plus a coarse grid, against every spend level.
const amounts = (limit: number) => [
  ...[-1000, -1, 0, 1, 1000].map((d) => limit + d),
  ...Array.from({ length: 41 }, (_, i) => Math.round((limit * i) / 20)),
];

describe("tier limit guard matches the v4.0 spec across the boundary grid", () => {
  for (const { tier, limit, onBreach } of SPEC) {
    it(`tier ${tier}: daily limit and balance cap`, () => {
      let cases = 0;
      for (const base of amounts(limit).filter((n) => n >= 0)) {
        for (const amount of amounts(limit).filter((n) => n > 0)) {
          const expected = base + amount <= limit;
          for (const r of [
            checkDailyLimit({ tier, amount, spent: base }),
            checkBalanceCap({ tier, amount, balance: base }),
          ]) {
            cases++;
            expect(r.allowed).toBe(expected);
            expect(r.limit).toBe(limit);
            if (!r.allowed) {
              expect(r.action).toBe(onBreach);
              expect(r.remaining).toBe(Math.max(0, limit - base));
              if (onBreach === "support") expect(r.message).not.toMatch(/Tier 3/);
            }
          }
        }
      }
      expect(cases).toBeGreaterThan(4000);
    });
  }
});
