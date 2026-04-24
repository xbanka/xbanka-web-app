type WalletTab = "total" | "fiat" | "crypto";

type CryptoSymbol = 'ETH' | 'BTC' | 'USDT';

type FundMethod = "bank" | "card" | null;
export type FundStep =
  | "select_method"
  | "select_bank"
  | "enter_amount_bank"
  | "confirm_bank"
  | "enter_pin"
  | "processing"
  | "success"
  | "select_card"
  | "enter_amount_card"
  | "confirm_card"
  | "add_new_bank"
  | "add_new_card";
 
export interface AddFundsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

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

export type SendStep =
  | "select_asset"      // NEW – step 1
  | "recipient"         // step 2
  | "select_network"    // step 3
  | "enter_amount"      // step 4
  | "confirm"           // step 5
  | "enter_pin"
  | "processing"
  | "success";

export interface SendCryptoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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