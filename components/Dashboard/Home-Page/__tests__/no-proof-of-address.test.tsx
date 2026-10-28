// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ONBOARDING_STEP_COUNT, ONBOARDING_STEPS } from "@/lib/verificationProgress";

// The backend still reports ADDRESS; the UI must not show it.
const status = {
  data: {
    emailVerified: true,
    completedOnboardingSteps: ["EMAIL_VERIFIED"],
    progress: [
      { id: "EMAIL_VERIFIED", status: "COMPLETED" },
      { id: "BVN", status: "PENDING" },
      { id: "IDENTITY", status: "PENDING" },
      { id: "SELFIE", status: "PENDING" },
      { id: "ADDRESS", status: "PENDING" },
    ],
  },
};

vi.mock("@/lib/services/profile.service", () => ({
  UseVerificationStatus: () => ({ data: status, isPending: false, error: null }),
}));
vi.mock("../../Onboarding-Journey-Modal/bvn-modal", () => ({ BvnModal: () => null }));
vi.mock("../../Onboarding-Journey-Modal/id-selfie-modal", () => ({ IdSelfieModal: () => null }));

import { OnboardingJourney } from "../onboarding-journey";
import { IdentityVerificationTab } from "../../Account-Page/identity-verification-tab";

afterEach(cleanup);

describe("Proof of Address is hidden", () => {
  it("ONBOARDING_STEPS has three steps and no ADDRESS", () => {
    const steps = ONBOARDING_STEPS(status.data);
    expect(ONBOARDING_STEP_COUNT).toBe(3);
    expect(steps.map((s) => s.step)).toEqual(["STEP 1", "STEP 2", "STEP 3"]);
    expect(steps.map((s) => s.title)).not.toContain("Proof of Address");
  });

  it.each([
    ["home journey", OnboardingJourney],
    ["account verification tab", IdentityVerificationTab],
  ])("the %s shows no step 4 or address step", (_, Component) => {
    render(<Component />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/proof of address/i);
    expect(text).not.toMatch(/STEP 4/);
    expect(text).not.toMatch(/all 4 tiers/);
    expect(screen.getByText("STEP 3")).toBeTruthy();
  });
});
