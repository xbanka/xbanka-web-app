// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UserWallet } from "../../Wallet-Page/types";
import { EnterAmountStep } from "../enter-amount-step";

afterEach(cleanup);

const asset = {
  balance: 10,
  currency: "USDT",
  fiatEquivalent: { rate: 1500 },
} as unknown as UserWallet;

const renderStep = (amount: string, wallet: UserWallet = asset) =>
  render(
    <EnterAmountStep
      asset={wallet}
      network="TRC20"
      amount={amount}
      setAmount={vi.fn()}
      onBack={vi.fn()}
      onClose={vi.fn()}
      onNext={vi.fn()}
    />,
  );

const continueButton = () => screen.getByRole("button", { name: "Continue" });

describe("SendCrypto EnterAmountStep balance error", () => {
  it("shows no error and enables Continue when amount + fee fits", () => {
    renderStep("5");
    expect(screen.queryByText(/Insufficient balance/)).toBeNull();
    expect(continueButton()).not.toBeDisabled();
  });

  it("shows no error for an empty amount", () => {
    renderStep("");
    expect(screen.queryByText(/Insufficient balance/)).toBeNull();
    expect(continueButton()).toBeDisabled();
  });

  it("shows insufficient balance when amount exceeds balance", () => {
    renderStep("50");
    expect(
      screen.getByText(
        "Insufficient balance. Enter an amount within your available balance.",
      ),
    ).toBeTruthy();
    expect(continueButton()).toBeDisabled();
  });

  it("shows fee error when amount fits but amount + fee does not", () => {
    renderStep("9.5");
    expect(screen.getByText(/network fee/)).toBeTruthy();
    expect(continueButton()).toBeDisabled();
  });

  it("handles a string balance from the API", () => {
    renderStep("50", { ...asset, balance: "10" } as unknown as UserWallet);
    expect(screen.getByText(/Insufficient balance\./)).toBeTruthy();
  });
});
