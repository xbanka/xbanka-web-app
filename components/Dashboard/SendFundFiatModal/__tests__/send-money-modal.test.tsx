// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EXPIRY_SAFETY_MARGIN_MS, WITHDRAWAL_TOKEN_TTL_MS } from "@/lib/nomba-withdrawal";
import type { NombaInitiateResponse, NombaWithdrawal } from "@/lib/types/wallet-types";
import type { Recipient, Step } from "../types";
import { SendMoneyModal } from "../send-money-modal";

// Each step is a stub with buttons for its callbacks, so these tests cover
// the modal's state machine only: which step comes next, and what is kept.
const recipient: Recipient = {
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
  // Deliberately far in the past: the client must not trust the device clock
  // against this value (see isWithdrawalExpired).
  expiresAt: "2000-01-01T00:00:00.000Z",
};
const confirmed = { reference: "NWD-1", status: "PENDING" } as NombaWithdrawal;

const guard = vi.hoisted(() => ({
  promptForTierError: vi.fn<(action: string) => Promise<boolean>>(),
}));
vi.mock("@/hooks/use-onboarding-guard", () => ({ useOnboardingGuard: () => guard }));
const toastError = vi.hoisted(() => vi.fn());
vi.mock("sonner", () => ({ toast: { error: toastError } }));

const xbankaUser = { id: "user-2", name: "Ada Obi", uid: "xb-ab12c" };

vi.mock("../selectRecepient", () => ({
  SelectRecipientStep: ({
    onSelectBank,
    onSelectXbanka,
  }: {
    onSelectBank: () => void;
    onSelectXbanka: (r: typeof xbankaUser) => void;
  }) => (
    <div>
      <button onClick={onSelectBank}>pick bank</button>
      <button onClick={() => onSelectXbanka(xbankaUser)}>pick xbanka user</button>
    </div>
  ),
}));
vi.mock("../enter-amount-xbanka-users", () => ({
  EnterAmountXbankaStep: (p: {
    recipient: typeof xbankaUser;
    onContinue: (r: typeof xbankaUser & { amount: number }) => void;
  }) => (
    <div>
      <p>xbanka amount step: {p.recipient.uid}</p>
      <button onClick={() => p.onContinue({ ...p.recipient, amount: 5000 })}>
        xbanka continue
      </button>
    </div>
  ),
}));
vi.mock("../confirm-step-xbanka-users", () => ({
  ConfirmXbankaUserStep: (p: { onConfirm: () => void }) => (
    <button onClick={p.onConfirm}>xbanka confirm</button>
  ),
}));
vi.mock("../enter-pin-xbanka-users", () => ({
  EnterPinXbankaStep: (p: { onConfirm: () => void }) => (
    <div>
      <p>xbanka pin step</p>
      <button onClick={p.onConfirm}>xbanka pin ok</button>
    </div>
  ),
}));
vi.mock("../processing-xbanka-users-step", () => ({
  ProcessingXbankaStep: (p: { onTierRequired?: (m: string) => void }) => (
    <button onClick={() => p.onTierRequired?.("Tier 2 required")}>
      backend says tier required
    </button>
  ),
}));
vi.mock("../tab-toggle", () => ({ TabToggle: () => null }));
vi.mock("../bank-account-step", () => ({
  BankAccountStep: (p: { setRecipient: (r: Recipient) => void; setStep: (s: Step) => void }) => (
    <button
      onClick={() => {
        p.setRecipient(recipient);
        p.setStep("enter-amount");
      }}
    >
      bank chosen
    </button>
  ),
}));
vi.mock("../enter-amount-step", () => ({
  EnterAmountStep: (p: {
    recipient: Recipient;
    notice?: string;
    onContinue: (r: Recipient, w: NombaInitiateResponse) => void;
  }) => (
    <div>
      <p>amount step: {p.recipient.amount}</p>
      {p.notice && <p>notice: {p.notice}</p>}
      <button
        onClick={() =>
          p.onContinue({ ...p.recipient, accountName: "JOHN DOE", amount: 10_000 }, initiated)
        }
      >
        continue
      </button>
    </div>
  ),
}));
vi.mock("../confirm-step", () => ({
  ConfirmStep: (p: { accountName: string; onConfirm: () => void }) => (
    <button onClick={p.onConfirm}>confirm {p.accountName}</button>
  ),
}));
vi.mock("../enter-pin-step", () => ({
  EnterPinStep: (p: {
    withdrawalToken: string;
    onExpired: (m: string) => void;
    onConfirmed: (w: NombaWithdrawal) => void;
  }) => (
    <div>
      <p>pin step: {p.withdrawalToken}</p>
      <button onClick={() => p.onConfirmed(confirmed)}>pin ok</button>
      <button onClick={() => p.onExpired("Withdrawal request expired")}>pin expired</button>
    </div>
  ),
}));
vi.mock("../withdrawal-result-step", () => ({
  WithdrawalResultStep: (p: { withdrawal: NombaWithdrawal }) => (
    <p>result: {p.withdrawal.reference}</p>
  ),
}));

const click = (name: RegExp | string) => fireEvent.click(screen.getByRole("button", { name }));

const reachConfirmStep = () => {
  render(<SendMoneyModal onClose={vi.fn()} />);
  click("pick bank");
  click("bank chosen");
  click("continue");
};

beforeEach(() => {
  guard.promptForTierError.mockReset().mockResolvedValue(true);
  toastError.mockReset();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("SendMoneyModal bank withdrawal", () => {
  it("goes amount -> confirm -> PIN -> result with the initiate token", () => {
    reachConfirmStep();
    click("confirm JOHN DOE");
    expect(screen.getByText("pin step: token-abc")).toBeInTheDocument();
    click("pin ok");
    expect(screen.getByText("result: NWD-1")).toBeInTheDocument();
  });

  it("trusts elapsed time, not the device clock, against expiresAt", () => {
    // expiresAt is in the year 2000; a wall-clock comparison would bounce.
    reachConfirmStep();
    click("confirm JOHN DOE");
    expect(screen.getByText("pin step: token-abc")).toBeInTheDocument();
  });

  it("sends the user back with their amount when the token aged out on review", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    reachConfirmStep();
    vi.setSystemTime(Date.now() + WITHDRAWAL_TOKEN_TTL_MS - EXPIRY_SAFETY_MARGIN_MS);
    click("confirm JOHN DOE");
    expect(screen.getByText("amount step: 10000")).toBeInTheDocument();
    expect(screen.getByText(/notice: This request has expired/)).toBeInTheDocument();
  });

  it("sends the user back when the backend says the token expired at PIN", () => {
    reachConfirmStep();
    click("confirm JOHN DOE");
    click("pin expired");
    expect(screen.getByText("amount step: 10000")).toBeInTheDocument();
    expect(screen.getByText("notice: Withdrawal request expired")).toBeInTheDocument();
  });

  it("clears the notice after a fresh initiate", () => {
    reachConfirmStep();
    click("confirm JOHN DOE");
    click("pin expired");
    click("continue");
    click("confirm JOHN DOE");
    expect(screen.queryByText(/notice:/)).not.toBeInTheDocument();
    expect(screen.getByText("pin step: token-abc")).toBeInTheDocument();
  });
});

describe("SendMoneyModal to another XBanka user", () => {
  it("picking a user goes straight to the amount step: the Tier 2 check ran on Send", () => {
    render(<SendMoneyModal onClose={vi.fn()} />);
    click("pick xbanka user");
    expect(screen.getByText("xbanka amount step: xb-ab12c")).toBeInTheDocument();
    expect(guard.promptForTierError).not.toHaveBeenCalled();
  });

  const reachTransfer = async (onClose = vi.fn()) => {
    render(<SendMoneyModal onClose={onClose} />);
    click("pick xbanka user");
    click("xbanka continue");
    click("xbanka confirm");
    click("xbanka pin ok");
    return onClose;
  };

  it("backend refuses for tier anyway: closes and leaves the verify prompt up", async () => {
    const onClose = await reachTransfer();
    click("backend says tier required");
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(guard.promptForTierError).toHaveBeenCalledWith("fiat");
    expect(toastError).not.toHaveBeenCalled();
  });

  it("backend refuses for tier but nothing is missing on our side: toast + back to PIN", async () => {
    guard.promptForTierError.mockResolvedValue(false);
    const onClose = await reachTransfer();
    click("backend says tier required");
    expect(await screen.findByText("xbanka pin step")).toBeInTheDocument();
    expect(toastError).toHaveBeenCalledWith("Tier 2 required");
    expect(onClose).not.toHaveBeenCalled();
  });
});
