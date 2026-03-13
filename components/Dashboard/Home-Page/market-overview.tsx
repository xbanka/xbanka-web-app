import { MARKET } from "@/lib/MockData";
import { ArrowDown, ArrowUp } from "lucide-react";

export function MarketOverview() {
  return (
    <div className="bg-card-background border border-border rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-text">Market Overview</h3>
        <div className="flex gap-1 text-xs">
          {["Favourites", "Hot", "Gainers", "Losers", "New", "Turnovers"].map((t) => (
            <button key={t} className={`px-2 py-1 rounded-md transition-colors ${t === "Favourites" ? "bg-Green/10 text-Green font-medium" : "text-text hover:text-card-text"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-text border-b border-border">
              <th className="text-left pb-2 font-medium">Assets</th>
              <th className="text-right pb-2 font-medium">Price</th>
              <th className="text-right pb-2 font-medium">24h Change</th>
              <th className="text-right pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MARKET.map((coin, i) => (
              <tr key={i} className="hover:bg-border/30 transition-colors">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-[10px] font-bold text-card-text">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <p className="font-medium text-card-text text-xs">{coin.name}</p>
                      <p className="text-[10px] text-text">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right font-medium text-card-text text-xs">
                  ₦{coin.price}
                </td>
                <td className="py-2.5 text-right">
                  <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${coin.up ? "text-green-500" : "text-red-500"}`}>
                    {coin.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {coin.change}%
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button className="text-xs text-Green font-medium hover:underline">Trade</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}