import { describe, expect, it } from "vitest";
import {
  cryptoSendBlocker,
  isTierRequiredError,
  kycPromptCopy,
  sendBlocker,
  userBlocker,
} from "../kycGate";
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

describe("sendBlocker (spec 7.3: every Send needs Tier 2)", () => {
  const tierOne = profile;
  const tierZero = { ...profile, kycStatus: { bvnVerified: false } };
  const noId = { completedOnboardingSteps: [] };
  const tierTwo = { completedOnboardingSteps: ["IDENTITY", "SELFIE"] };

  it.each(["fiat", "crypto"] as const)("%s: Tier 1 is asked for ID (the reported case)", (action) => {
    expect(sendBlocker(action, tierOne, noId)).toBe("id-selfie");
    expect(sendBlocker(action, tierOne, tierTwo)).toBeNull();
  });

  it.each(["fiat", "crypto"] as const)("%s: Tier 0 is asked for BVN first", (action) => {
    expect(sendBlocker(action, tierZero, noId)).toBe("bvn");
    expect(sendBlocker(action, tierZero, tierTwo)).toBe("bvn");
  });
});

describe("isTierRequiredError", () => {
  it.each([
    "Withdrawal blocked: TIER_REQUIRED",
    "Tier 2 required",
    "TIER_2_REQUIRED",
    "This action requires Tier 2 verification",
    "Requires KYC tier 2",
    "KYC tier not met",
  ])("matches %j", (message) => {
    expect(isTierRequiredError({ status: 403, message })).toBe(true);
  });

  it.each([
    "Insufficient balance",
    "Invalid transaction PIN",
    "Withdrawal blocked: LIMIT_EXCEEDED",
    "Withdrawal blocked: PIN_SETUP_REQUIRED",
    "Frontier Bank is unavailable",
    "",
  ])("ignores %j", (message) => {
    expect(isTierRequiredError({ status: 403, message })).toBe(false);
  });

  it("is false for non-errors", () => {
    expect(isTierRequiredError(null)).toBe(false);
    expect(isTierRequiredError({ message: 42 })).toBe(false);
  });
});

describe("kycPromptCopy", () => {
  it("matches the Figma wording for crypto ID", () => {
    expect(kycPromptCopy("id-selfie", "crypto")).toEqual({
      title: "Verify your identity to send crypto",
      body: "Sending crypto needs ID verification. It only takes 2 minutes.",
      cta: "Verify now",
    });
  });

  it("says BVN for the Tier 1 steps", () => {
    expect(kycPromptCopy("bvn", "fiat").title).toBe("Verify your BVN to send money");
    expect(kycPromptCopy("bvn", "crypto").title).toBe("Verify your BVN to send crypto");
  });

  it("asks for personal details when those are missing", () => {
    expect(kycPromptCopy("personal-info", "fiat")).toEqual({
      title: "Add your personal details to send money",
      body: "Sending money needs your personal details and BVN. It only takes 2 minutes.",
      cta: "Continue",
    });
    expect(kycPromptCopy("personal-info", "crypto").title).toBe(
      "Add your personal details to send crypto",
    );
  });
});
