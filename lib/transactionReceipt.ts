import type { ReceiptRow } from "@/components/ui/transaction-receipt-modal";
import { formatCurrencyAmount } from "./formatCurrencyAmount";
import { formatDateTime } from "./formatDate";
import { humanise } from "./humanise";
import { parseMetadata } from "./parsedMetadata";
import { TransactionTypes } from "./types/transaction-types";

export interface TransactionReceiptData {
  heading: string;
  headlineAmount: string;
  rows: ReceiptRow[];
  reference?: string;
  status: string;
}

/** Types that move money towards the user — everything else reads as an outflow. */
const INFLOW_TYPES = ["DEPOSIT", "TRANSFER_IN", "CREDIT", "REFUND", "BUY"];

/**
 * Metadata keys worth putting on a receipt, in the order they should appear.
 * Anything else the API attaches (provider payloads, internal ids) is skipped
 * rather than dumped onto the document.
 */
const METADATA_FIELDS: { key: string; label: string }[] = [
  // Name keys are listed before any other identifier for the same label, so a
  // receipt shows the account holder's name rather than their email.
  { key: "senderName", label: "Sender" },
  { key: "senderUsername", label: "Sender" },
  { key: "recipientName", label: "Recipient" },
  { key: "recipientUsername", label: "Recipient" },
  { key: "receiverName", label: "Recipient" },
  { key: "recipient", label: "Recipient" },
  { key: "username", label: "Username" },
  { key: "accountName", label: "Account name" },
  { key: "accountNumber", label: "Account number" },
  { key: "bankName", label: "Bank" },
  { key: "bank", label: "Bank" },
  { key: "recipientId", label: "Recipient ID" },
  { key: "network", label: "Network" },
  { key: "walletAddress", label: "Wallet address" },
  { key: "txHash", label: "Transaction hash" },
  // Electricity bill payments
  { key: "meterNumber", label: "Meter number" },
  { key: "customerName", label: "Customer" },
  { key: "token", label: "Token" },
  { key: "rate", label: "Rate" },
  { key: "fee", label: "Fee" },
  { key: "channel", label: "Channel" },
];

const isPrintable = (value: unknown): value is string | number =>
  (typeof value === "string" && value.trim() !== "") ||
  (typeof value === "number" && Number.isFinite(value));

/** Electricity units as issued by the disco, or undefined when they aren't —
 *  providers send placeholders like 0, "0" or "null" before units are known. */
export const availableUnits = (value: unknown): string | undefined => {
  if (!isPrintable(value)) return undefined;
  const units = String(value).trim();
  if (/^(null|undefined|n\/a)$/i.test(units)) return undefined;
  const numeric = Number(units);
  if (!Number.isNaN(numeric) && numeric <= 0) return undefined;
  return units;
};

/**
 * Builds the receipt for a transaction already in the user's history, so a
 * past transaction shows the same document as the one issued at the moment it
 * was made — with its own status rather than an assumed "Successful".
 */
export function buildTransactionReceipt(
  tx: TransactionTypes,
): TransactionReceiptData {
  const amount = formatCurrencyAmount(tx.amount, tx.currency);
  const isInflow = INFLOW_TYPES.includes(tx.type?.toUpperCase?.() ?? "");
  const metadata = parseMetadata(tx.metadata) as Record<string, unknown> | null;

  const rows: ReceiptRow[] = [
    { label: "Transaction type", value: humanise(tx.type ?? "—") },
    { label: "Status", value: humanise(tx.status ?? "—") },
    { label: "Amount", value: amount, accent: true },
  ];

  if (tx.category === "CRYPTO" && tx.currency) {
    rows.push({ label: "Asset", value: tx.currency });
  }

  // Only the first match for a label wins — the API sends `recipientName` or
  // `recipient`, not both, and a duplicated label would break the row keys.
  const seen = new Set(rows.map((row) => row.label));
  METADATA_FIELDS.forEach(({ key, label }) => {
    const value = metadata?.[key];
    if (!isPrintable(value) || seen.has(label)) return;

    seen.add(label);
    rows.push({
      label,
      value:
        key === "fee" && typeof value === "number"
          ? formatCurrencyAmount(value, tx.currency)
          : String(value),
    });
  });

  const units = availableUnits(metadata?.units);
  if (units) rows.push({ label: "Units", value: units });

  if (tx.note?.trim()) {
    rows.push({ label: "Note", value: tx.note });
  }

  rows.push({ label: "Date & Time", value: formatDateTime(tx.createdAt) });
  rows.push({ label: "Reference", value: tx.reference || tx.id || "—" });

  return {
    heading: isInflow ? "Amount received" : "Amount sent",
    headlineAmount: amount,
    rows,
    reference: tx.reference || tx.id,
    status: tx.status,
  };
}
