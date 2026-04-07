import { CurrencyBadge } from "./currency-badge";
import { OptionProps } from "@/lib/types/form-types";
import { CryptoSelectField } from "@/components/ui/crypto-select";
import { CurrencyOption } from "@/lib/crypto";
import { readonly } from "zod";

export interface AmountRowProps {
  label: string;
  available?: string | number;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCurrency: string;
  showMax?: boolean;
  OPTIONS: CurrencyOption[];
  currencyId?: boolean;
  onCurrencyChange: (val: string) => void;
  error?: string;
  readOnly?: boolean
}

export function AmountRow({
  label,
  available,
  value,
  onChange,
  selectedCurrency,
  OPTIONS,
  currencyId,
  onCurrencyChange,
  error,
  readOnly
}: AmountRowProps) {
  return (
    <div>
      <div className="bg-border flex w-full rounded-xl py-3.25 px-5 gap-6">
        <div className="flex-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-text">
            <span className="font-normal text-[12px] leading-4.5 text-text">
              {label}
            </span>
            {available && (
              <span className="font-normal text-[12px] leading-4.5 text-text">
                Available:{" "}
                <span className="text-Green font-normal">{available}</span>
              </span>
            )}
          </div>
          <div className="flex items-end w-full gap-2">
            <input
              type="number"
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              placeholder="0.00"
              className="flex-1 w-[10%] bg-transparent text-lg font-bold text-card-text outline-none placeholder:text-text/40"
            />

            {available && Number(value) > Number(available) && (
              <button className="ml-2 text-Green font-medium hover:underline">
                Max
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center gap-1.5 bg-border hover:bg-border/80 transition-colors py-4 pl-4 border-l border-disabled-background shrink-0">
          <CryptoSelectField
            currencyId={currencyId}
            value={selectedCurrency}
            options={OPTIONS}
            onChange={onCurrencyChange}
          />
        </div>
      </div>
      {error && (
    <p className="text-red-500 text-xs px-1">{error}</p>
  )}
    </div>
  );
}
