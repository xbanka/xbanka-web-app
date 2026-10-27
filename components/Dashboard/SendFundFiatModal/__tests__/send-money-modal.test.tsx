// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

vi.mock("../selectRecepient", () => ({
  SelectRecipientStep: ({ onSelectBank }: { onSelectBank: () => void }) => (
    <button onClick={onSelectBank}>pick bank</button>
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
