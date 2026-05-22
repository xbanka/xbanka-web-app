import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SelectWithRadioButtonProps {
  id: string;
  label: string;
  desc: string;
  icon?: LucideIcon;
  onSelect: (m: string) => void;
  active: boolean;
  altIcon?: string;
  altIconColor?: string;
  badge?: string;
}

export const SelectWithRadioButton = ({
  id,
  label,
  desc,
  icon: Icon,
  onSelect,
  active,
  altIcon,
  altIconColor,
  badge,
}: SelectWithRadioButtonProps) => {
  return (
    <button
      key={id}
      onClick={() => onSelect(id)}
      className={cn(
        "w-full flex items-center gap-3 p-4 max-sm:p-3 max-sm:gap-3 rounded-xl border text-left transition-colors",
        active
          ? "border-border-active bg-[#042F2E]"
          : "border-border hover:border-border-active",
      )}
    >
      {Icon && (
        <div
          className={cn(
            "w-10 h-10 max-sm:w-11 max-sm:h-11 p-2.5 rounded-lg border border-input flex items-center justify-center shrink-0 bg-border text-card-text",
          )}
        >
          <Icon className="w-5 h-5 text-text" />
        </div>
      )}
      {altIcon && (
        <div
          className={cn(
            "w-10 h-10 max-sm:w-11 max-sm:h-11 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-semibold uppercase",
            altIconColor || "bg-border text-card-text",
          )}
        >
          {altIcon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium leading-5 text-card-text truncate max-sm:text-[13px]">
            {label}
          </p>
          {badge && (
            <span className="shrink-0 rounded-md bg-border px-2 py-0.5 text-[11px] font-medium leading-4 text-card-text">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-text mt-2 font-normal leading-5.5 max-sm:mt-1 max-sm:leading-4 max-sm:text-[12px]">
          {desc}
        </p>
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
