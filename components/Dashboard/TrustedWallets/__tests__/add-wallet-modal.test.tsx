// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AddWalletModal } from "../add-wallet-modal";

const api = vi.hoisted(() => ({
  getTrustedWalletsSupported: vi.fn(),
  validateTrustedWalletAddress: vi.fn(),
  addTrustedWallet: vi.fn(),
  getTrustedWallets: vi.fn(),
  renameTrustedWallet: vi.fn(),
  removeTrustedWallet: vi.fn(),
}));
vi.mock("@/lib/actions/trusted-wallets", () => api);

const profile = vi.hoisted(() => ({ isTwoFactorEnabled: true, hasTransactionPin: true }));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: profile } }),
}));
const activeNetworks = vi.hoisted(() => ({
  value: {
    isPending: false,
    isError: false,
    error: null as unknown,
    data: {
      data: {
        data: {
          USDT: {
            currencyName: "Tether",
            currencyType: "STABLE",
            networks: [
              { networkCode: "ETH", networkName: "Ethereum (ERC20)" },
              { networkCode: "TRX", networkName: "Tron (TRC20)" },
            ],
          },
          BTC: {
            currencyName: "Bitcoin",
            currencyType: "CRYPTO",
            networks: [{ networkCode: "BTC", networkName: "Bitcoin" }],
          },
          NGN: { currencyName: "Naira", currencyType: "FIAT", networks: [] },
        },
      },
    },
  },
}));
vi.mock("@/lib/services/wallet.service", () => ({
  UseActiveNetworksCrypto: () => activeNetworks.value,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

const apiError = (status: number, message: string, errorGroup = "") => ({
  success: false,
  status,
  message,
  raw: { response: { status, data: { data: null, message, errorGroup } } },
});

const renderModal = (onClose = vi.fn()) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <AddWalletModal onClose={onClose} />
    </QueryClientProvider>,
  );
  return { onClose };
};

const button = (name: string | RegExp) => screen.getByRole("button", { name });

const pickCoin = (label = "USDT - Tether") => {
  fireEvent.click(button(/Select Currency|- /));
  fireEvent.click(screen.getByRole("option", { name: new RegExp(`${label}$`) }));
};

/** Walks steps 1 to 3 and lands on "Confirm it's you". */
const reachVerifyStep = async () => {
  pickCoin();
  fireEvent.click(await screen.findByRole("radio", { name: /Tron \(TRC20\)/ }));
  fireEvent.click(button("Continue"));

  fireEvent.change(screen.getByLabelText("Wallet address"), { target: { value: ` ${ADDRESS} ` } });
  await screen.findByText("Valid Tron (TRC20) address", {}, { timeout: 2000 });
  fireEvent.change(screen.getByLabelText("Wallet label"), { target: { value: "Ledger Nano" } });
  fireEvent.click(button("Continue"));

  fireEvent.change(screen.getByLabelText("Re-enter your wallet address"), { target: { value: ADDRESS } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(button("Continue"));
  await screen.findByText("Confirm it's you");
};

const enterSecrets = (pin = "1234", code = "123456") => {
  fireEvent.change(screen.getByLabelText("Digit 1 of 4"), { target: { value: pin } });
  fireEvent.change(screen.getByLabelText("Digit 1 of 6"), { target: { value: code } });
};

beforeEach(() => {
  profile.isTwoFactorEnabled = true;
  profile.hasTransactionPin = true;
  api.getTrustedWalletsSupported.mockResolvedValue({
    assets: [
      {
        currency: "USDT",
        networks: [
          { code: "ETH", name: "Ethereum (ERC20)" },
          { code: "TRX", name: "Tron (TRC20)" },
        ],
      },
    ],
    coolingOffHours: 24,
    labelMaxLength: 24,
    maxWalletsPerNetwork: 10,
  });
  api.validateTrustedWalletAddress.mockImplementation(async ({ address }) =>
    address === ADDRESS
      ? { valid: true, network: "TRX" }
      : { valid: false, network: "TRX", reason: "Not a valid Tron address. Check it for typos." },
  );
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AddWalletModal", () => {
  it("sends the customer to set up 2FA and PIN before the flow", async () => {
    profile.isTwoFactorEnabled = false;
    profile.hasTransactionPin = false;
    renderModal();
    expect(screen.getByText("Secure your account first")).toBeInTheDocument();
    expect(screen.getByText("Turn on two-factor authentication")).toBeInTheDocument();
    expect(screen.getByText("Create a transaction PIN")).toBeInTheDocument();
  });

  it("lists coins from the deposit active-networks list, crypto and stable only", () => {
    renderModal();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    fireEvent.click(button("Select Currency"));
    const options = screen.getAllByRole("option").map((o) => o.textContent?.trim());
    expect(options).toEqual(["USDT - Tether", "BTC - Bitcoin"]);
  });

  it("shows the selected coin's networks underneath and resets the network on coin change", async () => {
    renderModal();
    pickCoin();
    fireEvent.click(screen.getByRole("radio", { name: /Tron/ }));
    expect(button("Continue")).not.toBeDisabled();
    pickCoin("BTC - Bitcoin");
    expect(screen.queryByRole("radio", { name: /Tron/ })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Bitcoin/ })).toHaveAttribute("aria-checked", "false");
    expect(button("Continue")).toBeDisabled();
  });

  it("needs a network before step 2", async () => {
    renderModal();
    pickCoin();
    await screen.findByRole("radio", { name: /Tron/ });
    expect(button("Continue")).toBeDisabled();
  });

  it("shows the backend's reason for an invalid address and blocks Continue", async () => {
    renderModal();
    pickCoin();
    fireEvent.click(await screen.findByRole("radio", { name: /Tron/ }));
    fireEvent.click(button("Continue"));
    fireEvent.change(screen.getByLabelText("Wallet address"), { target: { value: "0xnot-tron" } });
    fireEvent.change(screen.getByLabelText("Wallet label"), { target: { value: "Mine" } });
    expect(
      await screen.findByText("Not a valid Tron address. Check it for typos.", {}, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(button("Continue")).toBeDisabled();
    expect(api.validateTrustedWalletAddress).toHaveBeenCalledWith({
      currency: "USDT",
      network: "TRX",
      address: "0xnot-tron",
    });
  });

  it("blocks step 3 until the addresses match and ownership is ticked", async () => {
    renderModal();
    pickCoin();
    fireEvent.click(await screen.findByRole("radio", { name: /Tron/ }));
    fireEvent.click(button("Continue"));
    fireEvent.change(screen.getByLabelText("Wallet address"), { target: { value: ADDRESS } });
    await screen.findByText("Valid Tron (TRC20) address", {}, { timeout: 2000 });
    fireEvent.change(screen.getByLabelText("Wallet label"), { target: { value: "Ledger Nano" } });
    fireEvent.click(button("Continue"));

    fireEvent.change(screen.getByLabelText("Re-enter your wallet address"), { target: { value: ADDRESS + "x" } });
    expect(screen.getByText("The addresses don't match. Check both and try again.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox"));
    expect(button("Continue")).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Re-enter your wallet address"), { target: { value: ADDRESS } });
    expect(screen.getByText("Addresses match")).toBeInTheDocument();
    expect(button("Continue")).not.toBeDisabled();
  });

  it("only sends a complete PIN and code, with the exact payload, then shows the cooling-off wallet", async () => {
    api.addTrustedWallet.mockResolvedValue({
      id: "w1",
      currency: "USDT",
      network: "TRX",
      address: ADDRESS,
      memo: null,
      label: "Ledger Nano",
      status: "COOLING_OFF",
      unlocksAt: "2026-11-05T14:20:00.000Z",
      createdAt: "2026-11-04T14:20:00.000Z",
    });
    renderModal();
    await reachVerifyStep();

    enterSecrets("1234", "12345");
    expect(button("Add wallet")).toBeDisabled();
    enterSecrets("1234", "123456");
    fireEvent.click(button("Add wallet"));

    await screen.findByText("Wallet added");
    expect(api.addTrustedWallet).toHaveBeenCalledTimes(1);
    expect(api.addTrustedWallet.mock.calls[0][0]).toEqual({
      currency: "USDT",
      network: "TRX",
      address: ADDRESS,
      addressConfirm: ADDRESS,
      label: "Ledger Nano",
      ownershipConfirmed: true,
      pin: "1234",
      code: "123456",
    });
    expect(screen.getByText("Cooling off")).toBeInTheDocument();
    expect(screen.getByText(/after a 24-hour cooling-off period/)).toBeInTheDocument();
  });

  it("shows a wrong PIN or code inline and clears both fields", async () => {
    api.addTrustedWallet.mockRejectedValue(apiError(403, "Invalid authenticator code"));
    renderModal();
    await reachVerifyStep();
    enterSecrets();
    fireEvent.click(button("Add wallet"));

    expect(await screen.findByText("Invalid authenticator code")).toBeInTheDocument();
    expect(button("Add wallet")).toBeDisabled();
    expect((screen.getByLabelText("Digit 1 of 4") as HTMLInputElement).value).toBe("");
  });

  it("disables the button after too many attempts", async () => {
    api.addTrustedWallet.mockRejectedValue(apiError(429, "Too many attempts. Try again in 15 minutes."));
    renderModal();
    await reachVerifyStep();
    enterSecrets();
    fireEvent.click(button("Add wallet"));

    expect(await screen.findByText(/Too many attempts/)).toBeInTheDocument();
    enterSecrets();
    expect(button("Add wallet")).toBeDisabled();
  });
});
