// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WhitelistPage } from "../whitelist-page";

const api = vi.hoisted(() => ({
  getTrustedWalletsSupported: vi.fn(async () => ({
    assets: [{ currency: "USDT", networks: [{ code: "TRX", name: "Tron (TRC20)" }] }],
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
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: { isTwoFactorEnabled: true, hasTransactionPin: true } } }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const renderPage = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <WhitelistPage />
    </QueryClientProvider>,
  );
};

const ledger = {
  id: "w1",
  currency: "USDT",
  network: "TRX",
  address: "TXk4mV9bR2fWq7LdZ3sNp8YcHjA6uE1xGo",
  memo: null,
  label: "Ledger Nano",
  status: "ACTIVE",
  unlocksAt: "2026-10-13T10:00:00.000Z",
  createdAt: "2026-10-12T10:00:00.000Z",
};

describe("WhitelistPage", () => {
  it("lists wallets with network names and the cooling-off unlock time", async () => {
    api.getTrustedWallets.mockResolvedValue([
      ledger,
      { ...ledger, id: "w2", label: "Phone wallet", status: "COOLING_OFF", unlocksAt: "2026-11-07T14:20:00.000Z" },
    ]);
    renderPage();
    expect((await screen.findAllByText("Ledger Nano")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tron (TRC20)").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Unlocks 7 Nov/).length).toBeGreaterThan(0);
    expect(screen.getByText("2 wallets")).toBeInTheDocument();
  });

  it("shows the backend message when the list cannot load", async () => {
    api.getTrustedWallets.mockRejectedValue({ status: 404, message: "Wallet not found" });
    renderPage();
    expect(await screen.findByText("Wallet not found")).toBeInTheDocument();
  });

  it("removes a wallet with PIN and code through POST /:id/remove", async () => {
    api.getTrustedWallets.mockResolvedValue([ledger]);
    api.removeTrustedWallet.mockResolvedValue({ removed: true });
    renderPage();
    fireEvent.click((await screen.findAllByRole("button", { name: "Open Ledger Nano" }))[0]);
    expect(await screen.findByRole("heading", { name: "Ledger Nano" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove wallet" }));

    expect(await screen.findByText("Remove Ledger Nano?")).toBeInTheDocument();
    const remove = () => screen.getByRole("button", { name: "Remove wallet" });
    expect(remove()).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Digit 1 of 4"), { target: { value: "1234" } });
    fireEvent.change(screen.getByLabelText("Digit 1 of 6"), { target: { value: "654321" } });
    fireEvent.click(remove());

    await waitFor(() => expect(api.removeTrustedWallet).toHaveBeenCalledTimes(1));
    expect(api.removeTrustedWallet.mock.calls[0][0]).toEqual({ id: "w1", pin: "1234", code: "654321" });
    await waitFor(() => expect(screen.queryByText("Remove Ledger Nano?")).toBeNull());
    expect(within(document.body).queryByText("Remove Ledger Nano?")).toBeNull();
  });
});
