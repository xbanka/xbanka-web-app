"use client";
import { useState } from "react";
import { ConvertTab } from "./convert-tab";
import { SellTab } from "./sell-tab";
import { RecentTransactions } from "./recent-transactions";
import { BuyTab } from "./buy-tab";
import { HowTo } from "./steps";

type CryptoTab = "buy" | "sell" | "convert";

export function CryptoPage() {
  const [tab, setTab] = useState<CryptoTab>("buy");
  const tabs: { id: CryptoTab; label: string }[] = [
    { id: "buy", label: "Buy & Sell" },
    { id: "convert", label: "Convert" },
  ];
  // Buy & Sell share a sub-tab
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Main tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2.5 px-4 text-sm font-medium border-b-4 transition-colors -mb-px
              ${tab === t.id ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "buy" && (
        <div className="space-y-4">
          {/* Buy / Sell sub-tabs */}
          <div className="flex w-64 bg-background border border-border rounded-xl p-1">
            {(["buy", "sell"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTradeMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors
                  ${tradeMode === m ? "bg-Green text-white" : "text-text hover:text-card-text"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3 w-full border border-r-amber-500">
                {tradeMode === "buy" ? <BuyTab /> : <SellTab />}
              </div>
              <RecentTransactions />
            </div>
            {tradeMode === "buy" ? (
              <HowTo action="buy" />
            ) : (
              <HowTo action="sell" />
            )}
          </div>
        </div>
      )}
      {tab === "convert" && <ConvertTab />}
    </div>
  );
}
