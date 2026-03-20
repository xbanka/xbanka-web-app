"use client"
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

const MARKET_DATA = [
  { pair: "Bitcoin / USDT", price: "92,300", change: "+3.21%", up: true },
  { pair: "Ethereum / USDT", price: "87,500", change: "+4.15%", up: true },
  { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
  { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
  { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
];
 
export function MarketHighlight() {
  const [tab, setTab] = useState<"trending" | "new">("trending");
  const [mode, setMode] = useState<"spot" | "futures">("spot");
  return (
    <div className="bg-card-background border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-text">Market Highlight</h3>
        <button className="text-xs text-Green hover:underline">See all</button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {(["trending", "new"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors capitalize ${tab === t ? "bg-Green/10 text-Green" : "text-text hover:text-card-text"}`}>
              {t === "trending" ? "Trending" : "Newly Listed"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["spot", "futures"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[10px] rounded-lg font-medium transition-colors capitalize ${mode === m ? "bg-border text-card-text" : "text-text"}`}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-0">
        <div className="grid grid-cols-3 text-[10px] text-text pb-1.5 border-b border-border mb-1">
          <span>Assets</span><span className="text-center">Price</span><span className="text-right">24h Change</span>
        </div>
        {MARKET_DATA.map((c, i) => (
          <div key={i} className="grid grid-cols-3 py-2 text-xs hover:bg-border/20 rounded-lg px-1 transition-colors">
            <span className="text-card-text font-medium truncate">{c.pair.split(" / ")[0]}<span className="text-text">/{c.pair.split(" / ")[1]}</span></span>
            <span className="text-card-text text-center">{c.price}</span>
            <span className={`text-right font-medium flex items-center justify-end gap-0.5 ${c.up ? "text-green-500" : "text-red-500"}`}>
              {c.up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
              {c.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}