export interface fundWalletPayload {
  amount: number;
  saveCard: boolean;
}
export interface NombaInitiatePayload {
  bankCode: string;
  accountNumber: string;
  amount: number;
  narration?: string;
}
export interface NombaInitiateResponse {
  withdrawalToken: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  amount: number;
  currency: string;
  expiresAt: string;
}
export interface NombaConfirmPayload {
  withdrawalToken: string;
  pin: string;
}
export type NombaWithdrawalStatus = "PENDING" | "COMPLETED" | "FAILED";
export interface NombaWithdrawal {
  reference: string;
  status: NombaWithdrawalStatus;
  amount: number;
  currency: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
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

/**
 * POST /wallets/withdraw/crypto. To a saved wallet: currency, amount,
 * trustedWalletId and pin; the backend takes network and address from the
 * wallet. The free network + address form is refused once the backend turns
 * on ENFORCE_TRUSTED_WALLETS.
 */
export type WithdrawCryptoPayload =
  | {
      currency: string;
      amount: number;
      trustedWalletId: string;
      pin: string;
      narration?: string;
    }
  | {
      currency: string;
      network: string;
      address: string;
      amount: number;
      memo: string;
      narration: string;
    };

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
  bankCode: string;
}

export interface AddFundingAccountPayload {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface FundingAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  createdAt: string;
}

export interface XbankaFundingAccount {
  bankName: string;
  bankCode: string;
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
