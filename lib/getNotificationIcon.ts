import {
  ArrowDown,
  ArrowUp,
  RefreshCw,
  ShieldCheck,
  Bell,
} from "lucide-react";

export const getNotificationIcon = (notification: any) => {
  const title = notification.title?.toLowerCase() ?? "";
  const message = notification.message?.toLowerCase() ?? "";

  const content = `${title} ${message}`;

  if (content.includes("withdrawal")) {
    return ArrowUp;
  }

  if (
    content.includes("deposit") ||
    content.includes("received") ||
    content.includes("credited") ||
    content.includes("funded")
  ) {
    return ArrowDown;
  }

  if (
    content.includes("swap") ||
    content.includes("convert") ||
    content.includes("exchange")
  ) {
    return RefreshCw;
  }

  if (
    content.includes("security") ||
    content.includes("login")
  ) {
    return ShieldCheck;
  }

  return Bell;
};

// Classify a notification into the All/Transactions/Activities tabs.
// Money-movement notifications are "transactions"; everything else
// (verification, security, logins, account updates) is an "activity".
export const getNotificationCategory = (
  notification: any,
): "transactions" | "activities" => {
  const content =
    `${notification.type ?? ""} ${notification.title ?? ""} ${notification.message ?? ""}`.toLowerCase();

  const transactionKeywords = [
    "deposit",
    "withdraw",
    "received",
    "sent",
    "sold",
    "bought",
    "buy",
    "sell",
    "payment",
    "transfer",
    "funds",
    "convert",
    "swap",
    "credited",
    "debited",
    "transaction",
  ];

  return transactionKeywords.some((k) => content.includes(k))
    ? "transactions"
    : "activities";
};

export const getNotificationColor = (notification: any) => {
  const title = notification.title?.toLowerCase() ?? "";
  const message = notification.message?.toLowerCase() ?? "";

  const content = `${title} ${message}`;

  if (content.includes("withdrawal")) {
    return "bg-red-900/30 text-red-400";
  }

  if (
    content.includes("deposit") ||
    content.includes("received") ||
    content.includes("credited") ||
    content.includes("funded")
  ) {
    return "bg-green-900/30 text-green-400";
  }

  if (
    content.includes("swap") ||
    content.includes("convert")
  ) {
    return "bg-green-900/30 text-green-400";
  }

  return "bg-green-900/30 text-green-400";
};