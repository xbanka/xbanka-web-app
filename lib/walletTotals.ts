import { Wallet } from "./types/wallet-types";

export type WalletTotals = {
  /** Naira held across the FIAT wallets. */
  fiatNgn: number;
  /** Crypto balances as the API reports them (USD-pegged, like sumCryptoBalance). */
  cryptoUsd: number;
  /** Naira value of the crypto wallets, from the API's fiatEquivalent. */
  cryptoNgn: number;
  /** Everything in naira: fiat plus the crypto's naira value. */
  totalNgn: number;
};

/**
 * Split a wallet list into fiat and crypto totals.
 *
 * Only CRYPTO wallets count towards the crypto figures: a FIAT wallet's
 * usdEquivalent is the same naira seen in dollars, not a crypto holding, which
 * is why the earlier Fiat/Crypto chips showed a fresh naira deposit as crypto.
 */
export const getWalletTotals = (
  wallets: Wallet[] | null | undefined,
): WalletTotals => {
  const list = Array.isArray(wallets) ? wallets : [];
  let fiatNgn = 0;
  let cryptoUsd = 0;
  let cryptoNgn = 0;

  for (const wallet of list) {
    if (wallet.type === "FIAT") {
      fiatNgn += wallet.balance || 0;
    } else if (wallet.type === "CRYPTO") {
      cryptoUsd += wallet.balance || 0;
      cryptoNgn += wallet.fiatEquivalent?.amount || 0;
    }
  }

  return { fiatNgn, cryptoUsd, cryptoNgn, totalNgn: fiatNgn + cryptoNgn };
};
