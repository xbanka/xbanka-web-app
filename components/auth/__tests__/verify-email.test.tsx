// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import VerifyPage from "../verify-email";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/image", () => ({ default: () => null }));
vi.mock("@/lib/services/auth.service", () => ({
  useVerifyMail: () => ({
    data: { success: true, data: { data: { id: "user-1" } } },
    mutate: vi.fn(),
    isSuccess: true,
    isPending: false,
    isError: false,
    error: null,
  }),
}));

afterEach(cleanup);

describe("VerifyPage after successful verification", () => {
  it("Start KYC links to onboarding, which opens on BVN", () => {
    render(<VerifyPage token="abc" />);
    expect(screen.getByRole("link", { name: "Start KYC" }).getAttribute("href")).toBe("/onboarding");
  });

  // Verifying does not sign the user in, so postponing must go to login,
  // not a protected page.
  it("lets the user postpone KYC by going to sign-in", () => {
    render(<VerifyPage token="abc" />);
    expect(screen.getByRole("link", { name: "I’ll do this later" }).getAttribute("href")).toBe("/sign-in");
  });
});
