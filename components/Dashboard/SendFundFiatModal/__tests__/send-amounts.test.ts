import { describe, expect, it } from "vitest";
import { MIN_SEND_AMOUNT, QUICK_AMOUNTS } from "../mockData";

describe("Send Fiat amounts", () => {
  it("has a ₦500 minimum", () => {
    expect(MIN_SEND_AMOUNT).toBe(500);
  });

  it("offers ₦500, ₦1,000, ₦5,000, ₦10,000, ₦50,000 and ₦100,000", () => {
    expect(QUICK_AMOUNTS).toEqual([500, 1000, 5000, 10000, 50000, 100000]);
  });

  it("never offers a quick amount below the minimum", () => {
    for (const amount of QUICK_AMOUNTS) {
      expect(amount).toBeGreaterThanOrEqual(MIN_SEND_AMOUNT);
    }
  });

  it("keeps quick amounts ascending and unique", () => {
    expect(QUICK_AMOUNTS).toEqual([...new Set(QUICK_AMOUNTS)].sort((a, b) => a - b));
  });
});
