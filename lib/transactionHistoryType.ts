import { TransactionTypes } from "./types/transaction-types";

export const transactionHistoryType = (
  tableType: "CRYPTO" | "FIAT",
  transactions: TransactionTypes[]
) => {
  return transactions.filter(
    (tx) => tx.category?.toLowerCase() === tableType.toLowerCase()
  );
};