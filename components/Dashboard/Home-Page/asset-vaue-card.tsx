"use client";

import { useState } from "react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { sumWallets, sumWalletsEquivalent } from "@/lib/sumBalances";
import { useCurrencyViewStore } from "@/store/currency-view.store";
import { Eye, EyeOff, Plus } from "lucide-react";
import { useBalanceVisibility } from "@/hooks/use-balance-visibility";
import { useCountUp } from "@/hooks/use-count-up";
import { BankTransferFlow } from "../AddFundFiatModal/bank-transfer-flow";

export function AssetValueCard() {
  const { hidden, toggle: toggleHidden } = useBalanceVisibility();
  const { view, setView } = useCurrencyViewStore();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const {
    data: getAllWalletBalance,
    error: getAllWalletBalanceError,
    isPending: getAllWalletBalancePending,
  } = UseGetAllWalletBalances();

  const mainWallet = getAllWalletBalance?.data?.data || [];

  const totalBalance = sumWallets(mainWallet);
  const totalCryptoEquivalent = sumWalletsEquivalent(mainWallet);
  // Count the headline from the old figure to the new one, including when
  // the NGN/USDT view is switched.
  const countedTotal = useCountUp(
    view === "NGN" ? totalBalance : totalCryptoEquivalent,
  );
  const countedUsd = useCountUp(totalCryptoEquivalent);
  return (
    <>
      <DashboardCard
        data-tour="balance"
        className="border border-teal-border bg-teal-light dark:bg-surface-primary"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text text-sm">
              <span className="leading-6">Total Asset Value</span>
              <button
                type="button"
                aria-label={hidden ? "Show balance" : "Hide balance"}
                onClick={toggleHidden}
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
                <div className="h-11 flex items-center">
                  <span className="sr-only">Loading balance</span>
                  <div className="h-8 w-40 sm:w-48 rounded-md bg-card-text/10 animate-pulse" />
                </div>
              )}
              {!getAllWalletBalancePending && (
                <span
                  // Remount on toggle so the figure blurs in each time it is shown or hidden.
                  key={hidden ? "hidden" : "shown"}
                  className="font-display tracking-[-0.04em] text-3xl sm:text-4xl text-card-text font-bold leading-11 tabular-nums motion-safe:animate-reveal"
                >
                  {hidden
                    ? "•••••••"
                    : `${view === "NGN" ? "₦" : "$"}${countedTotal.toLocaleString()}`}
                </span>
              )}
              {getAllWalletBalanceError && (
                <ErrorField message={getAllWalletBalanceError?.message} />
              )}
              <select
                value={view}
                onChange={(e) => setView(e.target.value as "NGN" | "CRYPTO")}
                className="bg-transparent text-card-text/60 text-base md:text-xs outline-none"
              >
                <option value="NGN">NGN</option>
                <option value="CRYPTO">USDT</option>
              </select>
            </div>
            <p className="text-text text-xs font-normal leading-4.5">
              {hidden
                ? "≈ ••••••"
                : `≈ $${countedUsd.toLocaleString()} USD`}
            </p>
          </div>

          {/* Add Fund on the same row as the total; the transfer flow takes it from here */}
          <Button
            size="sm"
            data-tour="add-funds"
            className="w-full sm:w-auto"
            onClick={() => setAddFundsOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Fund
          </Button>
        </div>
      </DashboardCard>

      {addFundsOpen && (
        <BankTransferFlow onClose={() => setAddFundsOpen(false)} />
      )}
    </>
  );
}
