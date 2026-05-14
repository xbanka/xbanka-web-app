import { cn } from "@/lib/utils";
import * as React from "react";

export interface LabelProps {
  label: string;
  className?: string;
}

function Label({ label, className }: LabelProps) {
  return (
    <label className={cn("text-xs font-medium leading-5 text-card-text flex items-center gap-1", className)}>
      {label}
    </label>
  );
}

export { Label };
