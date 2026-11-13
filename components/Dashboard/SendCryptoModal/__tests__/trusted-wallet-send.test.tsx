// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { RecipientStep } from "../receipient-step";
import { ProcessingStep } from "../processing-step";
import { SuccessStep } from "../success-step";
import type { UserWallet } from "../../Wallet-Page/types";
import type { WalletSuccessState } from "../crypto-modal-types";

const api = vi.hoisted(() => ({
  getTrustedWalletsSupported: vi.fn(async () => ({
    assets: [],
    coolingOffHours: 24,
    labelMaxLength: 24,
    maxWalletsPerNetwork: 10,
  })),
  getTrustedWallets: vi.fn(),
  validateTrustedWalletAddress: vi.fn(),
  addTrustedWallet: vi.fn(),
  renameTrustedWallet: vi.fn(),
  removeTrustedWallet: vi.fn(),
}));
vi.mock("@/lib/actions/trusted-wallets", () => api);

const wallet = vi.hoisted(() => ({ withdrawCrypto: vi.fn() }));
vi.mock("@/lib/actions/wallet", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  withdrawCrypto: wallet.withdrawCrypto,
}));
const xbanka = vi.hoisted(() => ({ users: [] as unknown[] }));
vi.mock("@/lib/services/send-fiat.service", () => ({
  UseGetActiveXbankaUsers: () => ({ data: { data: xbanka.users }, isPending: false }),
}));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: { isTwoFactorEnabled: true, hasTransactionPin: true } } }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const withQuery = (ui: ReactNode) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

const saved = (over: Record<string, unknown>) => ({
  currency: "USDT",
  network: "TRX",
  address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  memo: null,
  status: "ACTIVE",
  unlocksAt: "2026-11-05T14:20:00.000Z",
  createdAt: "2026-11-04T14:20:00.000Z",
  ...over,
});

describe("RecipientStep: saved wallets", () => {
  it("lists only the asset's wallets, keeps cooling-off ones unpickable, and continues with an ACTIVE one", async () => {
    api.getTrustedWallets.mockResolvedValue([
      saved({ id: "a", label: "Ledger Nano" }),
      saved({ id: "b", label: "Backup wallet", status: "COOLING_OFF" }),
      saved({ id: "c", label: "BTC cold", currency: "BTC", network: "BTC" }),
    ]);
    const onNext = vi.fn();
    withQuery(
      <RecipientStep currency="USDT" onBack={vi.fn()} onClose={vi.fn()} onNext={onNext} />,
    );

    const ledger = await screen.findByRole("radio", { name: /Ledger Nano/ });
    expect(screen.queryByText("BTC cold")).toBeNull();
    expect(screen.getByRole("radio", { name: /Backup wallet/ })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText(/Available from/)).toBeInTheDocument();

    const continueBtn = screen.getByRole("button", { name: "Continue" });
    expect(continueBtn).toBeDisabled();

    // Tapping a cooling-off wallet explains why instead of selecting it.
    fireEvent.click(screen.getByRole("radio", { name: /Backup wallet/ }));
    expect(await screen.findByText("This wallet is cooling off")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));

    fireEvent.click(await screen.findByRole("radio", { name: /Ledger Nano/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({ type: "trusted-wallet", wallet: expect.objectContaining({ id: "a" }) }),
    );
    expect(ledger).toBeTruthy();
  });

  it("blocks the send with an Add a wallet prompt when none are saved", async () => {
    api.getTrustedWallets.mockResolvedValue([]);
    withQuery(<RecipientStep currency="USDT" onBack={vi.fn()} onClose={vi.fn()} onNext={vi.fn()} />);
    expect(await screen.findByText("Add a USDT wallet to send USDT")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add a wallet" })).toBeInTheDocument();
  });

  // A customer with a saved USDT wallet who picks BNB is told which coin
  // needs a wallet, without a list of their other coins.
  it("names the picked coin when only other coins have wallets", async () => {
    api.getTrustedWallets.mockResolvedValue([
      saved({ id: "a", label: "Ledger Nano" }),
      saved({ id: "c", label: "BTC cold", currency: "BTC", network: "BTC" }),
    ]);
    withQuery(<RecipientStep currency="BNB" onBack={vi.fn()} onClose={vi.fn()} onNext={vi.fn()} />);
    expect(await screen.findByText("Add a BNB wallet to send BNB")).toBeInTheDocument();
    expect(screen.queryByText(/Your saved wallets are for/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose another coin" })).toBeNull();
  });

  it("lists a saved wallet whose coin is spelled in another case", async () => {
    api.getTrustedWallets.mockResolvedValue([saved({ id: "a", label: "Ledger Nano", currency: "usdt" })]);
    withQuery(<RecipientStep currency="USDT" onBack={vi.fn()} onClose={vi.fn()} onNext={vi.fn()} />);
    expect(await screen.findByRole("radio", { name: /Ledger Nano/ })).toBeInTheDocument();
    expect(screen.queryByText(/Add a USDT wallet/)).toBeNull();
  });

  it("shows a load error with a retry, never the Add a wallet prompt, when the list fails", async () => {
    api.getTrustedWallets.mockRejectedValueOnce(
      new Error("We couldn't load your saved wallets. Please try again."),
    );
    withQuery(<RecipientStep currency="USDT" onBack={vi.fn()} onClose={vi.fn()} onNext={vi.fn()} />);
    expect(await screen.findByText(/couldn't load your saved wallets/)).toBeInTheDocument();
    expect(screen.queryByText(/Add a USDT wallet/)).toBeNull();

    api.getTrustedWallets.mockResolvedValueOnce([saved({ id: "a", label: "Ledger Nano" })]);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("radio", { name: /Ledger Nano/ })).toBeInTheDocument();
  });
});

// The XBanka user tab shows and searches the public xbId; the UUID is only
// sent as the transfer target and never shown.
describe("RecipientStep: XBanka user tab", () => {
  afterEach(() => {
    xbanka.users = [];
  });

  it("finds a user by xbId, shows the xbId, and continues with the UUID as id", async () => {
    api.getTrustedWallets.mockResolvedValue([]);
    xbanka.users = [
      {
        id: "8f1c2d3e-uuid",
        xbId: "XB12345",
        email: "ada@example.com",
        profile: { firstName: "Ada", lastName: "Obi" },
      },
    ];
    const onNext = vi.fn();
    withQuery(<RecipientStep currency="USDT" onBack={vi.fn()} onClose={vi.fn()} onNext={onNext} />);

    fireEvent.click(screen.getByRole("tab", { name: "XBanka user" }));
    const search = screen.getByPlaceholderText("Search by name, email or XBanka ID");

    fireEvent.change(search, { target: { value: "8f1c2d3e" } });
    expect(screen.getByText("No XBanka users match your search.")).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "xb123" } });
    expect(screen.getByText("XB12345")).toBeInTheDocument();
    expect(screen.queryByText("8f1c2d3e-uuid")).toBeNull();

    fireEvent.click(screen.getByText("XB12345"));
    expect(onNext).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "xbanka-user",
        user: expect.objectContaining({ id: "8f1c2d3e-uuid", uid: "XB12345" }),
      }),
    );
  });
});

describe("ProcessingStep: trusted send payload", () => {
  it("sends currency, amount, trustedWalletId and pin, and no network or address", async () => {
    wallet.withdrawCrypto.mockResolvedValue({ data: { status: "PENDING" } });
    const onConfirm = vi.fn();
    withQuery(
      <ProcessingStep
        amount="1,200.5"
        asset={{ currency: "USDT" } as UserWallet}
        trustedWalletId="w1"
        pin="1234"
        onConfirm={onConfirm}
        setSuccessDetails={vi.fn()}
        onError={vi.fn()}
      />,
    );
    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
    expect(wallet.withdrawCrypto.mock.calls[0][0]).toEqual({
      currency: "USDT",
      amount: 1200.5,
      trustedWalletId: "w1",
      pin: "1234",
    });
  });
});

describe("SuccessStep: withdrawal status", () => {
  const renderWith = (status: string) =>
    render(
      <SuccessStep
        amount="25"
        asset={{ currency: "USDT", fiatEquivalent: { rate: 1 } } as UserWallet}
        network="TRX"
        txHash=""
        onDone={vi.fn()}
        onViewHistory={vi.fn()}
        successDetails={{ status, createdAt: "2026-11-04T14:20:00.000Z", reference: "r" } as WalletSuccessState}
      />,
    );

  it("shows Processing, never Sent, while Obiex has not paid out", () => {
    renderWith("PENDING");
    expect(screen.getByText(/Processing/)).toBeInTheDocument();
    expect(screen.queryByText(/Sent Successfully/)).toBeNull();
  });

  it("shows Sent once COMPLETED", () => {
    renderWith("COMPLETED");
    expect(screen.getByText(/Sent Successfully/)).toBeInTheDocument();
  });
});
