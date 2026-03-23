"use client";
import { useState } from "react";
import { TotalValueView } from "./total-value-view";
import { FlatView } from "./Fiat-view";
import { CryptoView } from "./crypto-view";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ValueBalance } from "./value-balance";
import { FiatBalance } from "./fiat-balance";
import { CryptoBalance } from "./crypto-balance";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const [tab, setTab] = useState<WalletTab>("total");

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-[24px] leading-8 font-semibold text-card-text">
          My Wallets
        </h1>
        <p className="text-sm font-normal leading-6 text-text">
          Manage your balances and actions across all your XBanka wallets
        </p>
      </div>

      {/* Tabs */}
      <DashboardCard className="space-y-3">
        <div className="border border-border p-1 flex items-center justify-start rounded-lg w-fit gap-0.5">
          {(["total", "flat", "crypto"] as WalletTab[]).map((t) => (
            <Button
              size="sm"
              variant={tab === t ? "disabled" : "outline"}
              key={t}
              onClick={() => setTab(t)}
              className={`h-9 capitalize shadow-none border-none transition-colors
                ${tab === t ? "bg-border text-card-text" : "border-transparent text-text hover:text-card-text hover:bg-border/60"}`}
            >
              {t === "total"
                ? "Total Value"
                : t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
        {tab === "total" && <ValueBalance />}
        {tab === "flat" && <FiatBalance />}
        {tab === "crypto" && <CryptoBalance />}
      </DashboardCard>

      {/* Tab content */}
      {tab === "total" && <TotalValueView />}
      {tab === "flat" && <FlatView />}
      {tab === "crypto" && <CryptoView />}
    </div>
  );
}
