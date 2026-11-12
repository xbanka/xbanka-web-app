/**
 * Support requests go to the support inbox by email, sent from our server
 * (POST /api/support), so the user never leaves the app and the team gets
 * every request in one place with the account details attached.
 *
 * This file is shared by the browser and the server: it holds the topics,
 * the input limits and the text of the email.
 */

export const SUPPORT_TOPICS = [
  "Deposit",
  "Withdrawal",
  "Crypto",
  "Bill payment",
  "Account & verification",
  "Close account",
  "Something else",
] as const;

export type SupportTopic = (typeof SUPPORT_TOPICS)[number];

/** Topics the user picks on Help & Support. "Close account" is only sent
 *  from Settings, where closing the account lives. */
export const HELP_PAGE_TOPICS = SUPPORT_TOPICS.filter(
  (topic) => topic !== "Close account",
);

export const MAX_MESSAGE_LENGTH = 2000;

export const isSupportTopic = (value: unknown): value is SupportTopic =>
  typeof value === "string" &&
  (SUPPORT_TOPICS as readonly string[]).includes(value);

/** What the browser sends. Account details are not part of it: the server
 *  looks them up from the user's session so they can't be spoofed. */
export type SupportRequestBody = { topic: SupportTopic; message: string };

/** The account as the backend's /users/profile reports it. */
export type SupportAccount = {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
};

const fullName = (account: SupportAccount) =>
  [account.firstName, account.lastName].filter(Boolean).join(" ").trim();

/** Header lines must not carry line breaks (header injection). */
const oneLine = (text: string) => text.replace(/[\r\n]+/g, " ").trim();

export const buildSupportEmail = ({
  topic,
  message,
  account,
  sentAt = new Date(),
}: SupportRequestBody & { account: SupportAccount; sentAt?: Date }) => {
  const name = fullName(account);
  const subject = oneLine(
    `[${topic}] ${name || "Xbanka user"} · UID ${account.userId}`,
  );

  const details: [string, string | null | undefined][] = [
    ["UID", account.userId],
    ["Name", name || null],
    ["Email", account.email],
    ["Phone", account.phoneNumber],
    ["Topic", topic],
    ["Sent", sentAt.toUTCString()],
  ];

  const text = [
    ...details
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    message.trim(),
    "",
    "—",
    account.email
      ? "Reply to this email to answer the customer directly."
      : "This customer has no email on file; contact them by phone.",
  ].join("\n");

  return { subject, text };
};
