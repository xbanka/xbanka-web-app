// store/currency-view.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyView = "NGN" | "CRYPTO";

interface CurrencyViewStore {
  view: CurrencyView;
  setView: (view: CurrencyView) => void;
}

export const useCurrencyViewStore = create<CurrencyViewStore>()(
  persist(
    (set) => ({
      view: "NGN",
      setView: (view) => set({ view }),
    }),
    {
      name: "currency-view",
    }
  )
);