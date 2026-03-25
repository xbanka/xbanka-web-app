export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short", // e.g., Sep
    day: "2-digit",
  });
}