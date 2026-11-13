import { describe, expect, it } from "vitest";
import { PULL_MAX, PULL_THRESHOLD, pullDistance } from "@/components/pwa/PullToRefresh";

describe("pullDistance", () => {
  it("moves at half the finger's speed", () => {
    expect(pullDistance(40)).toBe(20);
  });

  it("needs a deliberate pull to reach the reload threshold", () => {
    expect(pullDistance(PULL_THRESHOLD)).toBeLessThan(PULL_THRESHOLD);
    expect(pullDistance(PULL_THRESHOLD * 2)).toBe(PULL_THRESHOLD);
  });

  it("stops at the maximum and ignores upward moves", () => {
    expect(pullDistance(1000)).toBe(PULL_MAX);
    expect(pullDistance(-50)).toBe(0);
  });
});
