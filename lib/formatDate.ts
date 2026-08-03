export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short", // e.g., Sep
    day: "2-digit",
  });
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(date: string) {
  const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Infinity, unit: "year" },
  ];

  let duration = diff;

  for (let division of divisions) {
    if (duration < division.amount) {
      return rtf.format(-Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
}

/**
 * Formats an ISO timestamp for display — "2026-07-27T13:11:47.769Z" becomes
 * "Jul 27, 2026 at 1:11 PM" in the viewer's local timezone.
 *
 * Unlike `formatTransactionDate`, this accepts the raw string the API returns
 * and degrades to the original value rather than rendering "Invalid Date".
 */
export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return typeof value === "string" ? value : "—";

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} at ${timePart}`;
};

export const formatTransactionDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit", 
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};