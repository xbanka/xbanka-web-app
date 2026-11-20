// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BankDeposit } from "@/lib/bank-deposit";
import { WATCH_KEY } from "@/lib/deposit-memory";
import { useDepositFlowStore } from "@/store/deposit-flow-store";

// ── Mocks ──────────────────────────────────────────────────────────────────
const state: {
  deposits: BankDeposit[];
  accounts: { id: string; bankName: string; bankCode: string; accountNumber: string; accountName: string }[];
  updatedAt: number;
} = { deposits: [], accounts: [], updatedAt: 1 };

const declare = vi.fn();

vi.mock("@/hooks/use-bank-deposits", () => ({
  useBankDeposits: () => ({
    deposits: state.deposits,
    pending: state.deposits.filter((d) => d.status === "PENDING"),
    isLoading: false,
    dataUpdatedAt: state.updatedAt,
  }),
}));
vi.mock("@/lib/services/wallet.service", () => ({
  UseGetFundingAccounts: () => ({ data: { data: { data: state.accounts } }, isPending: false }),
  UseGetXbankaFundingAccount: () => ({
    data: { data: { data: { bankName: "Stanbic IBTC Bank", accountNumber: "0076322108", accountName: "XBANKA LTD" } } },
    isPending: false,
    error: null,
  }),
  UseDeclareBankTransferIntent: () => ({ mutate: declare, isPending: false }),
  UseAddFundingAccount: () => ({ mutateAsync: vi.fn(), isPending: false }),
  UseGetAllBanks: () => ({ data: undefined, isPending: false }),
  UseLookupAccountName: () => ({ mutateAsync: vi.fn(), isPending: false }),
  UseGetFiatWallet: () => ({ data: { data: { data: [{ currency: "NGN", balance: 12450 }] } } }),
}));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: { firstName: "Ada", lastName: "Lovelace", xbId: "XB1" } } }),
}));
vi.mock("@/hooks/use-transaction-limit", () => ({
  useTransactionLimit: () => ({ checkDeposit: () => ({ allowed: true }) }),
}));
vi.mock("@/hooks/use-balance-visibility", () => ({ useBalanceVisibility: () => ({ hidden: false }) }));
vi.mock("@/components/ui/limit-notice", () => ({ LimitNotice: () => null }));
vi.mock("@/components/ui/bank-logo", () => ({ BankLogo: () => null }));
vi.mock("@/components/ui/search-select-field", () => ({ SearchSelectField: () => null }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { DepositFlowHost } from "../deposit-flow-host";
import { PendingDepositBanner } from "../pending-deposit-banner";

// ── Helpers ────────────────────────────────────────────────────────────────
const GT = { id: "fa-gt", bankName: "GTBank", bankCode: "058", accountNumber: "0127661815", accountName: "ADA LOVELACE" };
const OPAY = { id: "fa-op", bankName: "OPay", bankCode: "999", accountNumber: "8059048734", accountName: "ADA LOVELACE" };

/** Lagos wall-clock time (UTC+1) as an ISO instant. */
const lagosIso = (wall: string) => new Date(Date.parse(`${wall}Z`) - 3_600_000).toISOString();

const deposit = (over: Partial<BankDeposit> = {}): BankDeposit => ({
  id: "dep-1",
  reference: "MANUAL-1795074099241-DGA287H",
  status: "PENDING",
  amount: 2000,
  declaredAmount: null,
  createdAt: lagosIso("2026-11-19T10:42:00"),
  updatedAt: lagosIso("2026-11-19T10:58:00"),
  fundingAccountId: null,
  ...over,
});

const setNow = (wall: string) => vi.setSystemTime(new Date(lagosIso(wall)));

const renderApp = () =>
  render(
    <>
      <PendingDepositBanner />
      <DepositFlowHost />
    </>,
  );

const openAddFund = () => act(() => useDepositFlowStore.getState().open());
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole("button", { name }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  setNow("2026-11-19T10:50:00");
  state.deposits = [];
  state.accounts = [GT, OPAY];
  state.updatedAt = 1;
  declare.mockReset();
  window.localStorage.clear();
  useDepositFlowStore.setState({ screen: null, amount: "", sourceId: null, declared: null });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// ── Entry rules ────────────────────────────────────────────────────────────
describe("Add Fund entry (Figma V1 rules)", () => {
  it("goes to amount and source when there is an account and nothing pending", () => {
    renderApp();
    openAddFund();
    expect(screen.getByRole("heading", { name: "Add funds by bank transfer" })).toBeInTheDocument();
  });

  it("asks for a funding account first when none is registered", () => {
    state.accounts = [];
    renderApp();
    openAddFund();
    expect(screen.getByRole("heading", { name: "Add the account you'll pay from" })).toBeInTheDocument();
    expect(screen.getByText("Why this matters")).toBeInTheDocument();
  });

  it("shows the deposit in progress (P1), then the second-deposit warning (P2)", () => {
    state.deposits = [deposit()];
    renderApp();
    openAddFund();
    expect(screen.getByRole("heading", { name: "You have a deposit in progress" })).toBeInTheDocument();
    expect(screen.getByTestId("waiting-duration")).toHaveTextContent("8 minutes");

    click("Make another deposit");
    expect(screen.getByRole("heading", { name: "Make another deposit?" })).toBeInTheDocument();
    expect(screen.getByText(/deposit from 10:42am is still being processed/)).toBeInTheDocument();

    click("Yes, new deposit");
    expect(screen.getByRole("heading", { name: "Add funds by bank transfer" })).toBeInTheDocument();
  });

  it("P1b after 15 minutes, P1c after 10pm", () => {
    state.deposits = [deposit()];
    setNow("2026-11-19T11:34:00");
    renderApp();
    openAddFund();
    expect(screen.getByText("This is taking longer than usual")).toBeInTheDocument();
    cleanup();

    state.deposits = [deposit({ createdAt: lagosIso("2026-11-19T22:36:00") })];
    setNow("2026-11-19T23:00:00");
    renderApp();
    openAddFund();
    expect(screen.getByText("It'll be credited from 8am")).toBeInTheDocument();
  });
});

// ── Happy path ─────────────────────────────────────────────────────────────
describe("amount → transfer details → quick confirm → status", () => {
  const toDetails = () => {
    renderApp();
    openAddFund();
    fireEvent.change(screen.getByLabelText("Amount to fund"), { target: { value: "2000" } });
    click("Continue");
  };

  it("needs at least ₦1,000", () => {
    renderApp();
    openAddFund();
    fireEvent.change(screen.getByLabelText("Amount to fund"), { target: { value: "999" } });
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  it("pins the account picked in step 1 on the transfer details", () => {
    renderApp();
    openAddFund();
    fireEvent.change(screen.getByLabelText("Amount to fund"), { target: { value: "2000" } });
    fireEvent.click(screen.getByRole("radio", { name: /OPay ••••8734/ }));
    click("Continue");
    expect(screen.getByText("Send from OPay ••••8734 only")).toBeInTheDocument();
  });

  it("declares only after 'Yes, I've sent it', then shows the status", () => {
    declare.mockImplementation((amount: number, opts: { onSuccess: (r: unknown) => void }) =>
      opts.onSuccess({
        data: {
          data: {
            success: true,
            transactionId: "new-1",
            amount,
            createdAt: new Date().toISOString(),
            reference: "MANUAL-NEW",
            status: "PENDING",
          },
        },
      }),
    );
    toDetails();
    expect(screen.getByRole("heading", { name: "Make the transfer" })).toBeInTheDocument();
    expect(screen.getByText("Send from GTBank ••••1815 only")).toBeInTheDocument();
    expect(screen.getByText(/Usually credited within 15 minutes/)).toBeInTheDocument();

    click("I have sent the money");
    expect(screen.getByRole("heading", { name: "Have you sent ₦2,000?" })).toBeInTheDocument();
    expect(declare).not.toHaveBeenCalled();

    click("Not yet");
    expect(screen.getByRole("heading", { name: "Make the transfer" })).toBeInTheDocument();
    click("I have sent the money");
    click("Yes, I've sent it");

    expect(declare).toHaveBeenCalledWith(2000, expect.anything());
    expect(screen.getByRole("heading", { name: "Deposit request received" })).toBeInTheDocument();
    expect(screen.getByText("MANUAL-NEW")).toBeInTheDocument();
    expect(screen.getByText("GTBank ••••1815")).toBeInTheDocument();
    // Watched, so its result pops up when it settles.
    expect(JSON.parse(window.localStorage.getItem(WATCH_KEY)!)).toContain("new-1");
  });

  it("warns after 10pm (2b) and before 8am", () => {
    setNow("2026-11-19T22:30:00");
    toDetails();
    expect(screen.getByText("It's past 10pm")).toBeInTheDocument();
    cleanup();
    useDepositFlowStore.setState({ screen: null, amount: "" });
    setNow("2026-11-20T06:30:00");
    toDetails();
    expect(screen.getByText("Approvals open at 8am")).toBeInTheDocument();
  });

  // Regression (fix/bank-transfer-modal-scroll): the CTA must never be pushed
  // below a short viewport. The card is capped; only the body scrolls.
  it("keeps the CTAs pinned outside a scrolling body", () => {
    toDetails();
    const body = screen.getByTestId("transfer-details-body");
    const footer = screen.getByTestId("transfer-details-footer");
    const card = body.parentElement!;
    expect(card.className).toContain("max-h-[85dvh]");
    expect(card.className).not.toContain("max-h-[90vh]");
    expect(body.className).toContain("overflow-y-auto");
    expect(body.nextElementSibling).toBe(footer);
    expect(footer.contains(screen.getByRole("button", { name: "I have sent the money" }))).toBe(true);
    expect(body.contains(screen.getByRole("heading", { name: "Make the transfer" }))).toBe(false);
  });
});

// ── Status and results ─────────────────────────────────────────────────────
describe("status (4a / 4d)", () => {
  it("4a while within a day", () => {
    state.deposits = [deposit()];
    renderApp();
    act(() => useDepositFlowStore.getState().openStatus("dep-1"));
    expect(screen.getByText("Waiting to be checked")).toBeInTheDocument();
    expect(screen.getByText("Usually within 15 minutes · 8am to 10pm")).toBeInTheDocument();
    expect(screen.getByText("Today, 10:42am")).toBeInTheDocument();
  });

  it("4d after 24 hours", () => {
    state.deposits = [deposit({ createdAt: lagosIso("2026-11-18T10:42:00") })];
    setNow("2026-11-19T10:50:00");
    renderApp();
    act(() => useDepositFlowStore.getState().openStatus("dep-1"));
    expect(screen.getByRole("heading", { name: "This is taking longer than usual" })).toBeInTheDocument();
    expect(screen.getByText("Our support team has been alerted")).toBeInTheDocument();
    expect(screen.getByText("Pending for over 24 hours")).toBeInTheDocument();
    expect(screen.getByText("Yesterday, 10:42am")).toBeInTheDocument();
  });
});

describe("results pop up once, for watched deposits only", () => {
  const watch = (...ids: string[]) => window.localStorage.setItem(WATCH_KEY, JSON.stringify(ids));

  it("5a credited", () => {
    watch("dep-1");
    state.deposits = [deposit({ status: "COMPLETED" })];
    renderApp();
    expect(screen.getByRole("heading", { name: "Deposit credited" })).toBeInTheDocument();
    expect(screen.getByText("Your wallet has been funded.")).toBeInTheDocument();
    expect(screen.getByText("₦12,450.00")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(WATCH_KEY)!)).toEqual([]);
  });

  it("5b credited a different amount", () => {
    watch("dep-1");
    state.deposits = [deposit({ status: "COMPLETED", amount: 1500, declaredAmount: 2000 })];
    renderApp();
    expect(screen.getByText("We received a different amount from what you entered.")).toBeInTheDocument();
    expect(screen.getByText(/You entered ₦2,000, but ₦1,500 arrived/)).toBeInTheDocument();
  });

  it("5c not credited, without the internal reject reason", () => {
    watch("dep-1");
    state.deposits = [deposit({ status: "FAILED" })];
    renderApp();
    expect(screen.getByRole("heading", { name: "Deposit not credited" })).toBeInTheDocument();
    expect(screen.queryByText(/not received/i)).not.toBeInTheDocument();
    click("Make a new deposit");
    expect(screen.getByRole("heading", { name: "Add funds by bank transfer" })).toBeInTheDocument();
  });

  it("never pops up for a deposit this browser did not watch", () => {
    state.deposits = [deposit({ status: "COMPLETED" })];
    renderApp();
    expect(screen.queryByRole("heading", { name: "Deposit credited" })).not.toBeInTheDocument();
  });

  it("does not interrupt a flow in progress; shows on a later read", () => {
    watch("dep-1");
    state.deposits = [deposit({ status: "COMPLETED" })];
    useDepositFlowStore.setState({ screen: { name: "amount" } });
    const { rerender } = renderApp();
    expect(screen.getByRole("heading", { name: "Add funds by bank transfer" })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(WATCH_KEY)!)).toContain("dep-1");

    act(() => useDepositFlowStore.getState().close());
    state.updatedAt = 2;
    rerender(
      <>
        <PendingDepositBanner />
        <DepositFlowHost />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Deposit credited" })).toBeInTheDocument();
  });

  it("swaps an open status screen for the result when it settles", () => {
    state.deposits = [deposit()];
    const { rerender } = renderApp();
    act(() => useDepositFlowStore.getState().openStatus("dep-1"));
    expect(screen.getByRole("heading", { name: "Deposit request received" })).toBeInTheDocument();

    state.deposits = [deposit({ status: "COMPLETED" })];
    state.updatedAt = 2;
    rerender(
      <>
        <PendingDepositBanner />
        <DepositFlowHost />
      </>,
    );
    expect(screen.getByRole("heading", { name: "Deposit credited" })).toBeInTheDocument();
  });
});

// ── Banner ─────────────────────────────────────────────────────────────────
describe("pending deposit banner", () => {
  it("is not there when nothing is pending", () => {
    state.deposits = [deposit({ status: "COMPLETED" })];
    renderApp();
    expect(screen.queryByTestId("pending-deposit-banner")).not.toBeInTheDocument();
  });

  it("shows the pending deposit and opens its status", () => {
    state.deposits = [deposit()];
    renderApp();
    expect(screen.getByText("Your ₦2,000 deposit is waiting to be credited")).toBeInTheDocument();
    expect(
      screen.getByText("Submitted 10:42am · usually credited within 15 minutes"),
    ).toBeInTheDocument();
    click(/View/);
    expect(screen.getByRole("heading", { name: "Deposit request received" })).toBeInTheDocument();
  });

  it("counts several pending deposits and opens the in-progress screen", () => {
    state.deposits = [deposit({ id: "dep-2" }), deposit()];
    renderApp();
    expect(screen.getByText("You have 2 deposits waiting to be credited")).toBeInTheDocument();
    click(/View/);
    expect(screen.getByRole("heading", { name: "You have a deposit in progress" })).toBeInTheDocument();
  });

  it("tracks the deposit's age in its subtitle", () => {
    state.deposits = [deposit({ createdAt: lagosIso("2026-11-18T10:42:00") })];
    renderApp();
    expect(screen.getByText("Submitted Yesterday, 10:42am · pending for over 24 hours")).toBeInTheDocument();
  });
});
