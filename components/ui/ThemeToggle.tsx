"use client";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme.store";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "rounded-md px-3 py-2 text-sm flex flex-col items-end max-w-150 mx-auto cursor-pointer",
        className,
      )}
      aria-label="Toggle theme"
    >
      <div className="flex flex-col items-center">
        {theme === "dark" ? (
          <Moon size={20} className="animate-moon-tilt" />
        ) : (
          <Sun size={20} className="animate-sun-roll" />
        )}
      </div>
    </button>
  );
}
