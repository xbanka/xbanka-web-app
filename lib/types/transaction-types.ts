export type TransactionMetadata = {
  recipientId?: string;
  [key: string]: any;
};

type Currency = "NGN";

type TransactionType =
  | "DEPOSIT"
  | "TRANSFER_OUT"
  | "WITHDRAWAL"
  | "TRANSFER_IN";
type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface TransactionTypes {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  reference: string;
  note: string;
  metadata: string | null;
  createdAt: string;
  category: "FIAT" | "CRYPTO" | "GIFTCARD";
}
