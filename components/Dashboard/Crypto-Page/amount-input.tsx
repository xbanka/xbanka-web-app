import { CurrencyBadge } from "./currency-badge";

export function AmountRow({
  label, available, value, onChange, currency, onCurrencyToggle, showMax = false,
}: {
  label: string; available?: string; value: string;
  onChange: (v: string) => void; currency: string;
  onCurrencyToggle?: () => void; showMax?: boolean;
}) {
  return (
    <div className="bg-background border border-border w-full rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between text-xs text-text">
        <span>{label}</span>
        {available && (
          <span>
            Available: <span className="text-Green font-medium">{available}</span>
            {showMax && <button className="ml-2 text-Green font-medium hover:underline">Max</button>}
          </span>
        )}
      </div>
      <div className="flex items-center w-full gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="flex-1 bg-transparent text-lg font-bold text-card-text outline-none placeholder:text-text/40 min-w-full border border-red-900"
        />
        <CurrencyBadge symbol={currency} onToggle={onCurrencyToggle} />
      </div>
    </div>
  );
}