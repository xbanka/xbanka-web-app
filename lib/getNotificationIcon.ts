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