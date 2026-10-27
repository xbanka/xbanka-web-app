import { describe, expect, it } from "vitest";
import { getWalletTotals } from "@/lib/walletTotals";
import { Wallet } from "@/lib/types/wallet-types";

const naira = (balance: number): Wallet => ({
  type: "FIAT",
  balance,
  // The API also prices the naira in dollars; that is not a crypto holding.
  usdEquivalent: { amount: balance / 1500, currency: "USD", rate: 1500 },
});

const crypto = (balance: number, nairaValue: number): Wallet => ({
  type: "CRYPTO",
  balance,
  fiatEquivalent: { amount: nairaValue, currency: "NGN", rate: 1500 },
});

describe("getWalletTotals", () => {
  it("keeps a naira deposit on the fiat side only", () => {
    const totals = getWalletTotals([naira(150_000)]);

    expect(totals.fiatNgn).toBe(150_000);
    expect(totals.cryptoUsd).toBe(0);
    expect(totals.cryptoNgn).toBe(0);
    expect(totals.totalNgn).toBe(150_000);
  });

  it("adds crypto wallets in dollars and in naira", () => {
    const totals = getWalletTotals([
      naira(10_000),
      crypto(20, 30_000),
      crypto(5, 7_500),
    ]);

    expect(totals.fiatNgn).toBe(10_000);
    expect(totals.cryptoUsd).toBe(25);
    expect(totals.cryptoNgn).toBe(37_500);
    expect(totals.totalNgn).toBe(47_500);
  });

  it("treats missing data as zero", () => {
    expect(getWalletTotals(undefined).totalNgn).toBe(0);
    expect(
      getWalletTotals([{ type: "CRYPTO", balance: 3, fiatEquivalent: null }])
        .cryptoNgn,
    ).toBe(0);
  });
});
