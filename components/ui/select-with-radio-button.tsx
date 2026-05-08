import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { FundMethod } from "../Dashboard/Account-Page/types";

interface SelectWithRadioButtonProps {
  id: string;
  label: string;
  desc: string;
  icon?: LucideIcon;
  onSelect: (m: string) => void;
  active: boolean;
  altIcon?: string;
}

export const SelectWithRadioButton = ({
  id,
  label,
  desc,
  icon: Icon,
  onSelect,
  active,
  altIcon,
}: SelectWithRadioButtonProps) => {
  return (
    <button
      key={id}
      onClick={() => onSelect(id)}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
        active
          ? "border-border-active bg-[#042F2E]"
          : "border-border hover:border-border-active",
      )}
    >
      {Icon && (
        <div
          className={cn(
            "w-10 h-10 p-2.5 rounded-lg border border-input flex items-center justify-center shrink-0 bg-border text-card-text",
          )}
        >
          <Icon className="w-5 h-5 text-text" />
        </div>
      )}
      {altIcon && (
        <div
          className={cn(
            "w-10 h-10 p-2.5 rounded-full flex items-center justify-center shrink-0 bg-border text-card-text",
          )}
        >
          {altIcon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5 text-card-text">{label}</p>
        <p className="text-xs text-text mt-2 font-normal leading-5.5">{desc}</p>
      </div>
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
          active ? "border-Green" : "border-text",
        )}
      >
        {active && <div className="w-2 h-2 rounded-full bg-Green" />}
      </div>
    </button>
  );
};
