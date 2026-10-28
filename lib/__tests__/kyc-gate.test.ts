import { describe, expect, it } from "vitest";
import { cryptoSendBlocker, userBlocker } from "../kycGate";
import { isStepDone } from "../verificationProgress";

const profile = {
  firstName: "Ada",
  lastName: "Obi",
  dateOfBirth: "1990-01-01",
  gender: "female",
  phoneNumber: "08012345678",
  country: "NG",
  kycStatus: { bvnVerified: true },
};

describe("isStepDone", () => {
  it("reads completedOnboardingSteps", () => {
    expect(isStepDone({ completedOnboardingSteps: ["SELFIE"] }, "SELFIE")).toBe(true);
  });

  it("reads progress status in any accepted form", () => {
    for (const step of [
      { id: "SELFIE", isCompleted: true },
      { id: "SELFIE", completed: true },
      { id: "SELFIE", status: "COMPLETED" },
      { id: "SELFIE", status: "approved" },
    ]) {
      expect(isStepDone({ progress: [step] }, "SELFIE")).toBe(true);
    }
  });

  it("is false when neither list has the step", () => {
    expect(isStepDone({ progress: [{ id: "SELFIE", status: "PENDING" }] }, "SELFIE")).toBe(false);
    expect(isStepDone(undefined, "SELFIE")).toBe(false);
  });
});

describe("cryptoSendBlocker", () => {
  it("lets a fully verified user send (selfie recorded only in completedOnboardingSteps)", () => {
    // The tester's case: the guard used to read progress[].isCompleted only.
    const verification = {
      completedOnboardingSteps: ["IDENTITY", "SELFIE"],
      progress: [
        { id: "IDENTITY", status: "PENDING" },
        { id: "SELFIE", status: "PENDING" },
      ],
    };
    expect(cryptoSendBlocker(profile, verification)).toBeNull();
  });

  it("asks for ID and selfie when the selfie is missing", () => {
    expect(
      cryptoSendBlocker(profile, { completedOnboardingSteps: ["IDENTITY"] }),
    ).toBe("id-selfie");
  });

  it("asks for personal info first, then BVN", () => {
    expect(cryptoSendBlocker({ ...profile, firstName: "" }, undefined)).toBe("personal-info");
    expect(
      cryptoSendBlocker({ ...profile, kycStatus: { bvnVerified: false } }, undefined),
    ).toBe("bvn");
  });
});

describe("userBlocker", () => {
  it("does not require ID or selfie", () => {
    expect(userBlocker(profile)).toBeNull();
  });
});
