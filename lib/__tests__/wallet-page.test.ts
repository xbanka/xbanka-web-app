import { describe, expect, it } from "vitest";
import { MIN_FUND_AMOUNT, QUICK_AMOUNTS } from "../wallet-page";

describe("Add Fund amounts", () => {
  it("has a ₦1,000 minimum", () => {
    expect(MIN_FUND_AMOUNT).toBe(1_000);
  });

  it("offers the ₦1,000 minimum as the first quick amount, then the larger ones", () => {
    expect(QUICK_AMOUNTS).toEqual([1_000, 5_000, 10_000, 50_000, 100_000, 150_000]);
  });

  it("never offers a quick amount below the minimum", () => {
    for (const amount of QUICK_AMOUNTS) {
      expect(amount).toBeGreaterThanOrEqual(MIN_FUND_AMOUNT);
    }
  });

  it("keeps quick amounts ascending and unique", () => {
    const sorted = [...new Set(QUICK_AMOUNTS)].sort((a, b) => a - b);
    expect(QUICK_AMOUNTS).toEqual(sorted);
  });
});
