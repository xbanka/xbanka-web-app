"use client"
import { ChevronDown, Clock, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const P2P_LISTINGS = Array(7).fill(null).map((_, i) => ({
  name: "John Doe",
  stats: "1,500 successful trades • 99% Completion rate",
  meta: `${5 + i} mins • Joined ${1 + i} years ago`,
  price: "1,490",
  amount: "8,200.45 USDT",
  limit: "₦40,000 - ₦600,000",
  method: "Bank Transfer",
}));
 
export function P2PPage() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
 
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-card-text">P2P Marketplace</h1>
        <p className="text-sm text-text mt-0.5">Buy and sell crypto directly with verified traders.</p>
      </div>
 
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buy/Sell */}
        <div className="flex bg-background border border-border rounded-lg p-0.5">
          {(["buy", "sell"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-5 py-1.5 rounded-md text-sm font-semibold capitalize transition-colors
                ${mode === m ? "bg-Green text-white" : "text-text"}`}>
              {m}
            </button>
          ))}
        </div>
 
        {/* Currency selectors */}
        <div className="relative">
          <select className="h-9 pl-3 pr-7 text-xs border border-input rounded-lg bg-card-background text-card-text appearance-none outline-none focus:border-border-active transition-colors">
            <option>NGN</option><option>USD</option><option>GBP</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder pointer-events-none" />
        </div>
 
        <div className="relative flex-1 min-w-36">
          <input placeholder="Enter amount" className="w-full h-9 pl-3 pr-3 text-xs border border-input rounded-lg bg-card-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active transition-colors" />
        </div>
 
        <div className="relative">
          <select className="h-9 pl-3 pr-7 text-xs border border-input rounded-lg bg-card-background text-card-text appearance-none outline-none focus:border-border-active transition-colors">
            <option>USDT</option><option>BTC</option><option>ETH</option><option>USDC</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder pointer-events-none" />
        </div>
 
        <div className="relative">
          <select className="h-9 pl-3 pr-7 text-xs border border-input rounded-lg bg-card-background text-card-text appearance-none outline-none focus:border-border-active transition-colors">
            <option>Bank Transfer</option><option>Card</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder pointer-events-none" />
        </div>
 
        <button className="w-9 h-9 rounded-lg border border-input flex items-center justify-center text-text hover:border-border-active hover:text-Green transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
 
      {/* Table */}
      <div className="bg-card-background border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-border text-xs font-semibold text-text">
          <span>Merchant</span>
          <span>Price</span>
          <span>Amount / Limit</span>
          <span>Payment Methods</span>
          <span>Action</span>
        </div>
        {/* Rows */}
        <div className="divide-y divide-border">
          {P2P_LISTINGS.map((listing, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 px-4 py-3.5 hover:bg-border/20 transition-colors items-center">
              {/* Merchant */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-Green flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {listing.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-card-text truncate">{listing.name}</p>
                  <p className="text-[10px] text-text truncate">{listing.stats}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-text" />
                    <p className="text-[10px] text-text">{listing.meta}</p>
                  </div>
                </div>
              </div>
              {/* Price */}
              <div>
                <p className="text-sm font-bold text-card-text">{listing.price}</p>
                <p className="text-[10px] text-text">per unit</p>
              </div>
              {/* Amount/Limit */}
              <div>
                <p className="text-xs font-semibold text-card-text">{listing.amount}</p>
                <p className="text-[10px] text-text">{listing.limit}</p>
              </div>
              {/* Method */}
              <div className="flex flex-wrap gap-1">
                <span className="inline-flex items-center gap-1 text-[10px] bg-border px-2 py-0.5 rounded-full text-card-text">
                  • {listing.method}
                </span>
              </div>
              {/* Action */}
              <div>
                <button className="bg-Green hover:bg-Green/90 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                  {mode === "buy" ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}