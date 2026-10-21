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
import { VerifyBvnModal } from "./verify-bvn-modal";
import { useRouter, useSearchParams } from "next/navigation";

// Fiat first, then crypto, then everything together. The "total" key stays
// so existing /wallet?tab=total links keep working.
const WALLET_TABS = [
  { key: "fiat", label: "Fiat" },
  { key: "crypto", label: "Crypto" },
  { key: "total", label: "History" },
] as const;

export default function WalletPage() {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "fiat";

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
      <DashboardCard className="space-y-3 ">
        <div className="border border-border p-1 flex items-center justify-start rounded-lg w-fit gap-0.5 ">
          {WALLET_TABS.map(({ key, label }) => (
            <Button
              size="sm"
              variant={currentTab === key ? "disabled" : "outline"}
              key={key}
              onClick={() => router.push(`/wallet?tab=${key}`)}
              className={`h-9 shadow-none border-none transition-colors
                ${currentTab === key ? "bg-border text-card-text max-sm:text-[14px]" : "border-transparent text-text hover:text-card-text hover:bg-border/60 "}`}
            >
              {label}
            </Button>
          ))}
        </div>
        {currentTab === "total" && <ValueBalance />}
        {currentTab === "fiat" && <FiatBalance />}
        {currentTab === "crypto" && <CryptoBalance />}
      </DashboardCard>

      {/* Tab content */}
      {currentTab === "total" && <TotalValueView />}
      {currentTab === "fiat" && <FlatView />}
      {currentTab === "crypto" && <CryptoView />}

      <VerifyBvnModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </div>
  );
}
