// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  hasSeenTour,
  markTourSeen,
  TOUR_VERSION,
  tourStorageKey,
} from "@/lib/productTour";
import { tourForPath, TOURS } from "@/lib/tours";

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
    expect(hasSeenTour("u1", "dashboard")).toBe(false);
  });

  it("is seen once marked, and only for that user and tour", () => {
    markTourSeen("u1", "dashboard");
    expect(hasSeenTour("u1", "dashboard")).toBe(true);
    expect(hasSeenTour("u1", "wallet")).toBe(false);
    expect(hasSeenTour("u2", "dashboard")).toBe(false);
  });

  it("keys the flag by tour version so a redesign can show it again", () => {
    expect(tourStorageKey("u1", "wallet")).toBe(
      `xbanka:product-tour:v${TOUR_VERSION}:u1:wallet`,
    );
  });

  it("treats blocked storage as already seen rather than nagging every visit", () => {
    withBrokenStorage(() => {
      expect(hasSeenTour("u1", "dashboard")).toBe(true);
    });
  });

  it("does not throw when storage cannot be written", () => {
    withBrokenStorage(() => {
      expect(() => markTourSeen("u1", "dashboard")).not.toThrow();
    });
  });
});

describe("tourForPath", () => {
  it("maps each main section to its tour, ignoring a trailing slash", () => {
    expect(tourForPath("/")?.id).toBe("dashboard");
    expect(tourForPath("/wallet")?.id).toBe("wallet");
    expect(tourForPath("/wallet/")?.id).toBe("wallet");
    expect(tourForPath("/crypto")?.id).toBe("crypto");
    expect(tourForPath("/bill-payment")?.id).toBe("bills");
    expect(tourForPath("/account")?.id).toBe("account");
    expect(tourForPath("/market")?.id).toBe("market");
  });

  it("has no tour for sections without one", () => {
    expect(tourForPath("/gift-cards")).toBeUndefined();
    expect(tourForPath("/wallet/fund-callback")).toBeUndefined();
  });

  it("gives every tour at least two stops with a title and a target", () => {
    for (const tour of Object.values(TOURS)) {
      for (const desktop of [true, false]) {
        const steps = tour.steps({ desktop });
        expect(steps.length).toBeGreaterThanOrEqual(2);
        for (const step of steps) {
          expect(typeof step.element).toBe("string");
          expect(step.popover?.title).toBeTruthy();
          expect(step.popover?.description).toBeTruthy();
        }
      }
    }
  });
});
