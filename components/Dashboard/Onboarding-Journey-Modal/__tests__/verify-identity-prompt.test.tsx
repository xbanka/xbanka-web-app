// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../id-selfie-modal", () => ({
  IdSelfieModal: () => <div>Select your preferred ID</div>,
}));
vi.mock("../bvn-modal", () => ({ BvnModal: () => null }));
vi.mock("../../PersonalInfoModal/personal-info-modal", () => ({
  PersonalInfoModal: () => null,
}));

import { OnboardingModalProvider } from "../../PersonalInfoModal/onboarding-modal-provider";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";

const open = () => act(() => useOnboardingModalStore.getState().openIdSelfiePrompt());

beforeEach(() => useOnboardingModalStore.setState({ activeModal: null }));
afterEach(cleanup);

describe("crypto send: verify identity prompt", () => {
  it("shows the Figma prompt before the ID/selfie flow", () => {
    render(<OnboardingModalProvider />);
    open();
    expect(screen.getByText("Verify your identity to send crypto")).toBeTruthy();
    expect(screen.queryByText("Select your preferred ID")).toBeNull();
  });

  it("Verify now opens the ID/selfie modal", () => {
    render(<OnboardingModalProvider />);
    open();
    fireEvent.click(screen.getByText("Verify now"));
    expect(useOnboardingModalStore.getState().activeModal).toBe("id-selfie");
    expect(screen.getByText("Select your preferred ID")).toBeTruthy();
  });

  it("Later dismisses with nothing else opened", () => {
    render(<OnboardingModalProvider />);
    open();
    fireEvent.click(screen.getByText("Later"));
    expect(useOnboardingModalStore.getState().activeModal).toBeNull();
    expect(screen.queryByText("Select your preferred ID")).toBeNull();
  });
});
