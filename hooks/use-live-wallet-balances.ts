"use client";

import { useEffect } from "react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { getWalletStreamTicket } from "@/lib/actions/wallet";
import { authTokens } from "@/lib/authToken";
import {
  createStaleGuard,
  openWalletStream,
  patchWalletCache,
  toBalanceMap,
  WALLET_BALANCE_QUERY_KEYS,
  WalletStreamStatus,
} from "@/lib/walletStream";

/** While the stream is down, poll balances this often (guide: 30 to 60s). */
export const FALLBACK_POLL_MS = 45_000;
/** Coalesce a burst of balance events into one background refetch. */
export const REFRESH_DEBOUNCE_MS = 1_500;

/** Writes balances into every wallet list cache. True if any value changed. */
export const applyBalances = (
  queryClient: QueryClient,
  balances: ReadonlyMap<string, number>,
) => {
  let changed = false;
  for (const key of WALLET_BALANCE_QUERY_KEYS) {
    for (const [queryKey, before] of queryClient.getQueriesData({
      queryKey: [key],
    })) {
      const after = patchWalletCache(before, balances);
      if (after !== before) {
        changed = true;
        queryClient.setQueryData(queryKey, after);
      }
    }
  }
  return changed;
};

const refetchWallets = (queryClient: QueryClient) => {
  for (const key of WALLET_BALANCE_QUERY_KEYS) {
    queryClient.invalidateQueries({ queryKey: [key] });
  }
};

/**
 * Keeps every wallet balance on screen live, fiat and crypto alike.
 *
 * One stream per tab (see lib/walletStream.ts). Each event is written straight
 * into the fiat, crypto and all-wallets caches so the number changes within a
 * few seconds of the money landing. A quiet background refetch follows, which
 * fills in the naira/dollar equivalents, the new transaction row and the
 * deposit notification (useDepositAlerts toasts it with its real cause).
 *
 * The stream is closed while the tab is hidden: the server keeps at most 5
 * per customer and evicts the oldest, and the snapshot on return resyncs
 * everything. While the stream is down the balances are polled instead.
 */
export const useLiveWalletBalances = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const guard = createStaleGuard();
    let status: WalletStreamStatus = "connecting";
    let stop: (() => void) | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let refresh: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = (extraKeys: string[]) => {
      if (refresh) clearTimeout(refresh);
      refresh = setTimeout(() => {
        refresh = null;
        refetchWallets(queryClient);
        for (const key of extraKeys) {
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      }, REFRESH_DEBOUNCE_MS);
    };

    const stopPolling = () => {
      if (poll) clearInterval(poll);
      poll = null;
    };

    const setStatus = (next: WalletStreamStatus) => {
      status = next;
      if (next === "live") {
        stopPolling();
      } else if ((next === "down" || next === "unsupported") && !poll) {
        poll = setInterval(() => refetchWallets(queryClient), FALLBACK_POLL_MS);
      }
    };

    const start = () => {
      if (stop || !authTokens.getAccessToken()) return;
      stop = openWalletStream({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
        // Signed out between retries: back off rather than POST without a
        // token, which would send the user through the refresh/redirect path.
        fetchTicket: () =>
          authTokens.getAccessToken()
            ? getWalletStreamTicket()
            : Promise.reject({ status: 401 }),
        onStatus: setStatus,
        onSnapshot: (wallets) => {
          guard.reset();
          if (applyBalances(queryClient, toBalanceMap(wallets))) {
            scheduleRefresh(["transaction-history", "get-notifications"]);
          }
        },
        onBalance: (event) => {
          if (!guard.accept(event)) return;
          applyBalances(queryClient, toBalanceMap([event]));
          scheduleRefresh(["transaction-history", "get-notifications"]);
        },
      });
    };

    const pause = () => {
      stop?.();
      stop = null;
      stopPolling();
      status = "connecting";
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        pause();
        return;
      }
      start();
    };

    // refetchOnWindowFocus is off app-wide; without a live stream, refetch
    // when the user comes back so they never stare at an old balance.
    const onFocus = () => {
      if (status !== "live") refetchWallets(queryClient);
    };

    if (document.visibilityState !== "hidden") start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      pause();
      if (refresh) clearTimeout(refresh);
    };
  }, [queryClient]);
};
