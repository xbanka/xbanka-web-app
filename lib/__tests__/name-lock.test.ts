import { describe, expect, it } from "vitest";
import {
  isBvnVerified,
  isIdentityVerified,
  isNameLocked,
} from "@/lib/nameLock";

const bvnDone = { kycStatus: { bvnVerified: true, idStatus: "NONE" } };
const nothingDone = { kycStatus: { bvnVerified: false, idStatus: "NONE" } };

const statusWith = (steps: Record<string, string>) => ({
  completedOnboardingSteps: ["EMAIL_VERIFIED"],
  progress: Object.entries(steps).map(([id, status]) => ({ id, status })),
});

describe("isBvnVerified", () => {
  it("locks only when the flag and the BVN step agree", () => {
    expect(isBvnVerified(bvnDone, statusWith({ BVN: "completed" }))).toBe(true);
    expect(isBvnVerified(bvnDone, statusWith({ BVN: "pending" }))).toBe(false);
  });

  it("never locks without a true flag, whatever the step says", () => {
    expect(isBvnVerified(nothingDone, statusWith({ BVN: "completed" }))).toBe(
      false,
    );
    expect(
      isBvnVerified(
        { kycStatus: { bvnVerified: "true" } },
        statusWith({ BVN: "completed" }),
      ),
    ).toBe(false);
  });

  it("falls back to the flag until the verification status has loaded", () => {
    expect(isBvnVerified(bvnDone, undefined)).toBe(true);
    expect(isBvnVerified(nothingDone, undefined)).toBe(false);
  });
});

describe("isIdentityVerified", () => {
  it("counts an approved ID document", () => {
    const approved = { kycStatus: { bvnVerified: false, idStatus: "APPROVED" } };
    expect(
      isIdentityVerified(approved, statusWith({ IDENTITY: "completed" })),
    ).toBe(true);
  });

  it("ignores a document still under review or never submitted", () => {
    const pending = { kycStatus: { bvnVerified: false, idStatus: "PENDING" } };
    expect(
      isIdentityVerified(pending, statusWith({ IDENTITY: "completed" })),
    ).toBe(false);
    expect(
      isIdentityVerified(nothingDone, statusWith({ IDENTITY: "pending" })),
    ).toBe(false);
    expect(isIdentityVerified(nothingDone, undefined)).toBe(false);
  });

  it("trusts the step when the profile carries no idStatus", () => {
    expect(
      isIdentityVerified({ kycStatus: { bvnVerified: false } }, {
        completedOnboardingSteps: ["IDENTITY"],
      }),
    ).toBe(true);
  });
});

describe("isNameLocked", () => {
  const fullKyc = { kycStatus: { bvnVerified: true, idStatus: "VERIFIED" } };

  it("locks only once both BVN and ID are verified", () => {
    expect(
      isNameLocked(fullKyc, statusWith({ BVN: "completed", IDENTITY: "completed" })),
    ).toBe(true);
  });

  it("stays unlocked with only one of them done", () => {
    expect(
      isNameLocked(bvnDone, statusWith({ BVN: "completed", IDENTITY: "pending" })),
    ).toBe(false);
    expect(
      isNameLocked(
        { kycStatus: { bvnVerified: false, idStatus: "VERIFIED" } },
        statusWith({ BVN: "pending", IDENTITY: "completed" }),
      ),
    ).toBe(false);
  });

  it("stays unlocked while neither is done", () => {
    expect(
      isNameLocked(nothingDone, statusWith({ BVN: "pending", IDENTITY: "pending" })),
    ).toBe(false);
    expect(isNameLocked(nothingDone, undefined)).toBe(false);
  });
});
