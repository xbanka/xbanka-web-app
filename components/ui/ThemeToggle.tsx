"use client";

import { ThemeState, useThemeStore } from "@/store/theme.store";


export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore() as ThemeState;

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}