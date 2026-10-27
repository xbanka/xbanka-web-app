"use client";

import { cn } from "@/lib/utils";

const digitsOf = (text: string) => text.replace(/[^\d]/g, "");
const withSeparators = (digits: string) =>
  digits ? Number(digits).toLocaleString("en-NG") : "";

/**
 * A naira amount box: the ₦ sign sits inside it, the figure gains thousands
 * separators as it is typed, and quick amounts scroll in one row beneath.
 * `value` stays digits-only, which is what the checkout stores and sends.
 */
export function AmountField({
  value,
  onChange,
  min,
  quickAmounts,
  className,
}: {
  value: string;
  onChange: (digits: string) => void;
  min?: number;
  quickAmounts?: readonly number[];
  /** The checkout's shared input styling. */
  className?: string;
}) {
  return (
    <div>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-text"
        >
          ₦
        </span>
        <input
          value={withSeparators(value)}
          onChange={(e) => onChange(digitsOf(e.target.value))}
          placeholder={min ? `Minimum ${min.toLocaleString("en-NG")}` : "0"}
          inputMode="numeric"
          aria-label="Amount in naira"
          className={cn(className, "pl-9 text-lg font-semibold tabular-nums")}
        />
      </div>

      {quickAmounts && quickAmounts.length > 0 && (
        <div className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {quickAmounts.map((amount) => {
            const selected = value === String(amount);
            return (
              <button
                key={amount}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(String(amount))}
                className={cn(
                  "h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-[13px] transition-colors",
                  selected
                    ? "border-Green bg-Green/10 font-medium text-Green"
                    : "border-border text-text hover:border-border-active hover:text-card-text",
                )}
              >
                ₦{amount.toLocaleString("en-NG")}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
