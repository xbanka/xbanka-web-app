import { useEffect } from "react";
import { ThemeState, useThemeStore } from "../store/theme.store";

export const useTheme = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme ?? "light");
  }, [theme]);
};
