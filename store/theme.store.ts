import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme: Theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          return { theme: next };
        }),
    }),
    { name: "theme-preference" },
  ),
);
