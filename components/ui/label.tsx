import { cn } from "@/lib/utils";
import * as React from "react";

export interface LabelProps {
  label: string;
}

function Label({ label }: LabelProps) {
  return (
    <label className="text-xs font-medium leading-5 text-text flex items-center gap-1">
      {label}
    </label>
  );
}

export { Label };
