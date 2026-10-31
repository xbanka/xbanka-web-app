import { create } from "zustand";

type SplashStore = {
  /**
   * True once the dashboard splash has lifted. Anything that must not paint
   * over the logo (the product tour) waits for this.
   */
  done: boolean;
  setDone: (done: boolean) => void;
};

export const useSplashStore = create<SplashStore>((set) => ({
  done: false,
  setDone: (done) => set({ done }),
}));
