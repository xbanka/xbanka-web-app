/**
 * Once-only state for the product tours.
 *
 * Each section of the app (dashboard, wallet, crypto, ...) has its own short
 * tour, so the flag is keyed by tour as well as by user. The backend has no
 * field for this yet, so it lives in localStorage, scoped per user (like
 * `dismissedNotifications`) so one account's tour does not silence another's
 * on a shared device, and versioned so a redesigned tour can be shown again
 * by bumping TOUR_VERSION.
 *
 * Consequence: "once" means once per browser. When the backend adds something
 * like `completedTours` to the profile, read and write that here and nothing
 * else needs to change.
 */
const STORAGE_KEY = "xbanka:product-tour";

export const TOUR_VERSION = 1;

export const tourStorageKey = (userId: string, tourId: string) =>
  `${STORAGE_KEY}:v${TOUR_VERSION}:${userId}:${tourId}`;

export const hasSeenTour = (userId: string, tourId: string): boolean => {
  if (typeof window === "undefined") return true;

  try {
    return window.localStorage.getItem(tourStorageKey(userId, tourId)) !== null;
  } catch {
    // Storage blocked (private mode, quota): better never to show the tour
    // than to show it on every visit.
    return true;
  }
};

export const markTourSeen = (userId: string, tourId: string) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      tourStorageKey(userId, tourId),
      new Date().toISOString(),
    );
  } catch {
    // Storage unavailable — the tour simply shows again next visit.
  }
};
