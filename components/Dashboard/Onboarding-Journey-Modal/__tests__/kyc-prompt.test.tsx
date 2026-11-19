// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../id-selfie-modal", () => ({
  IdSelfieModal: () => <div>Select your preferred ID</div>,
}));
vi.mock("../bvn-modal", () => ({ BvnModal: () => <div>Enter your BVN</div> }));
vi.mock("../../PersonalInfoModal/personal-info-modal", () => ({
  PersonalInfoModal: () => <div>Personal information</div>,
}));

import { OnboardingModalProvider } from "../../PersonalInfoModal/onboarding-modal-provider";
import {
  KycPromptState,
  useOnboardingModalStore,
} from "@/store/onboarding-modal-store";

const open = (prompt: KycPromptState) =>
  act(() => useOnboardingModalStore.getState().openKycPrompt(prompt));

beforeEach(() =>
  useOnboardingModalStore.setState({ activeModal: null, prompt: null }),
);
afterEach(cleanup);

describe("crypto send: verify identity prompt", () => {
  it("shows the Figma prompt before the ID/selfie flow", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "id-selfie", action: "crypto" });
    expect(screen.getByText("Verify your identity to send crypto")).toBeTruthy();
    expect(
      screen.getByText("Sending crypto needs ID verification. It only takes 2 minutes."),
    ).toBeTruthy();
    expect(screen.queryByText("Select your preferred ID")).toBeNull();
  });

  it("Verify now opens the ID/selfie modal", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "id-selfie", action: "crypto" });
    fireEvent.click(screen.getByText("Verify now"));
    expect(useOnboardingModalStore.getState().activeModal).toBe("id-selfie");
    expect(screen.getByText("Select your preferred ID")).toBeTruthy();
  });

  it("Later dismisses with nothing else opened", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "id-selfie", action: "crypto" });
    fireEvent.click(screen.getByText("Later"));
    expect(useOnboardingModalStore.getState().activeModal).toBeNull();
    expect(useOnboardingModalStore.getState().prompt).toBeNull();
    expect(screen.queryByText("Select your preferred ID")).toBeNull();
  });
});

describe("send money below Tier 1: verify BVN prompt", () => {
  it("shows 'Verify your BVN to send money' and Verify now starts BVN", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "bvn", action: "fiat" });
    expect(screen.getByText("Verify your BVN to send money")).toBeTruthy();
    expect(screen.queryByText("Enter your BVN")).toBeNull();
    fireEvent.click(screen.getByText("Verify now"));
    expect(useOnboardingModalStore.getState().activeModal).toBe("bvn");
    expect(screen.getByText("Enter your BVN")).toBeTruthy();
  });

  it("crypto send below Tier 1 asks for BVN, not ID", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "bvn", action: "crypto" });
    expect(screen.getByText("Verify your BVN to send crypto")).toBeTruthy();
    fireEvent.click(screen.getByText("Verify now"));
    expect(screen.getByText("Enter your BVN")).toBeTruthy();
  });

  it("personal details missing: asks for them, Continue opens personal info", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "personal-info", action: "fiat" });
    expect(screen.getByText("Add your personal details to send money")).toBeTruthy();
    expect(screen.queryByText("Verify your BVN to send money")).toBeNull();
    expect(screen.queryByText("Verify now")).toBeNull();
    fireEvent.click(screen.getByText("Continue"));
    expect(screen.getByText("Personal information")).toBeTruthy();
  });
});

describe("send money at Tier 1: verify identity prompt", () => {
  it("shows 'Verify your identity to send money' and Verify now opens ID/selfie", () => {
    render(<OnboardingModalProvider />);
    open({ blocker: "id-selfie", action: "fiat" });
    expect(screen.getByText("Verify your identity to send money")).toBeTruthy();
    expect(
      screen.getByText("Sending money needs ID verification. It only takes 2 minutes."),
    ).toBeTruthy();
    fireEvent.click(screen.getByText("Verify now"));
    expect(screen.getByText("Select your preferred ID")).toBeTruthy();
  });
});
