"use client";
import { useState } from "react";
import { ConvertTab } from "./convert-tab";
import { SellTab } from "./sell-tab";
import { RecentTransactions } from "./recent-transactions";
import { BuyTab } from "./buy-tab";
import { HowTo } from "./steps";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { P2PPage } from "./p2p-tab";

type CryptoTab = "buy" | "sell" | "convert" | "p2p";

export function CryptoPage() {
  const [tab, setTab] = useState<CryptoTab>("buy");
  const tabs: { id: CryptoTab; label: string }[] = [
    { id: "buy", label: "Buy & Sell" },
    { id: "convert", label: "Convert" },
    // { id: "p2p", label: "P2P Trading" },
  ];
  // Buy & Sell share a sub-tab
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Main tabs */}
      <div className="flex gap-4">
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
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DashboardCard className="lg:col-span-2 space-y-3 w-full">
                <div className="flex bg-card-background border border-border rounded-lg p-1 w-full">
                  {(["buy", "sell"] as const).map((m) => (
                    <Button
                      variant={tradeMode === m ? "default" : "outline"}
                      key={m}
                      onClick={() => setTradeMode(m)}
                      className={`flex-1 py-2 px-3 rounded-lg border-none text-sm font-semibold capitalize transition-colors
                  ${tradeMode === m ? "bg-[#042F2E] text-white" : "text-text hover:text-card-text"}`}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
                {tradeMode === "buy" ? <BuyTab /> : <SellTab />}
              </DashboardCard>
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
      {/* {tab === "p2p" && <P2PPage embedded />} */}
    </div>
  );
}
