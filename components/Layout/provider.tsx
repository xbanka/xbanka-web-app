"use client";

import { useTheme } from "@/hooks/useTheme";

export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();

  return <>{children}</>;
}