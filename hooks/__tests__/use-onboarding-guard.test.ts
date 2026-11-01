// @vitest-environment happy-dom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const openIdSelfie = vi.fn();
vi.mock("@/store/onboarding-modal-store", () => ({
  useOnboardingModalStore: (sel: (s: object) => unknown) =>
    sel({ openPersonalInfo: vi.fn(), openBvn: vi.fn(), openIdSelfie }),
}));

const profile = {
  firstName: "Ada",
  lastName: "Obi",
  dateOfBirth: "1990-01-01",
  gender: "female",
  phoneNumber: "08012345678",
  country: "NG",
  kycStatus: { bvnVerified: true },
};
const NOT_DONE = { data: { progress: [{ id: "SELFIE", status: "PENDING" }] } };
const DONE = { data: { completedOnboardingSteps: ["IDENTITY", "SELFIE"] } };

let cachedVerification: unknown;
let freshVerification: unknown;
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({
    data: { data: profile },
    refetch: async () => ({ data: { data: profile } }),
  }),
  UseVerificationStatus: () => ({
    data: cachedVerification,
    refetch: async () => ({ data: freshVerification }),
  }),
}));

import { useOnboardingGuard } from "../use-onboarding-guard";

beforeEach(() => openIdSelfie.mockReset());

describe("useOnboardingGuard.validateCryptoSend", () => {
  it("uses the fresh status: a selfie done on another device does not reopen liveness", async () => {
    cachedVerification = NOT_DONE;
    freshVerification = DONE;
    const { result } = renderHook(() => useOnboardingGuard());

    await expect(result.current.validateCryptoSend()).resolves.toBe(true);
    expect(openIdSelfie).not.toHaveBeenCalled();
  });

  it("opens the ID/selfie modal when the selfie really is missing", async () => {
    cachedVerification = NOT_DONE;
    freshVerification = NOT_DONE;
    const { result } = renderHook(() => useOnboardingGuard());

    await expect(result.current.validateCryptoSend()).resolves.toBe(false);
    expect(openIdSelfie).toHaveBeenCalledTimes(1);
  });

  it("falls back to the cached status when the refetch returns nothing", async () => {
    cachedVerification = DONE;
    freshVerification = undefined;
    const { result } = renderHook(() => useOnboardingGuard());

    await expect(result.current.validateCryptoSend()).resolves.toBe(true);
  });
});
