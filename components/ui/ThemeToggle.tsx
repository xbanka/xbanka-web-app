"use client";

import { useThemeStore } from "@/store/theme.store";
import { Moon, Sun } from "lucide-react";


export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div
      onClick={toggleTheme}
      className="rounded-md px-3 py-2 text-sm flex flex-col items-end max-w-150 mx-auto"
    >
      <div className="flex flex-col items-center">
        {theme === "dark" ? <Moon className="animate-moon-tilt" /> : <Sun className="animate-sun-roll" /> }
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </div>
    </div>
  );
}