// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LIMIT_EXCEEDED_MESSAGE } from "@/lib/nomba-withdrawal";
import type { NombaInitiateResponse } from "@/lib/types/wallet-types";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { EnterAmountStep } from "../enter-amount-step";

type MutateOptions = {
  onSuccess: (w: NombaInitiateResponse) => void;
  onError: (e: unknown) => void;
};
const initiate = {
  mutate: vi.fn<(payload: unknown, opts: MutateOptions) => void>(),
  error: null as unknown,
};
// Tier and today's spend behind the daily-limit guard (useTransactionLimit).
const limits = { tier: 1, spentToday: 0 };
vi.mock("@/lib/services/profile.service", () => ({
  UseVerificationStatus: () => ({ data: { data: { tierLevel: limits.tier } } }),
}));

vi.mock("@/lib/services/wallet.service", () => ({
  UseGetFiatWallet: () => ({ data: { data: { data: [{ balance: 200_000 }] } } }),
  UseGetTransactionHistory: () => ({
    isPending: false,
    data: {
      data: {
        data: {
          items: limits.spentToday
            ? [
                {
                  type: "WITHDRAWAL",
                  amount: limits.spentToday,
                  currency: "NGN",
                  status: "COMPLETED",
                  createdAt: new Date().toISOString(),
                },
              ]
            : [],
        },
      },
    },
  }),
  UseInitiateNombaWithdrawal: () => ({
    mutate: initiate.mutate,
    isPending: false,
    error: initiate.error,
    reset: vi.fn(),
  }),
}));

const traceMock = vi.fn();
vi.mock("@/lib/nomba-withdrawal", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/nomba-withdrawal")>()),
  traceWithdrawal: (...args: unknown[]) => traceMock(...args),
}));

vi.mock("@/components/ui/bank-logo", () => ({ BankLogo: () => null }));
vi.mock("@/components/Dashboard/Account-Page/create-pin-modal", () => ({
  CreatePinModal: ({ open }: { open: boolean }) => (open ? <div>create-pin-modal</div> : null),
}));

const recipient = {
  accountNumber: "0123456789",
  bankCode: "058",
  bankName: "GTBank",
  accountName: "",
  amount: 0,
  narration: "",
};
const initiated: NombaInitiateResponse = {
  withdrawalToken: "token-abc",
  accountName: "JOHN DOE",
  accountNumber: "0123456789",
  bankCode: "058",
  amount: 10_000,
  currency: "NGN",
  expiresAt: "2026-10-05T10:40:00.000Z",
};
const err = (status: number, message: string) => ({ success: false, status, message });

const setup = () => {
  const props = { onBack: vi.fn(), onClose: vi.fn(), onContinue: vi.fn() };
  const view = render(<EnterAmountStep recipient={recipient} {...props} />);
  return { ...props, ...view };
};
const amountInput = () => screen.getByPlaceholderText("0");
const continueButton = () => screen.getByRole("button", { name: "Continue" });
const fillAndContinue = (amount: string, narration = "") => {
  fireEvent.change(amountInput(), { target: { value: amount } });
  fireEvent.change(screen.getByPlaceholderText("What's this for?"), {
    target: { value: narration },
  });
  fireEvent.click(continueButton());
};

beforeEach(() => {
  initiate.mutate.mockReset();
  initiate.error = null;
  traceMock.mockReset();
  limits.tier = 1;
  limits.spentToday = 0;
  useOnboardingModalStore.setState({ activeModal: null });
});
afterEach(cleanup);

describe("EnterAmountStep", () => {
  it.each([
    ["499", false],
    ["500", true],
    ["5000", true],
    ["200000", true],
    ["200001", false],
  ])("amount %s -> Continue enabled: %s", (amount, enabled) => {
    setup();
    fireEvent.change(amountInput(), { target: { value: amount } });
    expect(continueButton().hasAttribute("disabled")).toBe(!enabled);
  });

  it("initiates with a trimmed narration and passes on the verified account name", () => {
    initiate.mutate.mockImplementation((_payload, opts) => opts.onSuccess(initiated));
    const { onContinue } = setup();
    fillAndContinue("10000", "  Rent  ");
    expect(initiate.mutate.mock.calls[0][0]).toEqual({
      bankCode: "058",
      accountNumber: "0123456789",
      amount: 10_000,
      narration: "Rent",
    });
    expect(onContinue).toHaveBeenCalledWith(
      expect.objectContaining({ accountName: "JOHN DOE", amount: 10_000, narration: "Rent" }),
      initiated,
    );
    expect(traceMock).toHaveBeenCalledWith({ event: "initiate_succeeded" });
  });

  it("leaves narration out when it is blank", () => {
    setup();
    fillAndContinue("10000", "   ");
    expect(initiate.mutate.mock.calls[0][0]).not.toHaveProperty("narration");
  });

  it("caps narration at the backend's 100 characters", () => {
    setup();
    expect(screen.getByPlaceholderText("What's this for?")).toHaveAttribute("maxLength", "100");
  });

  it("closes and opens BVN verification when the tier is too low", () => {
    initiate.mutate.mockImplementation((_p, opts) =>
      opts.onError(err(403, "Withdrawal blocked: TIER_REQUIRED")),
    );
    const { onClose } = setup();
    fillAndContinue("10000");
    expect(onClose).toHaveBeenCalled();
    expect(useOnboardingModalStore.getState().activeModal).toBe("bvn");
    expect(traceMock).toHaveBeenCalledWith({ event: "initiate_failed", kind: "tier-required" });
  });

  it("opens PIN setup when the user has no transaction PIN", () => {
    initiate.mutate.mockImplementation((_p, opts) =>
      opts.onError(err(403, "Withdrawal blocked: PIN_SETUP_REQUIRED")),
    );
    const { onClose } = setup();
    fillAndContinue("10000");
    expect(screen.getByText("create-pin-modal")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows the backend message under the form", () => {
    initiate.error = err(400, "Could not verify bank account");
    setup();
    expect(screen.getByText("Could not verify bank account")).toBeInTheDocument();
  });

  it("shows readable text instead of the LIMIT_EXCEEDED code", () => {
    initiate.error = err(403, "Withdrawal blocked: LIMIT_EXCEEDED");
    setup();
    expect(screen.getByText(LIMIT_EXCEEDED_MESSAGE)).toBeInTheDocument();
  });

  it("shows the expiry notice it was sent back with", () => {
    render(
      <EnterAmountStep
        recipient={{ ...recipient, amount: 10_000 }}
        notice="This request has expired."
        onBack={vi.fn()}
        onClose={vi.fn()}
        onContinue={vi.fn()}
      />,
    );
    expect(screen.getByText("This request has expired.")).toBeInTheDocument();
    expect(amountInput()).toHaveValue("10,000");
  });

  describe("daily tier limit", () => {
    it("Tier 0 allows exactly ₦150,000 and blocks ₦150,001 with an upgrade prompt", () => {
      limits.tier = 0;
      setup();
      fireEvent.change(amountInput(), { target: { value: "150000" } });
      expect(continueButton().hasAttribute("disabled")).toBe(false);
      fireEvent.change(amountInput(), { target: { value: "150001" } });
      expect(continueButton().hasAttribute("disabled")).toBe(true);
      expect(screen.getByRole("alert").textContent).toContain("Tier 0 daily limit of ₦150,000");
      expect(screen.getByRole("link", { name: "Upgrade to Tier 1" })).toBeTruthy();
    });

    it("counts today's spend and shows what is left", () => {
      limits.spentToday = 450_000;
      setup();
      fireEvent.change(amountInput(), { target: { value: "60000" } });
      expect(continueButton().hasAttribute("disabled")).toBe(true);
      expect(screen.getByRole("alert").textContent).toContain("₦50,000 more today");
      fireEvent.click(continueButton());
      expect(initiate.mutate).not.toHaveBeenCalled();
    });

    it("Tier 2 at its ₦2,000,000 limit points to Support, not Tier 3", () => {
      limits.tier = 2;
      limits.spentToday = 2_000_000;
      setup();
      fireEvent.change(amountInput(), { target: { value: "1000" } });
      expect(screen.getByRole("link", { name: "Contact Support" })).toBeTruthy();
      expect(screen.queryByText(/Tier 3/)).toBeNull();
    });
  });
});
