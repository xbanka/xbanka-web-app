"use client"
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Star } from "lucide-react";
import { useState } from "react";

const MARKET_FULL = Array(6).fill(null).map((_, i) => ({
  pair: "BTC/USDT",
  lastPrice: "93,311.92",
  change: i === 4 ? "-0.45%" : `+${(1 + i * 0.5).toFixed(2)}%`,
  up: i !== 4,
  marketCap: ["1.84T", "236.3M", "238.3M", "340.1M", "275.8M", "300.7M"][i],
  amount: ["298.6M", "312.4M", "340.1M", "269.3M", "275.8M", "300.7M"][i],
}));
 
export function MarketPage() {
  const [tab, setTab] = useState<"favorites" | "spot" | "futures">("spot");
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [search, setSearch] = useState("");
 
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-card-text">Market</h1>
 
      {/* Tab row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b border-border">
          {(["favorites", "spot", "futures"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2.5 px-4 text-sm font-medium capitalize border-b-2 transition-colors -mb-px
                ${tab === t ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}>
              {t === "favorites" ? "⭐ Favorites" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
 
        {/* All / New + search */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-background border border-border rounded-lg p-0.5">
            {(["all", "new"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors
                  ${filter === f ? "bg-Green text-white" : "text-text"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coin"
              className="pl-8 pr-3 h-8 text-xs border border-input rounded-lg bg-card-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active transition-colors w-36" />
          </div>
        </div>
      </div>
 
      {/* Table */}
      <div className="bg-card-background border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-text">
              <th className="text-left px-4 py-3 font-medium w-6"></th>
              <th className="text-left px-4 py-3 font-medium">
                <button className="flex items-center gap-1 hover:text-card-text transition-colors">
                  Pair <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium">
                <button className="flex items-center gap-1 ml-auto hover:text-card-text transition-colors">
                  Last Price <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium">
                <button className="flex items-center gap-1 ml-auto hover:text-card-text transition-colors">
                  Change <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">
                <button className="flex items-center gap-1 ml-auto hover:text-card-text transition-colors">
                  Market Cap <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium hidden md:table-cell">
                <button className="flex items-center gap-1 ml-auto hover:text-card-text transition-colors">
                  Amount <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MARKET_FULL.filter(
              (c) => !search || c.pair.toLowerCase().includes(search.toLowerCase())
            ).map((coin, i) => (
              <tr key={i} className="hover:bg-border/20 transition-colors">
                <td className="px-4 py-3">
                  <button className="text-text hover:text-yellow-400 transition-colors">
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-[10px]">₿</div>
                    <span className="text-xs font-semibold text-card-text">{coin.pair}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-xs font-medium text-card-text">{coin.lastPrice}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${coin.up ? "text-green-500" : "text-red-500"}`}>
                    {coin.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {coin.change}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-card-text hidden sm:table-cell">{coin.marketCap}</td>
                <td className="px-4 py-3 text-right text-xs text-card-text hidden md:table-cell">{coin.amount}</td>
                <td className="px-4 py-3 text-right">
                  <button className="bg-Green hover:bg-Green/90 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}