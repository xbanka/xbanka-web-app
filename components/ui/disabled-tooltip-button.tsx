// components/ui/disabled-tooltip-button.tsx
"use client";

import React from "react";
import { Tooltip } from "./tooltip";

interface DisabledTooltipButtonProps {
  disabled?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

export function DisabledTooltipButton({
  disabled,
  tooltip,
  children,
}: DisabledTooltipButtonProps) {
  if (!disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip content={tooltip || ""}>
      <div className="inline-block cursor-not-allowed">
        {children}
      </div>
    </Tooltip>
  );
}