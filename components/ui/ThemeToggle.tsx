"use client";

import { ThemeState, useThemeStore } from "@/store/theme.store";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";


export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore() as ThemeState;

  return (
    <div
      onClick={toggleTheme}
      className="rounded-md px-3 py-2 text-sm flex flex-col items-end max-w-150 mx-auto"
    >
      <div className="flex flex-col items-center">
        {theme === "dark" ? <Moon /> : <Sun />}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </div>
    </div>
  );
}