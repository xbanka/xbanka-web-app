import { describe, expect, it } from "vitest";
import {
  checkBalanceCap,
  checkDailyLimit,
  spentToday,
  startOfLagosDay,
} from "../transaction-limit";

// 2026-11-03 10:00 Lagos (09:00 UTC)
const NOW = new Date("2026-11-03T09:00:00Z");

const tx = (over: Partial<Parameters<typeof spentToday>[0][number]> = {}) => ({
  type: "WITHDRAWAL" as never,
  amount: 10_000,
  currency: "NGN",
  status: "COMPLETED" as never,
  createdAt: "2026-11-03T08:00:00Z",
  ...over,
});

describe("startOfLagosDay", () => {
  it("is 23:00 UTC the day before", () => {
    expect(startOfLagosDay(NOW).toISOString()).toBe("2026-11-02T23:00:00.000Z");
  });

  it("rolls over at Lagos midnight, not UTC midnight", () => {
    expect(startOfLagosDay(new Date("2026-11-02T23:30:00Z")).toISOString()).toBe(
      "2026-11-02T23:00:00.000Z",
    );
  });
});

describe("spentToday", () => {
  it("sums NGN outflows since Lagos midnight", () => {
    expect(spentToday([tx(), tx({ type: "BILL_PAYMENT" as never })], NOW)).toBe(20_000);
  });

  it("counts pending, skips failed, inflows, other currencies and yesterday", () => {
    expect(
      spentToday(
        [
          tx({ status: "PENDING" as never }),
          tx({ status: "FAILED" as never }),
          tx({ type: "DEPOSIT" as never }),
          tx({ currency: "USDT" }),
          tx({ createdAt: "2026-11-02T22:59:59Z" }),
        ],
        NOW,
      ),
    ).toBe(10_000);
  });
});

describe("checkDailyLimit", () => {
  it.each([
    [0, 150_000],
    [1, 500_000],
    [2, 2_000_000],
  ])("tier %i allows exactly its limit %i", (tier, limit) => {
    expect(checkDailyLimit({ tier, amount: limit, spent: 0 }).allowed).toBe(true);
    expect(checkDailyLimit({ tier, amount: limit + 1, spent: 0 }).allowed).toBe(false);
  });

  it("counts what was already spent today", () => {
    const r = checkDailyLimit({ tier: 0, amount: 60_000, spent: 100_000 });
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.remaining).toBe(50_000);
      expect(r.action).toBe("upgrade");
      expect(r.nextTier).toBe(1);
      expect(r.message).toContain("₦50,000 more today");
      expect(r.message).toContain("Upgrade to Tier 1");
    }
  });

  it("sends tier 2 to Support, never to a Tier 3 upgrade", () => {
    const r = checkDailyLimit({ tier: 2, amount: 1, spent: 2_000_000 });
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.action).toBe("support");
      expect(r.message).not.toContain("Tier 3");
      expect(r.message).toContain("Contact Support");
    }
  });
});

describe("checkBalanceCap", () => {
  it("blocks a deposit that takes a Tier 0 wallet above ₦150,000", () => {
    const r = checkBalanceCap({ tier: 0, amount: 60_000, balance: 100_000 });
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.message).toContain("add up to ₦50,000");
  });

  it("allows a deposit landing exactly on the cap", () => {
    expect(checkBalanceCap({ tier: 0, amount: 50_000, balance: 100_000 }).allowed).toBe(true);
  });

  it("reports a full wallet with no negative headroom", () => {
    const r = checkBalanceCap({ tier: 1, amount: 1_000, balance: 600_000 });
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.remaining).toBe(0);
  });
});
