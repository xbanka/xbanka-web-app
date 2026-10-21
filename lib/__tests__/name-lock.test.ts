import { describe, expect, it } from "vitest";
import { isBvnVerified } from "@/lib/nameLock";

const verified = { kycStatus: { bvnVerified: true } };
const unverified = { kycStatus: { bvnVerified: false } };

const statusWith = (bvnStatus: string) => ({
  completedOnboardingSteps: ["EMAIL_VERIFIED"],
  progress: [
    { id: "EMAIL_VERIFIED", status: "completed" },
    { id: "BVN", status: bvnStatus },
  ],
});

describe("isBvnVerified", () => {
  it("locks only when the flag and the BVN step agree", () => {
    expect(isBvnVerified(verified, statusWith("completed"))).toBe(true);
    expect(isBvnVerified(verified, statusWith("pending"))).toBe(false);
  });

  it("never locks without a true flag, whatever the step says", () => {
    expect(isBvnVerified(unverified, statusWith("completed"))).toBe(false);
    expect(isBvnVerified({ kycStatus: null }, statusWith("completed"))).toBe(
      false,
    );
    // A string "true" from a loose API is not a verified BVN.
    expect(
      isBvnVerified({ kycStatus: { bvnVerified: "true" } }, statusWith("completed")),
    ).toBe(false);
  });

  it("accepts the step from completedOnboardingSteps too", () => {
    expect(
      isBvnVerified(verified, {
        completedOnboardingSteps: ["BVN"],
        progress: [{ id: "BVN", status: "pending" }],
      }),
    ).toBe(true);
  });

  it("falls back to the flag until the verification status has loaded", () => {
    expect(isBvnVerified(verified, undefined)).toBe(true);
    expect(isBvnVerified(unverified, undefined)).toBe(false);
  });
});
