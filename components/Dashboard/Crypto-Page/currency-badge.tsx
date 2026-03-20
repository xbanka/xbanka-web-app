import { ChevronDown } from "lucide-react";

const COIN_ICONS: Record<string, string> = {
  NGN: "🇳🇬", USDT: "💵", BTC: "₿", ETH: "Ξ", USDC: "💲",
};
export function CurrencyBadge({ symbol, onToggle }: { symbol: string; onToggle?: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 bg-border hover:bg-border/80 transition-colors rounded-lg px-2.5 py-1.5 shrink-0"
    >
      <span className="text-sm leading-none">{COIN_ICONS[symbol] ?? "🔵"}</span>
      <span className="text-xs font-semibold text-card-text">{symbol}</span>
      {onToggle && <ChevronDown className="w-3 h-3 text-placeholder" />}
    </button>
  );
}