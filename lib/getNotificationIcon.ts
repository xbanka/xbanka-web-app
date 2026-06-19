import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  BadgeCheck,
  Clock,
  XCircle,
  CheckCircle2,
  Bell,
} from "lucide-react";

const notificationText = (notification: any) =>
  `${notification.type ?? ""} ${notification.title ?? ""} ${notification.message ?? ""}`.toLowerCase();

// Progress/status of a transaction or activity, inferred from its content.
export const getNotificationStatus = (
  notification: any,
): "pending" | "failed" | "success" | "neutral" => {
  const content = notificationText(notification);

  if (
    /(failed|rejected|declined|unsuccessful|reversed|cancell?ed|error)/.test(
      content,
    )
  ) {
    return "failed";
  }

  if (
    /(pending|processing|in[\s_-]?progress|ongoing|initiated|submitted|awaiting|under review|queued)/.test(
      content,
    )
  ) {
    return "pending";
  }

  if (
    /(success|complete|completed|done|settled|confirmed|verified|approved|received|credited|sent|deposit)/.test(
      content,
    )
  ) {
    return "success";
  }

  return "neutral";
};

export const getNotificationIcon = (notification: any) => {
  const content = notificationText(notification);
  const status = getNotificationStatus(notification);

  // Progress takes priority — failed/pending states get their own icon.
  if (status === "failed") return XCircle;
  if (status === "pending") return Clock;

  // Otherwise show a type/direction-specific icon.
  if (/withdraw|sent|transfer out|debited/.test(content)) return ArrowUpRight;
  if (/deposit|received|credited|funded/.test(content)) return ArrowDownLeft;
  if (/swap|convert|exchange/.test(content)) return RefreshCw;
  if (/verif|bvn|kyc|identity|document/.test(content)) return BadgeCheck;
  if (/login|device|security|password/.test(content)) return ShieldCheck;
  if (status === "success") return CheckCircle2;

  return Bell;
};

// Classify a notification into the All/Transactions/Activities tabs.
// Money-movement notifications are "transactions"; everything else
// (verification, security, logins, account updates) is an "activity".
export const getNotificationCategory = (
  notification: any,
): "transactions" | "activities" => {
  const content = notificationText(notification);

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
  const status = getNotificationStatus(notification);

  // Color reflects progress/status.
  switch (status) {
    case "success":
      // Brand green-cyan for completed transactions/activities.
      return "bg-Green/15 text-Green";
    case "failed":
      return "bg-red-900/30 text-red-400";
    case "pending":
      return "bg-yellow-900/30 text-yellow-400";
    default:
      // Neutral / informational.
      return "bg-blue-900/30 text-blue-400";
  }
};
