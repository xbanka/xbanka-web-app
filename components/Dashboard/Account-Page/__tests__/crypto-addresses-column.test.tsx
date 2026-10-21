// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CryptoAddressesColumn } from "../crypto-addresses-column";

const state = vi.hoisted(() => ({ value: { data: undefined as unknown, isPending: false } }));
vi.mock("@/lib/services/wallet.service", () => ({
  UseGetAllWalletBalances: () => state.value,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const FULL = "TXk3abcdefghijklmn9fQz";
const wallet = (over: object) => ({
  id: "w", userId: "u", currency: "USDT", type: "CRYPTO", balance: 12345.67,
  fiatEquivalent: null, createdAt: "", updatedAt: "",
  addresses: [{ id: "a1", network: "TRC20", address: FULL }], ...over,
});
const give = (wallets: unknown[]) => {
  state.value = { data: { data: { data: wallets } }, isPending: false };
};

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn() },
    configurable: true,
  });
});
afterEach(cleanup);

describe("CryptoAddressesColumn", () => {
  it("shows a masked address and no balance for a funded crypto wallet", () => {
    give([wallet({})]);
    const { container } = render(<CryptoAddressesColumn />);
    expect(screen.getByText("TXk3ab****9fQz")).toBeTruthy();
    expect(container.textContent).not.toContain(FULL);
    expect(container.textContent).not.toContain("12345");
  });

  it("copies the full address, not the masked one", () => {
    give([wallet({})]);
    render(<CryptoAddressesColumn />);
    fireEvent.click(screen.getByLabelText("Copy USDT TRC20 wallet address"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(FULL);
  });

  it("hides wallets with no balance and fiat wallets", () => {
    give([wallet({ balance: 0 }), wallet({ type: "FIAT", currency: "NGN" })]);
    render(<CryptoAddressesColumn />);
    expect(screen.getByText("No crypto wallet with a balance yet.")).toBeTruthy();
  });
});
