/**
 * Preferences on the Settings page that don't need the backend: the language
 * list, how notifications are sorted into the categories users switch on and
 * off, masking amounts in notification text, and the inactivity check.
 */

export type Language = {
  code: string;
  /** The language's own name, which is how people look for it. */
  name: string;
  /** The English name, shown underneath for everyone else. */
  english: string;
  /** Whether Xbanka is translated into it yet. */
  available: boolean;
};

export const LANGUAGES: Language[] = [
  { code: "en-NG", name: "English (Nigeria)", english: "English (Nigeria)", available: true },
  { code: "yo", name: "Yorùbá", english: "Yoruba", available: false },
  { code: "ig", name: "Asụsụ Igbo", english: "Igbo", available: false },
  { code: "ha", name: "Hausa", english: "Hausa", available: false },
  { code: "pcm", name: "Naijá", english: "Nigerian Pidgin", available: false },
  { code: "sw", name: "Kiswahili", english: "Swahili", available: false },
  { code: "am", name: "አማርኛ", english: "Amharic", available: false },
  { code: "zu", name: "isiZulu", english: "Zulu", available: false },
  { code: "xh", name: "isiXhosa", english: "Xhosa", available: false },
  { code: "af", name: "Afrikaans", english: "Afrikaans", available: false },
  { code: "tw", name: "Twi", english: "Twi (Akan)", available: false },
  { code: "wo", name: "Wolof", english: "Wolof", available: false },
  { code: "so", name: "Soomaali", english: "Somali", available: false },
  { code: "om", name: "Afaan Oromoo", english: "Oromo", available: false },
  { code: "rw", name: "Ikinyarwanda", english: "Kinyarwanda", available: false },
  { code: "ln", name: "Lingála", english: "Lingala", available: false },
  { code: "sn", name: "chiShona", english: "Shona", available: false },
  { code: "fr-AF", name: "Français", english: "French (Africa)", available: false },
  { code: "ar-AF", name: "العربية", english: "Arabic (North Africa)", available: false },
];

export const DEFAULT_LANGUAGE = "en-NG";

export const languageByCode = (code: string): Language =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

export const NOTIFICATION_CATEGORIES = [
  { id: "received", label: "Money received", hint: "Deposits and transfers into your wallets" },
  { id: "sent", label: "Money sent and withdrawals", hint: "Including when a withdrawal is returned" },
  { id: "bills", label: "Bill payments", hint: "Airtime, data, TV and electricity tokens" },
  { id: "crypto", label: "Crypto trades", hint: "Buys, sells and swaps" },
  { id: "security", label: "Security", hint: "New sign-ins, PIN and password changes" },
  { id: "news", label: "News and offers", hint: "New features and promotions, rarely" },
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number]["id"];
export type Channel = "inApp" | "email";
export type NotificationPrefs = Record<NotificationCategory, Record<Channel, boolean>>;

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  received: { inApp: true, email: true },
  sent: { inApp: true, email: true },
  bills: { inApp: true, email: true },
  crypto: { inApp: true, email: false },
  security: { inApp: true, email: true },
  news: { inApp: false, email: false },
};

/** Security alerts by email can't be switched off: they're how a takeover gets noticed. */
export const isLocked = (category: NotificationCategory, channel: Channel) =>
  category === "security" && channel === "email";

/** Which category a notification belongs to, guessed from its text. */
export const notificationCategory = (n: {
  type?: string | null;
  title?: string | null;
  message?: string | null;
}): NotificationCategory => {
  const text = `${n.type ?? ""} ${n.title ?? ""} ${n.message ?? ""}`.toLowerCase();
  if (/(security|sign[\s-]?in|log[\s-]?in|password|\bpin\b|2fa|two[\s-]factor|device|session)/.test(text)) return "security";
  if (/(airtime|data bundle|electricity|token|cable|\btv\b|dstv|gotv|startimes|bill)/.test(text)) return "bills";
  if (/(crypto|btc|eth|usdt|usdc|bitcoin|swap|\bbuy\b|\bsell\b|\btrade)/.test(text)) return "crypto";
  if (/(withdraw|sent|transfer to|debit|payout)/.test(text)) return "sent";
  if (/(deposit|received|funded|credit|incoming)/.test(text)) return "received";
  if (/(promo|offer|new feature|announcement|news)/.test(text)) return "news";
  return "received";
};

const MASK = "••••";

/**
 * Replaces money amounts in notification text, so a glance at the screen or a
 * screenshot doesn't give away what moved. Covers ₦/$/€/£ amounts, "NGN 5,000",
 * and crypto amounts like "0.0012 BTC".
 */
export const maskAmounts = (text: string): string =>
  text
    .replace(/[₦$€£]\s?\d[\d,]*(?:\.\d+)?/g, MASK)
    .replace(/\b(?:NGN|USD|EUR|GBP)\s?\d[\d,]*(?:\.\d+)?/gi, MASK)
    .replace(/\b\d[\d,]*(?:\.\d+)?\s?(?:NGN|USD|EUR|GBP|naira)\b/gi, MASK)
    .replace(/\b\d[\d,]*(?:\.\d+)?\s?(?:BTC|ETH|USDT|USDC|BNB|SOL|TRX|LTC|DOGE|XRP)\b/g, MASK);

export const AUTO_SIGN_OUT_OPTIONS = [
  { minutes: 0, label: "Never" },
  { minutes: 5, label: "5 minutes" },
  { minutes: 15, label: "15 minutes" },
  { minutes: 30, label: "30 minutes" },
  { minutes: 60, label: "1 hour" },
] as const;

/** Whether the user has been away longer than their auto sign-out allows. 0 means never. */
export const isIdleTooLong = (lastActivity: number, now: number, minutes: number) =>
  minutes > 0 && now - lastActivity >= minutes * 60_000;
