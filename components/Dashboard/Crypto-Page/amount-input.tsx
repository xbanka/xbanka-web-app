import { CurrencyBadge } from "./currency-badge";
import { OptionProps } from "@/lib/types/form-types";
import { CryptoSelectField } from "@/components/ui/crypto-select";

export function AmountRow({
  label,
  available,
  value,
  onChange,
  showMax = false,
  OPTIONS,
  currencyId,
  onCurrencyChange,
}: {
  label: string;
  available?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showMax?: boolean;
  OPTIONS: OptionProps[];
  currencyId?: string;
  onCurrencyChange?: (val: string) => void;
}) {
  return (
    <div className="bg-border flex w-full rounded-xl py-3.25 px-5 gap-6">
      <div className="flex-4">
        <div className="flex items-center justify-between text-xs text-text">
          <span className="font-normal text-[12px] leading-4.5 text-text">
            {label}
          </span>
          {available && (
            <span className="font-normal text-[12px] leading-4.5 text-text">
              Available:{" "}
              <span className="text-Green font-normal">{available}</span>
              {showMax && (
                <button className="ml-2 text-Green font-medium hover:underline">
                  Max
                </button>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center w-full gap-2">
          <input
            type="number"
            value={value}
            onChange={onChange}
            placeholder="0.00"
            className="flex-1 w-[10%] bg-transparent text-lg font-bold text-card-text outline-none placeholder:text-text/40"
          />
        </div>
      </div>
      <div className="flex flex-1 items-center gap-1.5 bg-border hover:bg-border/80 transition-colors py-4 pl-4 border-l border-disabled-background shrink-0">
        <CryptoSelectField
          id={currencyId}
          options={OPTIONS}
          onChange={(e) => onCurrencyChange?.(e.target.value)}
        />
      </div>
      {/* {error && (
  <p className="text-red-500 text-xs px-1">{error}</p>
)} */}
    </div>
  );
}
