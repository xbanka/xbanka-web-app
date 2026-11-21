// components/ui/disabled-tooltip-button.tsx
"use client";

import React from "react";
import { Tooltip } from "./tooltip";
import { cn } from "@/lib/utils";

interface DisabledTooltipButtonProps {
  disabled?: boolean;
  tooltip?: string;
  children: React.ReactNode;
  /** Applied to the wrappers when disabled, so the button can keep a
   *  stretched layout (e.g. full width on phones). */
  className?: string;
}

export function DisabledTooltipButton({
  disabled,
  tooltip,
  children,
  className,
}: DisabledTooltipButtonProps) {
  if (!disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip content={tooltip || ""} wrapperClassName={className}>
      <div className={cn("inline-block cursor-not-allowed", className)}>
        {children}
      </div>
    </Tooltip>
  );
}