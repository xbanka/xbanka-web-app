// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import OnboardingForm from "../OnboardingForm";

vi.mock("../step-two", () => ({
  default: ({ setStep }: { setStep: (n: number) => void }) => (
    <button onClick={() => setStep(1)}>bvn-step</button>
  ),
}));
vi.mock("../step-three", () => ({ default: () => <p>id-step</p> }));
vi.mock("../step-four", () => ({ default: () => <p>selfie-step</p> }));

afterEach(cleanup);

describe("OnboardingForm", () => {
  it("starts at BVN because personal details come from sign-up", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("bvn-step")).toBeTruthy();
    expect(screen.getByText("BVN Verification")).toBeTruthy();
    expect(screen.getByText("1 of 3")).toBeTruthy();
    expect(screen.queryByText("Basic Information")).toBeNull();
  });

  it("moves from BVN to identity", () => {
    render(<OnboardingForm />);
    screen.getByText("bvn-step").click();
    return screen.findByText("id-step").then(() => {
      expect(screen.getByText("2 of 3")).toBeTruthy();
    });
  });
});
