"use client";

import { ThemeState, useThemeStore } from "@/store/theme.store";
import { useEffect } from "react";

export function ThemeInitializer() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // If user already has a preference, do nothing
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      return;
    }

    // Otherwise, fall back to system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const resolvedTheme = prefersDark ? "dark" : "light";
    setTheme(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [theme, setTheme]);

  return null;
}