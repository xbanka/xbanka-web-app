import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: null,
      setTheme: (theme: Theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        set({ theme: next });
      },
    }),
    { name: "theme-preference" },
  ),
);
