export interface fundWalletPayload {
  amount: number
  saveCard: boolean
}
export interface fundWalletSavedCardPayload {
  amount: number,
  savedCardId: string,
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