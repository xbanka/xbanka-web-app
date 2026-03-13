import { ArrowUpRight, TrendingUp } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Buy/Sell Crypto",
      sub: "BTC, ETH, USDT, USDC",
      gradient: "from-purple-600 to-indigo-700",
      page: "crypto" as PageId,
    },
    {
      title: "Buy/Sell Gift Cards",
      sub: "Amazon, Visa, Starbucks + more",
      gradient: "from-pink-600 to-rose-700",
      page: "giftcards" as PageId,
    },
    {
      title: "Bill Payments",
      sub: "Airtime, Data, Electricity + more",
      gradient: "from-blue-600 to-cyan-700",
      page: "bills" as PageId,
    },
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold text-card-text mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.title}
            className={`relative bg-gradient-to-br ${a.gradient} rounded-2xl p-4 text-left text-white hover:opacity-90 transition-opacity overflow-hidden`}
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 opacity-60" />
            <TrendingUp className="w-8 h-8 opacity-20 mb-3" />
            <p className="font-semibold text-sm">{a.title}</p>
            <p className="text-white/70 text-xs mt-0.5">{a.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}