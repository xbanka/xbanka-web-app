import { create } from "zustand";

type ProductTourStore = {
  /**
   * Set by "Take a tour" so the home page replays the tour, even for a user
   * who has already seen it. Cleared once that run ends.
   */
  requested: boolean;
  request: () => void;
  clear: () => void;
};

export const useProductTourStore = create<ProductTourStore>((set) => ({
  requested: false,
  request: () => set({ requested: true }),
  clear: () => set({ requested: false }),
}));
