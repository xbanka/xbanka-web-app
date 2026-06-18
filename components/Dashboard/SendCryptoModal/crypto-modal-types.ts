// Flat transaction fee applied to crypto sends (in the asset's currency unit).
export const TRANSACTION_FEE = 1;

export interface WalletSuccessState {
  id: string;
  walletId: string;
  network: "BTC" | string; // Narrowed if you only support specific networks
  provider: "OBIEX" | string;
  providerRef: string;
  accountName: string | null;
  address: string | null;
  bankCode: string | null;
  bankName: string | null;
  memo: string | null;
  createdAt: string; // Or Date if you parse it
  updatedAt: string;
  amount: number,
  currency: string;
  // status: "PENDING" | "COMPLETED" | "FAILED";
  status: string;
  // type: "DEPOSIT" | "WITHDRAWAL";
  type: string;
  note: string | null;
  reference: string;
  userId: string;
}
