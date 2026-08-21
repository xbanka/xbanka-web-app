import { create } from "zustand";
import { persist } from "zustand/middleware";

type BalanceVisibilityStore = {
  hidden: boolean;
  toggle: () => void;
  setHidden: (hidden: boolean) => void;
};

/**
 * Whether balances are masked, shared by every balance on the platform and
 * remembered across reloads.
 *
 * Hiding a balance is a privacy decision, not a per-card preference: it used to
 * be local state in each card, so the balance came back the moment the user
 * moved to another tab or refreshed.
 *
 * Rehydration is deferred to `useBalanceVisibility`, which flips the state
 * after mount. Reading localStorage during store creation would make the first
 * client render disagree with the server-rendered markup.
 */
export const useBalanceVisibilityStore = create<BalanceVisibilityStore>()(
  persist(
    (set) => ({
      hidden: false,
      toggle: () => set((state) => ({ hidden: !state.hidden })),
      setHidden: (hidden) => set({ hidden }),
    }),
    {
      name: "xbanka-balance-hidden",
      skipHydration: true,
    },
  ),
);
