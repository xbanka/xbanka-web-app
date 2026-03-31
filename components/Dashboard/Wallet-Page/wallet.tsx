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
import { ArrowUpRight, X } from "lucide-react";
import { VerifyBvnModal } from "./verify-bvn-modal";
import { UseVerificationStatus } from "@/lib/services/profile.service";

export default function WalletPage() {
  const [tab, setTab] = useState<WalletTab>("total");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // ── Add Funds modal
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const {
    data: verificationData,
    isPending: verificationPending,
    error: verificationError,
  } = UseVerificationStatus();

  const verification = verificationData?.data;

  const isBvnVerified = verification?.progress?.some(
    (step: any) => step.id === "BVN" && step.isCompleted,
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {!isBvnVerified && (
        <div className="flex items-center justify-between gap-6 px-4 py-3 rounded-[20px] bg-[#042F2E] border-l-3 border-[#0F766E]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#5EEAD4] leading-5">
                Complete your verification to unlock your wallet
              </p>
              <p className="text-xs font-medium leading-5 text-[#5EEAD4] truncate">
                Verify your BVN to add funds, send money, and do more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              onClick={() => setVerifyModalOpen(true)}
              className="text-xs cursor-pointer font-medium leading-5 text-[#5EEAD4] hover:text-[#5EEAD4]/60 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              Verify Now
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
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
          {(["total", "fiat", "crypto"] as WalletTab[]).map((t) => (
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
        {tab === "fiat" && <FiatBalance isBvnVerified={isBvnVerified} />}
        {tab === "crypto" && <CryptoBalance />}
      </DashboardCard>

      {/* Tab content */}
      {tab === "total" && <TotalValueView />}
      {tab === "fiat" && <FlatView />}
      {tab === "crypto" && <CryptoView />}

      <VerifyBvnModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* <AddFundsModal
        open={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
        onSuccess={() => setAddFundsOpen(false)}
      /> */}
    </div>
  );
}
