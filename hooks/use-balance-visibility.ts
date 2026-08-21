// hooks/use-balance-visibility.ts
"use client";

import { useBalanceVisibilityStore } from "@/store/balance-visibility.store";
import { useEffect } from "react";

/**
 * The shared "hide my balance" toggle.
 *
 * Every balance on the platform reads from here, so hiding one hides them all
 * and the choice survives navigation and reloads.
 */
export const useBalanceVisibility = () => {
  const hidden = useBalanceVisibilityStore((state) => state.hidden);
  const toggle = useBalanceVisibilityStore((state) => state.toggle);

  // Restore the stored choice after mount rather than during render, so the
  // first client render still matches the server markup. Balances are fetched
  // client-side and are not on screen yet at this point, so nothing is exposed
  // in the frame before this runs.
  useEffect(() => {
    void useBalanceVisibilityStore.persist.rehydrate();
  }, []);

  return { hidden, toggle };
};
