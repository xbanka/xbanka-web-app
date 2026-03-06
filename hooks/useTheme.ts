import { useEffect } from "react";
import { ThemeState, useThemeStore } from "../store/theme.store";

export const useTheme = () => {
  const { theme } = useThemeStore() as ThemeState;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
};