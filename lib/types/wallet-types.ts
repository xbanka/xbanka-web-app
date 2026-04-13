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

