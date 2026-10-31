// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  hasSeenTour,
  markTourSeen,
  TOUR_VERSION,
  tourStorageKey,
} from "@/lib/productTour";

/** Runs `fn` with a localStorage whose every call throws (private mode, quota). */
const withBrokenStorage = (fn: () => void) => {
  const original = Object.getOwnPropertyDescriptor(window, "localStorage");
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() {
      return {
        getItem() {
          throw new Error("blocked");
        },
        setItem() {
          throw new Error("quota");
        },
      };
    },
  });
  try {
    fn();
  } finally {
    if (original) Object.defineProperty(window, "localStorage", original);
    else delete (window as { localStorage?: unknown }).localStorage;
  }
};

describe("product tour once-only flag", () => {
  beforeEach(() => window.localStorage.clear());

  it("is unseen for a user with no flag", () => {
    expect(hasSeenTour("u1")).toBe(false);
  });

  it("is seen once marked, and only for that user", () => {
    markTourSeen("u1");
    expect(hasSeenTour("u1")).toBe(true);
    expect(hasSeenTour("u2")).toBe(false);
  });

  it("keys the flag by tour version so a redesign can show it again", () => {
    expect(tourStorageKey("u1")).toBe(
      `xbanka:product-tour:v${TOUR_VERSION}:u1`,
    );
  });

  it("treats blocked storage as already seen rather than nagging every visit", () => {
    withBrokenStorage(() => {
      expect(hasSeenTour("u1")).toBe(true);
    });
  });

  it("does not throw when storage cannot be written", () => {
    withBrokenStorage(() => {
      expect(() => markTourSeen("u1")).not.toThrow();
    });
  });
});
