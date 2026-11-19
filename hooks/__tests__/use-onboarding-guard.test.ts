// @vitest-environment happy-dom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const store = vi.hoisted(() => ({
  openPersonalInfo: vi.fn(),
  openBvn: vi.fn(),
  openIdSelfie: vi.fn(),
  openKycPrompt: vi.fn(),
}));
vi.mock("@/store/onboarding-modal-store", () => ({
  useOnboardingModalStore: (sel: (s: object) => unknown) => sel(store),
}));

const TIER_ONE = {
  firstName: "Ada",
  lastName: "Obi",
  dateOfBirth: "1990-01-01",
  gender: "female",
  phoneNumber: "08012345678",
  country: "NG",
  kycStatus: { bvnVerified: true },
};
const NO_BVN = { ...TIER_ONE, kycStatus: { bvnVerified: false } };
const NO_DETAILS = { ...NO_BVN, firstName: "" };
const NOT_DONE = { data: { progress: [{ id: "SELFIE", status: "PENDING" }] } };
const DONE = { data: { completedOnboardingSteps: ["IDENTITY", "SELFIE"] } };

let cachedProfile: unknown;
let freshProfile: unknown;
let cachedVerification: unknown;
let freshVerification: unknown;
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({
    data: { data: cachedProfile },
    refetch: async () => ({ data: freshProfile === undefined ? undefined : { data: freshProfile } }),
  }),
  UseVerificationStatus: () => ({
    data: cachedVerification,
    refetch: async () => ({ data: freshVerification }),
  }),
}));

import { useOnboardingGuard } from "../use-onboarding-guard";

const as = (profile: unknown, verification: unknown) => {
  cachedProfile = freshProfile = profile;
  cachedVerification = freshVerification = verification;
  return renderHook(() => useOnboardingGuard()).result.current;
};

beforeEach(() => {
  for (const fn of Object.values(store)) fn.mockReset();
});

describe("useOnboardingGuard.validateCryptoSend", () => {
  it("uses the fresh status: a selfie done on another device does not reopen liveness", async () => {
    cachedProfile = freshProfile = TIER_ONE;
    cachedVerification = NOT_DONE;
    freshVerification = DONE;
    const { result } = renderHook(() => useOnboardingGuard());

    await expect(result.current.validateCryptoSend()).resolves.toBe(true);
    expect(store.openKycPrompt).not.toHaveBeenCalled();
    expect(store.openIdSelfie).not.toHaveBeenCalled();
  });

  it("opens the verify-identity prompt (not the ID form) when the selfie really is missing", async () => {
    const guard = as(TIER_ONE, NOT_DONE);
    await expect(guard.validateCryptoSend()).resolves.toBe(false);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "id-selfie", action: "crypto" });
    expect(store.openIdSelfie).not.toHaveBeenCalled();
  });

  it("below Tier 1: opens the verify-BVN prompt (not the BVN form)", async () => {
    const guard = as(NO_BVN, NOT_DONE);
    await expect(guard.validateCryptoSend()).resolves.toBe(false);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "bvn", action: "crypto" });
    expect(store.openBvn).not.toHaveBeenCalled();
  });

  it("falls back to the cached status when the refetch returns nothing", async () => {
    cachedProfile = TIER_ONE;
    freshProfile = undefined;
    cachedVerification = DONE;
    freshVerification = undefined;
    const { result } = renderHook(() => useOnboardingGuard());

    await expect(result.current.validateCryptoSend()).resolves.toBe(true);
  });
});

describe("useOnboardingGuard.validateSend (fiat Send button, Tier 2 per spec 7.3)", () => {
  it("Tier 1 taps Send: verify-identity prompt (the reported case)", async () => {
    const guard = as(TIER_ONE, NOT_DONE);
    await expect(guard.validateSend("fiat")).resolves.toBe(false);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "id-selfie", action: "fiat" });
    expect(store.openIdSelfie).not.toHaveBeenCalled();
  });

  it("Tier 0 taps Send: verify-BVN prompt, never ID first (spec 6.1)", async () => {
    const guard = as(NO_BVN, NOT_DONE);
    await expect(guard.validateSend("fiat")).resolves.toBe(false);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "bvn", action: "fiat" });
    expect(store.openBvn).not.toHaveBeenCalled();
  });

  it("Tier 0 with ID already on file still gets the BVN prompt", async () => {
    const guard = as(NO_BVN, DONE);
    await guard.validateSend("fiat");
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "bvn", action: "fiat" });
  });

  it("personal details missing: prompt carries personal-info so Verify now opens that form", async () => {
    const guard = as(NO_DETAILS, NOT_DONE);
    await guard.validateSend("fiat");
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "personal-info", action: "fiat" });
  });

  it("Tier 2: allowed, no prompt", async () => {
    const guard = as(TIER_ONE, DONE);
    await expect(guard.validateSend("fiat")).resolves.toBe(true);
    expect(store.openKycPrompt).not.toHaveBeenCalled();
  });

  it("uses the fresh status: ID + selfie done on another device lets them through", async () => {
    cachedProfile = freshProfile = TIER_ONE;
    cachedVerification = NOT_DONE;
    freshVerification = DONE;
    const { result } = renderHook(() => useOnboardingGuard());
    await expect(result.current.validateSend("fiat")).resolves.toBe(true);
    expect(store.openKycPrompt).not.toHaveBeenCalled();
  });
});

describe("useOnboardingGuard.promptForTierError (backend said tier required)", () => {
  it("Tier 1: verify-identity prompt", async () => {
    const guard = as(TIER_ONE, NOT_DONE);
    await expect(guard.promptForTierError("fiat")).resolves.toBe(true);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "id-selfie", action: "fiat" });
  });

  it("Tier 0: verify-BVN prompt", async () => {
    const guard = as(NO_BVN, NOT_DONE);
    await expect(guard.promptForTierError("fiat")).resolves.toBe(true);
    expect(store.openKycPrompt).toHaveBeenCalledWith({ blocker: "bvn", action: "fiat" });
  });

  it("already Tier 2 on our side: no prompt, caller shows the backend message", async () => {
    const guard = as(TIER_ONE, DONE);
    await expect(guard.promptForTierError("fiat")).resolves.toBe(false);
    expect(store.openKycPrompt).not.toHaveBeenCalled();
  });
});

describe("useOnboardingGuard.validateUser (buy, sell, convert)", () => {
  it("still opens the BVN form directly, no prompt", () => {
    const guard = as(NO_BVN, NOT_DONE);
    expect(guard.validateUser()).toBe(false);
    expect(store.openBvn).toHaveBeenCalledTimes(1);
    expect(store.openKycPrompt).not.toHaveBeenCalled();
  });
});
