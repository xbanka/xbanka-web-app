/**
 * Support runs on WhatsApp: the help page builds the message and hands the
 * user to WhatsApp with it filled in, so nothing is stored on our side.
 *
 * The number is the support line below, which NEXT_PUBLIC_SUPPORT_WHATSAPP
 * can override, in international format (e.g. 2348012345678). Spaces,
 * dashes, brackets and a leading + or 00 are tolerated; a local 0-prefixed
 * Nigerian number is converted to +234.
 */
export const DEFAULT_SUPPORT_WHATSAPP = "2349039716418";

export const SUPPORT_TOPICS = [
  "Deposit",
  "Withdrawal",
  "Crypto",
  "Bill payment",
  "Account & verification",
  "Something else",
] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number];

/** Digits only, as wa.me expects; null when there is no usable number. */
export const normaliseWhatsAppNumber = (raw?: string | null): string | null => {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) digits = `234${digits.slice(1)}`;
  digits = digits.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
};

export const supportWhatsAppNumber = () =>
  normaliseWhatsAppNumber(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP) ??
  DEFAULT_SUPPORT_WHATSAPP;

/** The text the user sends; their UID lets support find the account. */
export const buildSupportMessage = ({
  topic,
  message,
  uid,
}: {
  topic: SupportTopic;
  message: string;
  uid?: string | null;
}) => {
  const lines = [`Hi Xbanka, I need help with: ${topic}`, message.trim()];
  if (uid) lines.push("", `UID: ${uid}`);
  return lines.join("\n");
};

export const whatsAppLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
