import { Notification } from "./types/notification-types";

type NotificationLike = Pick<Notification, "type" | "title" | "message">;

const CREDIT_PATTERN = /(deposit|credited|funded|top[\s-]?up)/i;
// "received" on its own also covers "your request was received", so it only
// counts when money is mentioned alongside it.
const RECEIVED_MONEY_PATTERN =
  /received[\s\S]*(₦|ngn|naira|usdt|usdc|btc|eth|\$|wallet|funds?)|(₦|ngn|naira|usdt|usdc|btc|eth|\$|wallet|funds?)[\s\S]*received/i;
const OUTGOING_PATTERN =
  /(withdraw|debited|sent|transfer out|payment (sent|made)|purchase|bought)/i;

const notificationText = (notification: NotificationLike) =>
  `${notification.type ?? ""} ${notification.title ?? ""} ${notification.message ?? ""}`;

/** True for a notification that says money landed in one of the user's wallets. */
export const isDepositNotification = (notification: NotificationLike) => {
  const content = notificationText(notification);
  if (OUTGOING_PATTERN.test(content)) return false;
  return CREDIT_PATTERN.test(content) || RECEIVED_MONEY_PATTERN.test(content);
};

/**
 * The unread deposit notifications that were not in the feed last time we
 * looked, newest first. Used to toast a deposit the moment it shows up.
 */
export const findNewDeposits = (
  seenIds: Iterable<string>,
  notifications: Notification[] | null | undefined,
): Notification[] => {
  const seen = new Set(seenIds);
  return (Array.isArray(notifications) ? notifications : [])
    .filter(
      (notification) =>
        !seen.has(notification.id) &&
        !notification.isRead &&
        isDepositNotification(notification),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};
