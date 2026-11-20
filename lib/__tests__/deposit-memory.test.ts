// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  readWatchedDeposits,
  recallDepositSource,
  rememberDepositSource,
  SOURCE_KEY,
  watchDeposit,
  WATCH_KEY,
  writeWatchedDeposits,
} from "../deposit-memory";
import { MAX_WATCHED } from "../bank-deposit";

afterEach(() => window.localStorage.clear());

describe("deposit source memory", () => {
  it("remembers which account paid for a deposit", () => {
    rememberDepositSource("dep-1", "fa-gt");
    expect(recallDepositSource("dep-1")).toBe("fa-gt");
    expect(recallDepositSource("dep-2")).toBeNull();
    expect(recallDepositSource(null)).toBeNull();
  });

  it("keeps only the newest 50", () => {
    for (let i = 0; i < 60; i++) rememberDepositSource(`dep-${i}`, `fa-${i}`);
    expect(recallDepositSource("dep-0")).toBeNull();
    expect(recallDepositSource("dep-59")).toBe("fa-59");
    expect(Object.keys(JSON.parse(window.localStorage.getItem(SOURCE_KEY)!))).toHaveLength(50);
  });

  it("survives corrupt storage", () => {
    window.localStorage.setItem(SOURCE_KEY, "{not json");
    expect(recallDepositSource("dep-1")).toBeNull();
    rememberDepositSource("dep-1", "fa-gt");
    expect(recallDepositSource("dep-1")).toBe("fa-gt");
  });

  it("does nothing, and does not throw, when storage is blocked", () => {
    const real = Object.getOwnPropertyDescriptor(window, "localStorage")!;
    const blocked = {
      getItem: vi.fn(() => {
        throw new Error("SecurityError");
      }),
      setItem: vi.fn(() => {
        throw new Error("QuotaExceeded");
      }),
    };
    Object.defineProperty(window, "localStorage", { configurable: true, get: () => blocked });
    try {
      expect(() => rememberDepositSource("dep-1", "fa")).not.toThrow();
      expect(() => watchDeposit("dep-1")).not.toThrow();
      expect(recallDepositSource("dep-1")).toBeNull();
      expect(readWatchedDeposits()).toEqual([]);
      expect(blocked.setItem).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "localStorage", real);
    }
  });
});

describe("watched deposits", () => {
  it("adds newest first without duplicates", () => {
    watchDeposit("a");
    watchDeposit("b");
    watchDeposit("a");
    expect(readWatchedDeposits()).toEqual(["a", "b"]);
  });

  it("caps the list", () => {
    writeWatchedDeposits(Array.from({ length: 40 }, (_, i) => `d${i}`));
    expect(readWatchedDeposits()).toHaveLength(MAX_WATCHED);
  });

  it("ignores anything that is not a list of ids", () => {
    window.localStorage.setItem(WATCH_KEY, JSON.stringify({ a: 1 }));
    expect(readWatchedDeposits()).toEqual([]);
    window.localStorage.setItem(WATCH_KEY, JSON.stringify(["ok", 3, null]));
    expect(readWatchedDeposits()).toEqual(["ok"]);
  });
});
