"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export function ThemeInitializer() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme || "dark"
    );
  }, [theme]);

  return null;
}