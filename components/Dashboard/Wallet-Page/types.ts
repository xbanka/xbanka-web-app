type WalletTab = "total" | "fiat" | "crypto";

type FundStep = "select" | "bank" | "card";
type FundMethod = "bank" | "card" | null;

type CryptoSymbol = 'ETH' | 'BTC' | 'USDT';

export interface FiatValue {
  currency: string; // e.g., "NGN"
  amount: number;
  rate: number;     // e.g., 1426
}

export interface WalletAddress {
  id: string;
  walletId: string;
  provider: string;
  providerRef: string;
  network: string;
  createdAt: string;
  updatedAt: string;
  accountName: string | null;
  address: string | null;
  bankCode: string | null;
  bankName: string | null;
  memo: string | null;
}

export interface UserWallet {
  id: string;
  userId: string;
  currency: string;      // e.g., "ETH"
  type: "CRYPTO" | "FIAT"; 
  balance: number;
  fiatEquivalent: FiatValue | null;
  createdAt: string;
  updatedAt: string;
  addresses: WalletAddress[]; // Array of the interface above
}

/**
 * Maps a cryptocurrency symbol to its full descriptive header name.
 * @param symbol - The currency code (e.g., 'BTC')
 * @returns The full name of the currency or a fallback string
 */
export const getCurrencyHeader = (symbol: string): string => {
  const symbolMap: Record<string, string> = {
    ETH: 'Ethereum',
    BTC: 'Bitcoin',
    USDT: 'Tether',
  };

  // Returns the mapped name, or the original symbol if not found
  return symbolMap[symbol.toUpperCase()] ?? symbol;
};