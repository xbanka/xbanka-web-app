"use client";

import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ErrorField } from "@/components/ui/field-error";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { sumWallets, sumWalletsEquivalent } from "@/lib/sumBalances";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function AssetValueCard() {
  const [hidden, setHidden] = useState(false);
  const [view, setView] = useState<"NGN" | "CRYPTO">("NGN");
  const {
    data: getAllWalletBalance,
    error: getAllWalletBalanceError,
    isPending: getAllWalletBalancePending,
  } = UseGetAllWalletBalances();

  const mainWallet = getAllWalletBalance?.data?.data || [];

  const totalBalance = sumWallets(mainWallet);
  const totalCryptoEquivalent = sumWalletsEquivalent(mainWallet);
  return (
    <DashboardCard className="border border-teal-border bg-teal-light">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-text text-sm">
            <span className="leading-6">Total Asset Value</span>
            <button
              onClick={() => setHidden((h) => !h)}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              {hidden ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            {getAllWalletBalancePending && (
              <div className="text-sm text-card-text font-bold leading-11">
                Your balance might have changed
              </div>
            )}
            {!getAllWalletBalancePending && (
              <span className="text-3xl sm:text-4xl text-card-text font-bold leading-11">
                {hidden
                  ? "•••••••"
                  : view === "NGN"
                    ? `₦${totalBalance.toLocaleString()}`
                    : `$${totalCryptoEquivalent.toLocaleString()}`}
              </span>
            )}
            {getAllWalletBalanceError && (
              <ErrorField message={getAllWalletBalanceError?.message} />
            )}
            <select
              value={view}
              onChange={(e) => setView(e.target.value as "NGN" | "CRYPTO")}
              className="bg-transparent text-card-text/60 text-xs outline-none"
            >
              <option value="NGN">NGN</option>
              <option value="CRYPTO">USDT</option>
            </select>
          </div>
          <p className="text-text text-xs font-normal leading-4.5">
            {hidden
              ? "≈ ••••••"
              : `≈ $${totalCryptoEquivalent.toLocaleString()} USD`}
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}
