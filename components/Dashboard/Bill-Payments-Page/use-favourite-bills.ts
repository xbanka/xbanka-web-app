"use client";

// Payments the user saved so they can repeat them in one tap. There is no
// favourites route on the API yet, so these live in the browser — per device,
// and never anything secret: a biller, what was bought and the account it was
// bought for. Amounts are deliberately not saved; every payment is priced
// afresh by the API.
//
// Backed by useSyncExternalStore rather than component state so that every
// caller shares one list: saving inside the checkout modal updates the
// Favourites row on the page behind it, and other tabs follow along.

import { useCallback, useSyncExternalStore } from "react";
import type { MeterType } from "@/lib/types/bills-types";

const STORAGE_KEY = "xbanka:favourite-bills";
/** Old entries fall off the end rather than growing the row forever. */
const MAX_FAVOURITES = 12;

export type FavouriteBill = {
  /** `kind:code:account` — stable, so saving the same payment twice updates
   *  the entry in place instead of duplicating it. */
  id: string;
  kind: "network" | "disco" | "cable" | "betting";
  /** The code the API expects back (network, disco, cableTvType, provider). */
  code: string;
  /** Provider display name, e.g. "MTN" or "Eko Electric (EKEDC)". */
  providerName: string;
  /** Our biller id, used to find the logo. */
  billerId: string;
  /** What was bought: "Airtime", "Data", "Prepaid meter"… */
  label: string;
  /** The account paid: phone number, meter number, smartcard or account id. */
  account: string;
  /** Betting pays an account id and a phone number, so it carries both. */
  phoneNumber?: string;
  product?: "AIRTIME" | "DATA";
  meterType?: MeterType;
  savedAt: string;
};

export const favouriteId = (kind: string, code: string, account: string) =>
  `${kind}:${code}:${account}`.toLowerCase();

const EMPTY: FavouriteBill[] = [];

// getSnapshot has to return the same reference until the data really changes,
// or React re-renders forever — so the parsed list is cached against the raw
// string it came from.
let cachedRaw: string | null = null;
let cached: FavouriteBill[] = EMPTY;

const listeners = new Set<() => void>();

const readRaw = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage.
    return null;
  }
};

const getSnapshot = (): FavouriteBill[] => {
  const raw = readRaw();
  if (raw === cachedRaw) return cached;

  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    // Anything hand-edited or written by an older build is dropped rather
    // than rendered half-populated.
    cached = Array.isArray(parsed)
      ? parsed.filter((f): f is FavouriteBill => !!f?.id && !!f?.code)
      : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
};

/** There is no localStorage while rendering on the server. */
const getServerSnapshot = (): FavouriteBill[] => EMPTY;

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // `storage` only fires in *other* tabs, so same-tab writes notify directly.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
};

const write = (next: FavouriteBill[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Saving is a convenience — a blocked or full store must not break the
    // payment the user is in the middle of.
  }
  listeners.forEach((notify) => notify());
};

export function useFavouriteBills() {
  const favourites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isFavourite = useCallback(
    (id: string) => favourites.some((f) => f.id === id),
    [favourites],
  );

  /** Adds or removes the entry; returns true when it is now saved. */
  const toggle = useCallback(
    (fav: FavouriteBill) => {
      const saved = favourites.some((f) => f.id === fav.id);
      write(
        saved
          ? favourites.filter((f) => f.id !== fav.id)
          : [fav, ...favourites].slice(0, MAX_FAVOURITES),
      );
      return !saved;
    },
    [favourites],
  );

  const remove = useCallback(
    (id: string) => write(favourites.filter((f) => f.id !== id)),
    [favourites],
  );

  return { favourites, isFavourite, toggle, remove };
}
