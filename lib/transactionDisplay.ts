import { formatCurrencyAmount } from "./formatCurrencyAmount";
import { humanise } from "./humanise";
import type { TransactionTypes } from "./types/transaction-types";

/** Types that move money towards the user; everything else is an outflow. */
const INFLOW_TYPES = new Set(["DEPOSIT", "TRANSFER_IN", "CREDIT", "REFUND"]);

export type TransactionGroup = "fiat" | "crypto" | "bills" | "giftcards";

export const isInflow = (tx: Pick<TransactionTypes, "type">) =>
  INFLOW_TYPES.has(tx.type?.toUpperCase?.() ?? "");

/** Which chip a row wears. Bills are fiat by category but read as their own kind. */
export const transactionGroup = (
  tx: Pick<TransactionTypes, "type" | "category">,
): TransactionGroup => {
  if (tx.type === "BILL_PAYMENT") return "bills";
  if (tx.category === "CRYPTO") return "crypto";
  if (tx.category === "GIFTCARD") return "giftcards";
  return "fiat";
};

export const GROUP_LABEL: Record<TransactionGroup, string> = {
  fiat: "Fiat",
  crypto: "Crypto",
  bills: "Bills",
  giftcards: "Gift cards",
};

/**
 * The row's headline and the line under it. The note is the most specific
 * thing the API gives ("MTN airtime for 0810…"), so it leads when present.
 */
export const transactionTitle = (
  tx: Pick<TransactionTypes, "type" | "note" | "category">,
): { title: string; subtitle: string } => {
  const kind = humanise(tx.type ?? "Transaction");
  const note = tx.note?.trim();
  if (note) return { title: note, subtitle: kind };
  return { title: kind, subtitle: GROUP_LABEL[transactionGroup(tx)] };
};

/** "+₦5,000" for money in, "−₦2,000" for money out (a true minus sign). */
export const signedAmount = (
  tx: Pick<TransactionTypes, "type" | "amount" | "currency">,
) => {
  const value = formatCurrencyAmount(Math.abs(Number(tx.amount)), tx.currency);
  return `${isInflow(tx) ? "+" : "−"}${value}`;
};

export type PeriodSummary = {
  moneyIn: number;
  moneyOut: number;
  pending: number;
  countIn: number;
  countOut: number;
  countPending: number;
};

/**
 * Naira totals for the period starting at `since`. Crypto amounts are in
 * their own currencies and cannot be added to naira, so only NGN counts.
 * Failed transactions moved no money and are left out.
 */
export const summarise = (
  txs: TransactionTypes[],
  since: Date,
): PeriodSummary => {
  const summary: PeriodSummary = {
    moneyIn: 0,
    moneyOut: 0,
    pending: 0,
    countIn: 0,
    countOut: 0,
    countPending: 0,
  };
  for (const tx of txs) {
    if (tx.currency !== "NGN") continue;
    if (new Date(tx.createdAt).getTime() < since.getTime()) continue;
    const status = tx.status?.toUpperCase();
    if (status === "FAILED") continue;
    const amount = Math.abs(Number(tx.amount)) || 0;
    if (status === "PENDING") {
      summary.pending += amount;
      summary.countPending += 1;
      continue;
    }
    if (isInflow(tx)) {
      summary.moneyIn += amount;
      summary.countIn += 1;
    } else {
      summary.moneyOut += amount;
      summary.countOut += 1;
    }
  }
  return summary;
};
