import { cn } from "@/lib/utils";
import * as React from "react";

export interface LabelProps {
  label: string;
}

function Label({ label }: LabelProps) {
  return (
    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
      <span className="flex items-center">{label && <span>{label}</span>}</span>
    </label>
  );
}

export { Label };
