/**
 * Turns an API constant into readable text — "TRANSFER_OUT" becomes
 * "Transfer out".
 */
export function humanise(value: string): string {
  const words = value.replace(/[_-]+/g, " ").trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}
