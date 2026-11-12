// @vitest-environment happy-dom
// Regression: the Bank Transfer details step ("I have sent the money") grew
// taller than short viewports, pushing the CTA off-screen with no way to
// scroll to it. The card is now height-capped with a pinned header and a
// scrollable body.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BankTransferFlow } from "../bank-transfer-flow";

const fundingAccounts = Array.from({ length: 6 }, (_, i) => ({
  id: `fa-${i}`,
  bankName: "Access Bank",
  bankCode: "044",
  accountNumber: `012345678${i}`,
  accountName: "Ada Lovelace",
}));

vi.mock("@/lib/services/wallet.service", () => ({
  UseGetFundingAccounts: () => ({
    data: { data: { data: fundingAccounts } },
    isPending: false,
  }),
  UseGetXbankaFundingAccount: () => ({
    data: {
      data: {
        data: {
          bankName: "Providus Bank",
          accountNumber: "9900112233",
          accountName: "xBanka Collections",
        },
      },
    },
    isPending: false,
    error: null,
  }),
  UseDeclareBankTransferIntent: () => ({ mutate: vi.fn(), isPending: false }),
  UseAddFundingAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
  UseGetAllBanks: () => ({ data: undefined, isPending: false }),
  UseLookupAccountName: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: {} } }),
}));
vi.mock("@/hooks/use-transaction-limit", () => ({
  useTransactionLimit: () => ({ checkDeposit: () => ({ allowed: true }) }),
}));
vi.mock("@/components/ui/limit-notice", () => ({ LimitNotice: () => null }));
vi.mock("@/components/ui/bank-logo", () => ({ BankLogo: () => null }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

afterEach(cleanup);

const openDetailsStep = () => {
  render(<BankTransferFlow onClose={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("0.00"), {
    target: { value: "50000" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  return screen.getByTestId("transfer-details-body");
};

const classes = (el: Element) => el.className.split(/\s+/);

describe("Bank Transfer details step layout", () => {
  it("caps the modal card height on desktop and mobile", () => {
    const body = openDetailsStep();
    const card = body.parentElement!;
    expect(classes(card)).toEqual(
      expect.arrayContaining([
        "flex",
        "flex-col",
        "max-h-[85dvh]",
        "overflow-hidden",
        "max-sm:max-h-[85dvh]",
      ]),
    );
    // The Modal default (90vh) must be overridden, not stacked alongside.
    expect(card.className).not.toContain("max-h-[90vh]");
  });

  it("scrolls the body, not the whole card", () => {
    const body = openDetailsStep();
    expect(classes(body)).toEqual(
      expect.arrayContaining(["flex-1", "min-h-0", "overflow-y-auto"]),
    );
  });

  it("keeps the header pinned outside the scroll area", () => {
    const body = openDetailsStep();
    const title = screen.getByRole("heading", { name: "Bank Transfer" });
    expect(body.contains(title)).toBe(false);
  });

  it("pins the notice and CTAs in a footer outside the scroll area", () => {
    const body = openDetailsStep();
    const footer = screen.getByTestId("transfer-details-footer");
    const cta = screen.getByRole("button", { name: "I have sent the money" });
    const back = screen.getByRole("button", { name: "Back" });
    const notice = screen.getByText(/registered funding accounts/, {
      selector: "strong",
    });

    for (const el of [cta, back, notice]) {
      expect(footer.contains(el)).toBe(true);
      expect(body.contains(el)).toBe(false);
    }
    // Footer is a sibling after the body inside the capped card, and never
    // shrinks, so it stays on screen while the body scrolls.
    expect(footer.parentElement).toBe(body.parentElement);
    expect(body.nextElementSibling).toBe(footer);
    expect(classes(footer)).toContain("shrink-0");
    expect(footer.className).not.toContain("overflow-y-auto");
  });

  it("has no nested scroller around the funding accounts list", () => {
    const body = openDetailsStep();
    const nested = body.querySelectorAll('[class*="overflow-y-auto"]');
    expect(nested).toHaveLength(0);
    // All six linked accounts render, none clipped by an inner max-height.
    expect(screen.getAllByText("Ada Lovelace")).toHaveLength(6);
  });
});
