"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CurrencyOption } from "@/lib/crypto";
import { CoinIcon } from "@/components/ui/coin-icon";
import { cn } from "@/lib/utils";

const isNaira = (value?: string) => value === "NGNX" || value === "NGN";

export interface CryptoSelectFieldProps {
  currencyId?: boolean;
  options: CurrencyOption[] | any[];
  onChange: (value: string) => void;
  value: string;
  className?: string;
  loading?: boolean;
}

export const CryptoSelectField = ({
  options,
  value,
  onChange,
  currencyId,
  className,
  loading,
}: CryptoSelectFieldProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const selected = options.find((o: any) => o.value === value) || options[0];

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {loading ? (
        <div className="h-10 w-full rounded-lg bg-gray-300 animate-pulse" />
      ) : (
        <>
          {/* Selected */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center justify-between w-full gap-1.5 px-3 py-2 max-sm:px-2 max-sm:py-1.5 rounded-lg bg-card-secondary"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 flex items-center justify-center rounded-full overflow-hidden">
                {isNaira(selected?.value) ? (
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold bg-Green border border-[#5EEAD4]">
                    ₦
                  </div>
                ) : (
                  <CoinIcon currency={selected?.value} size={24} />
                )}
              </div>
              <span>{selected?.label || "Select"}</span>
            </div>
            {currencyId && <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>

          {/* Dropdown */}
          {currencyId && open && (
            <div className="absolute z-50 mt-2 w-full bg-card-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.map((o: any) => (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-border cursor-pointer"
                >
                  <div className="h-5 w-5 flex items-center justify-center rounded-full overflow-hidden">
                    {isNaira(o.value) ? (
                      <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold bg-Green border border-[#5EEAD4]">
                        ₦
                      </div>
                    ) : (
                      <CoinIcon currency={o.value} size={20} />
                    )}
                  </div>
                  <span>{o.label}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
