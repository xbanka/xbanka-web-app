import { afterEach, describe, expect, it, vi } from "vitest";
import { chimeFor, createChimeQueue } from "@/lib/transaction-sounds";

const change = (previousBalance: number | null, balance: number) => ({
  previousBalance,
  balance,
});

describe("chimeFor", () => {
  it("plays money in when a balance goes up", () => {
    expect(chimeFor([change(1000, 6000)])).toBe("in");
  });

  it("plays money out when a balance goes down", () => {
    expect(chimeFor([change(6000, 1000)])).toBe("out");
  });

  it("plays one money-in chime for a conversion (one wallet down, another up)", () => {
    expect(chimeFor([change(50_000, 0), change(0, 30)])).toBe("in");
  });

  it("stays quiet when nothing moved or the old balance is unknown", () => {
    expect(chimeFor([change(500, 500)])).toBeNull();
    expect(chimeFor([change(null, 500)])).toBeNull();
    expect(chimeFor([])).toBeNull();
  });
});

describe("createChimeQueue", () => {
  afterEach(() => vi.useRealTimers());

  it("plays once for a burst of events", () => {
    vi.useFakeTimers();
    const play = vi.fn();
    const queue = createChimeQueue({ play, isEnabled: () => true, delayMs: 600 });
    queue.add(change(100, 0));
    vi.advanceTimersByTime(300);
    queue.add(change(0, 5));
    vi.advanceTimersByTime(600);
    expect(play).toHaveBeenCalledTimes(1);
    expect(play).toHaveBeenCalledWith("in");
  });

  it("plays separately for transactions further apart", () => {
    vi.useFakeTimers();
    const play = vi.fn();
    const queue = createChimeQueue({ play, isEnabled: () => true, delayMs: 600 });
    queue.add(change(0, 100));
    vi.advanceTimersByTime(700);
    queue.add(change(100, 40));
    vi.advanceTimersByTime(700);
    expect(play.mock.calls).toEqual([["in"], ["out"]]);
  });

  it("respects the setting at the moment it would play", () => {
    vi.useFakeTimers();
    const play = vi.fn();
    let enabled = true;
    const queue = createChimeQueue({ play, isEnabled: () => enabled, delayMs: 600 });
    queue.add(change(0, 100));
    enabled = false;
    vi.advanceTimersByTime(700);
    expect(play).not.toHaveBeenCalled();
  });

  it("drops pending events when disposed", () => {
    vi.useFakeTimers();
    const play = vi.fn();
    const queue = createChimeQueue({ play, isEnabled: () => true, delayMs: 600 });
    queue.add(change(0, 100));
    queue.dispose();
    vi.advanceTimersByTime(700);
    expect(play).not.toHaveBeenCalled();
  });
});
