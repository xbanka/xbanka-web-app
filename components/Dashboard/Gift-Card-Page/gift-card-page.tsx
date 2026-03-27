"use client";

import { useState } from "react";
import { SellTab } from "../Crypto-Page/sell-tab";
import { OverviewTab } from "./overview-tab";
import { GiftTab } from "@/lib/MockData";

export default function GiftCardsPage() {
  const [tab, setTab] = useState<GiftTab>("overview");
 
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header + sub-nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-card-text">Gift Cards</h1>
        <div className="flex gap-1 border-b border-border sm:border-none">
          {(["overview", "sell", "history"] as GiftTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 sm:pb-0 px-4 sm:px-5 sm:py-2 text-sm font-medium capitalize border-b-2 sm:border sm:rounded-lg transition-colors -mb-px sm:mb-0
                ${tab === t
                  ? "border-Green text-Green sm:border-Green sm:bg-Green/10"
                  : "border-transparent text-text hover:text-card-text sm:border-border sm:hover:border-border-active"
                }`}
            >
              {t === "sell" ? "Sell Gift Card" : t === "history" ? "Transaction History" : "Overview"}
            </button>
          ))}
        </div>
      </div>
 
      {tab === "overview" && <OverviewTab />}
      {tab === "sell" && <SellTab />}
      {tab === "history" && (
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <p className="text-sm text-text text-center py-8">Select a transaction to view details</p>
        </div>
      )}
    </div>
  );
}