"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export interface SelectWithValueFieldProps {
  currencyId?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  label?: string;
  /**
   * Optional leading visual per option. Provided as a render prop because a
   * native <select> cannot host images inside <option> — supplying this is what
   * makes an icon-bearing dropdown possible.
   */
  renderIcon?: (value: string) => ReactNode;
}

export const SelectFieldWithValue = ({
  value,
  onChange,
  placeholder,
  options,
  label,
  renderIcon,
}: SelectWithValueFieldProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div>
      {label && <Label label={label} />}
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="border-input flex h-10 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border bg-input-background px-4 py-2.5 text-left text-[14px] shadow-xs"
        >
          {renderIcon && selected && renderIcon(selected.value)}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              !selected && "text-placeholder",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-placeholder" />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-input bg-input-background shadow-md"
          >
            {options.length > 0 ? (
              options.map((o) => (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 text-[14px] hover:bg-muted"
                >
                  {renderIcon && renderIcon(o.value)}
                  <span className="min-w-0 truncate">{o.label}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-placeholder">
                No options available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
