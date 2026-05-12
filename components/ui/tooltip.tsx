// components/ui/tooltip.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  disabled = false,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {open && (
        <div
          className={cn(
            "absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-card-text px-2 py-1 text-xs text-background shadow-lg",
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}