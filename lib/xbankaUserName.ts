/**
 * The shape `/users/search` returns, narrowed to what naming needs. Both the
 * fiat and crypto recipient pickers declare their own `XbankaUser`, so this is
 * typed structurally rather than against either one.
 */
export interface NameableXbankaUser {
  id: string;
  /**
   * Computed server-side: "First Last", or whichever single name exists, and
   * the user's email when the profile carries neither.
   */
  username?: string | null;
  profile?: { firstName?: string | null; lastName?: string | null } | null;
}

/**
 * The name to show for an XBanka user, and the one carried into the transfer,
 * the success screen and the receipt.
 *
 * `username` is the API's own answer and is used as-is. The profile and UID
 * fallbacks behind it only cover a response that predates that field — without
 * them, building the name from the profile unguarded renders the literal
 * string "undefined undefined" for a user who has no profile.
 */
export function xbankaUserName(user: NameableXbankaUser): string {
  const username = user.username?.trim();
  if (username) return username;

  const fullName = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user.id;
}
