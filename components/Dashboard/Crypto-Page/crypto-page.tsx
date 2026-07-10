"use client";
import { useState } from "react";
import { ConvertTab } from "./convert-tab";
import { SellTab } from "./sell-tab";
import { RecentTransactions } from "./recent-transactions";
import { BuyTab } from "./buy-tab";
import { HowTo } from "./steps";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type CryptoTab = "buy" | "sell" | "convert" | "p2p";

export function CryptoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabs: { id: CryptoTab; label: string }[] = [
    { id: "buy", label: "Buy & Sell" },
    { id: "convert", label: "Convert" },
    // { id: "p2p", label: "P2P Trading" },
  ];

  const currentTab = (searchParams.get("tab") as CryptoTab) || "buy";

  const tradeMode = (searchParams.get("mode") as "buy" | "sell") || "buy";

  const handleModeChange = (mode: "buy" | "sell") => () => {
    const coin = searchParams.get("coin");
    const params = new URLSearchParams({ tab: "buy", mode });
    if (coin) params.set("coin", coin);
    router.push(`/crypto?${params.toString()}`);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Main tabs */}
      <div className="flex gap-4 overflow-x-auto -mx-1 px-1 [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => router.push(`/crypto?tab=${t.id}`)}
            className={`pb-2.5 px-4 text-sm font-medium border-b-4 transition-colors -mb-px whitespace-nowrap
              ${currentTab === t.id ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {currentTab === "buy" && (
        <div className="space-y-4">
          {/* Buy / Sell sub-tabs */}
          <div className="space-y-10 max-sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:gap-4">
              <DashboardCard className="lg:col-span-2 space-y-3 w-full">
                <div className="flex bg-card-background border border-border rounded-lg p-1 w-full">
                  {(["buy", "sell"] as const).map((m) => (
                    <Button
                      variant={tradeMode === m ? "default" : "outline"}
                      key={m}
                      onClick={handleModeChange(m)}
                      className={`flex-1 py-2 px-3 max-sm:py-1.5 max-sm:px-2 rounded-lg border-none text-sm max-sm:text-xs font-semibold capitalize transition-colors
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
      {currentTab === "convert" && <ConvertTab />}
      {/* {tab === "p2p" && <P2PPage embedded />} */}
    </div>
  );
}
