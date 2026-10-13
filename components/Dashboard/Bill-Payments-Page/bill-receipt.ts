// Maps a bill payment onto the shared transaction receipt document, so an
// airtime/data purchase issues the same receipt (with PDF/image share) as any
// other transaction.

import type { ReceiptRow } from "@/components/ui/transaction-receipt-modal";
import type { TransactionReceiptData } from "@/lib/transactionReceipt";
import { formatDateTime } from "@/lib/formatDate";
import { humanise } from "@/lib/humanise";
import { BillPayment, MeterType } from "@/lib/types/bills-types";
import { formatNaira } from "./billers-data";

/** Checkout details the payment object doesn't carry itself — captured at the
 *  moment of payment so the receipt can name them later. */
export type BillReceiptContext = {
  /** Network for airtime/data; disco, cable or betting provider otherwise. */
  networkName?: string;
  phoneNumber?: string;
  planName?: string;
  meterNumber?: string;
  meterType?: MeterType;
  /** Smartcard / IUC number for cable, account id for betting. */
  customerId?: string;
};

const PRODUCT_LABELS: Record<BillPayment["product"], string> = {
  AIRTIME: "Airtime purchase",
  DATA: "Data bundle",
  ELECTRICITY: "Electricity payment",
  CABLE_TV: "Cable TV subscription",
  BETTING: "Betting wallet top-up",
};

export function buildBillReceipt(
  payment: BillPayment,
  context: BillReceiptContext = {},
): TransactionReceiptData {
  const amount = formatNaira(payment.amount);

  const rows: ReceiptRow[] = [
    {
      label: "Transaction type",
      value: PRODUCT_LABELS[payment.product] ?? humanise(payment.product),
    },
    { label: "Status", value: humanise(payment.status) },
    { label: "Amount", value: amount, accent: true },
  ];

  if (context.networkName)
    rows.push({
      label:
        payment.product === "AIRTIME" || payment.product === "DATA"
          ? "Network"
          : "Provider",
      value: context.networkName,
    });
  if (context.phoneNumber)
    rows.push({ label: "Phone number", value: context.phoneNumber });
  if (context.planName) rows.push({ label: "Plan", value: context.planName });
  if (context.customerId)
    rows.push({
      label: payment.product === "CABLE_TV" ? "Smartcard / IUC" : "Account ID",
      value: context.customerId,
    });
  if (context.meterNumber)
    rows.push({ label: "Meter number", value: context.meterNumber });
  if (context.meterType)
    rows.push({
      label: "Meter type",
      value: context.meterType === "PREPAID" ? "Prepaid" : "Postpaid",
    });
  if (payment.customerName)
    rows.push({ label: "Customer", value: payment.customerName });
  if (payment.token) rows.push({ label: "Token", value: payment.token });
  if (payment.units) rows.push({ label: "Units", value: payment.units });
  if (payment.note?.trim())
    rows.push({ label: "Description", value: payment.note });

  rows.push({ label: "Date & Time", value: formatDateTime(payment.createdAt) });
  rows.push({ label: "Reference", value: payment.reference });

  return {
    heading: "Amount paid",
    headlineAmount: amount,
    rows,
    reference: payment.reference,
    status: payment.status,
  };
}
