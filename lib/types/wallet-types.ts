export interface fundWalletPayload {
  amount: number;
  saveCard: boolean;
}
export interface sendWalletPayload {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  amount: number;
  narration: string;
}
export interface fundWalletSavedCardPayload {
  amount: number;
  savedCardId: string;
}

export interface fundWalletBankSavedCardPayload {
  amount: number;
  mandateId: string;
}

export interface fundWalletBankPayload {
  accountNumber: string;
  bankCode: string;
}

export interface WithdrawCryptoPayload {
  currency: string;
  network: string;
  address: string;
  amount: number;
  memo: string;
  narration: string;
}

export interface DeleteFiatWalletBankSavedCardPayload {
  mandateId: string;
}
export interface GenerateDepositAddressPayload {
  currency: string;
  network: string;
}

export interface WalletAccount {
  id: string;
  walletId: string;
  provider: string;
  providerRef: string;
  network: string;
  createdAt: string; // Or Date if you plan to parse it
  updatedAt: string;

  // These fields are null in your sample, likely optional strings
  accountName: string | null;
  address: string | null;
  bankCode: string | null;
  bankName: string | null;
  memo: string | null;
}

export interface AddBankAccountPayload {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Wallet {
  type: "FIAT" | "CRYPTO";
  balance: number;
  fiatEquivalent?: {
    amount: number;
    currency: string;
    rate: number;
  } | null;
  usdEquivalent?: {
    amount: number;
    currency: string;
    rate: number;
  } | null;
};
