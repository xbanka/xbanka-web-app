/**
 * Local dismissal of notifications.
 *
 * The API has no delete/dismiss/archive route — every shape returns 404 while
 * real routes return 401 — so dismissals are held in localStorage instead.
 *
 * Consequences worth knowing: a dismissal is per-browser, so the notification
 * reappears on another device or after the user clears site data, and the
 * server's unread count still includes it.
 *
 * When the backend ships `DELETE /notifications/:id`, replace the calls to
 * these helpers in `NotificationsModal` with a mutation and delete this file —
 * the component API (`onDismiss(id)`) is already the right shape.
 */
const STORAGE_KEY = "xbanka:dismissed-notifications";

/** Scoped per user so dismissals don't leak across accounts on a shared device. */
const scopedKey = (userId?: string) =>
  userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;

export const getDismissedNotifications = (userId?: string): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(scopedKey(userId));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    // Corrupt or unavailable storage (private mode, quota) — treat as none.
    return [];
  }
};

const persist = (ids: string[], userId?: string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(scopedKey(userId), JSON.stringify(ids));
  } catch {
    // Storage unavailable — the dismissal still applies for this session.
  }
};

export const dismissNotification = (id: string, userId?: string): string[] => {
  const next = Array.from(new Set([...getDismissedNotifications(userId), id]));
  persist(next, userId);
  return next;
};

export const restoreNotification = (id: string, userId?: string): string[] => {
  const next = getDismissedNotifications(userId).filter((item) => item !== id);
  persist(next, userId);
  return next;
};
