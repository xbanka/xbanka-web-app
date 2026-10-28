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
  it("only offers Start KYC, linking to onboarding", () => {
    render(<VerifyPage token="abc" />);
    expect(screen.getByRole("link", { name: "Start KYC" }).getAttribute("href")).toBe("/onboarding");
  });

  it("does not let the user postpone KYC", () => {
    render(<VerifyPage token="abc" />);
    expect(screen.queryByText(/do this later/i)).toBeNull();
    expect(document.querySelector('a[href="/welcome"]')).toBeNull();
  });
});
