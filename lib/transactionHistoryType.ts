import { TransactionTypes } from "./types/transaction-types";

export const transactionHistoryType = (tableType: "CRYPTO" | "FIAT", transactions: TransactionTypes[]) => {
    const fiatTransactions = transactions.filter((tx: TransactionTypes) =>
        tableType ? tx.category === tableType : tx,
      );
      return fiatTransactions
}