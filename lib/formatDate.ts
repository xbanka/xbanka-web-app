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