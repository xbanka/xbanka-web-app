/**
 * Does a bank account name belong to the signed-in user?
 *
 * Nigerian banks return names in any order and case ("ADEYEMI OLUWASEUN
 * DANIEL" for a user whose profile says Oluwaseun Adeyemi), often with a
 * middle name the profile never saw, so the check is: every profile name
 * (first and last) must appear somewhere in the account name. Hyphenated and
 * apostrophised names are compared part by part.
 */
export type AccountNameMatch = "match" | "mismatch" | "unknown";

const tokens = (value: string | null | undefined) =>
  (value ?? "")
    .toUpperCase()
    .replace(/[^A-Z\s'-]/g, " ")
    .split(/[\s'-]+/)
    .filter(Boolean);

export const accountNameMatchesProfile = (
  accountName: string | null | undefined,
  profile: { firstName?: string | null; lastName?: string | null },
): AccountNameMatch => {
  const first = tokens(profile.firstName);
  const last = tokens(profile.lastName);
  const account = new Set(tokens(accountName));

  // Nothing to compare against yet (profile step not done, or no name resolved).
  if (first.length === 0 || last.length === 0 || account.size === 0) {
    return "unknown";
  }

  const hasAnyPart = (parts: string[]) => parts.some((part) => account.has(part));
  return hasAnyPart(first) && hasAnyPart(last) ? "match" : "mismatch";
};
