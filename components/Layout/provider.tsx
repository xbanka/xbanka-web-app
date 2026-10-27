"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { trackZoomOrigins } from "@/lib/zoom-origin";

export function Providers({ children }: { children: React.ReactNode }) {
  useTheme();
  // Lets modals open from the spot that was tapped.
  useEffect(() => trackZoomOrigins(), []);

  return <>{children}</>;
}
