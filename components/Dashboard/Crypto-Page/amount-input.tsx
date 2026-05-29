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
  readOnly?: boolean;
  availableBalanceLoading?: boolean;
  dropDownLoading?: boolean;
}

export function AmountRow({
  label,
  available,
  availableBalanceLoading,
  value,
  onChange,
  selectedCurrency,
  OPTIONS,
  currencyId,
  onCurrencyChange,
  error,
  readOnly,
  dropDownLoading,
}: AmountRowProps) {
  const formatNumber = (value: string | number) => {
  if (!value) return "";

  const [whole, decimal] = String(value).split(".");

  const formattedWhole = Number(whole).toLocaleString();

  return decimal !== undefined
    ? `${formattedWhole}.${decimal}`
    : formattedWhole;
};
  return (
    <div>
      <div className="bg-card-secondary flex w-full rounded-xl py-3.25 px-5 gap-6 max-sm:py-3 max-sm:px-3 max-sm:gap-2">
        <div className="flex-4 flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between gap-2 text-xs text-text">
            <span className="font-normal text-[12px] max-sm:text-[11px] leading-4.5 text-text">
              {label}
            </span>
            {availableBalanceLoading && (
              <div className="h-8 w-8 rounded-full bg-border" />
            )}
            {!availableBalanceLoading && available && (
              <span className="font-normal text-[12px] max-sm:text-[11px] leading-4.5 text-text truncate">
                Available:{" "}
                <span className="text-Green font-normal">{available}</span>
              </span>
            )}
          </div>
          <div className="flex items-end w-full gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={formatNumber(value)}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");

                onChange?.({
                  ...e,
                  target: {
                    ...e.target,
                    value: rawValue,
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              readOnly={readOnly}
              placeholder="0.00"
              className="flex-1 w-[10%] min-w-0 bg-transparent text-lg max-sm:text-base font-bold text-card-text outline-none placeholder:text-text/40"
            />

            {available && Number(value) > Number(available) && (
              <button className="ml-2 text-Green font-medium hover:underline">
                Max
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 max-sm:flex-none max-sm:basis-[40%] items-center gap-1.5 bg-card-secondary hover:bg-card-secondary/80 transition-colors py-4 pl-4 max-sm:py-2 max-sm:pl-2.5 border-l border-disabled-background shrink-0">
          <CryptoSelectField
            loading={dropDownLoading}
            currencyId={currencyId}
            value={selectedCurrency}
            options={OPTIONS}
            onChange={onCurrencyChange}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs px-1">{error}</p>}
    </div>
  );
}
