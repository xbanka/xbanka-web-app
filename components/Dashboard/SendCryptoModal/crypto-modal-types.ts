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
}