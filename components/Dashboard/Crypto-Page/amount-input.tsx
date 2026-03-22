import { CurrencyBadge } from "./currency-badge";

export function AmountRow({
  label,
  available,
  value,
  onChange,
  currency,
  onCurrencyToggle,
  showMax = false,
}: {
  label: string;
  available?: string;
  value: string;
  onChange: (v: string) => void;
  currency: string;
  onCurrencyToggle?: () => void;
  showMax?: boolean;
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
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 w-[10%] bg-transparent text-lg font-bold text-card-text outline-none placeholder:text-text/40"
          />
        </div>
      </div>
      <CurrencyBadge symbol={currency} onToggle={onCurrencyToggle} />
    </div>
  );
}
