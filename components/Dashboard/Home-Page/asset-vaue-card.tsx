"use client";

import { useState } from "react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { sumWallets, sumWalletsEquivalent } from "@/lib/sumBalances";
import { getWalletTotals } from "@/lib/walletTotals";
import { useCurrencyViewStore } from "@/store/currency-view.store";
import { Download, Eye, EyeOff, Plus } from "lucide-react";
import { useBalanceVisibility } from "@/hooks/use-balance-visibility";
import { BankTransferFlow } from "../AddFundFiatModal/bank-transfer-flow";
import { DepositSidebar } from "../Wallet-Page/deposit-crypto-sidebar";

export function AssetValueCard() {
  const { hidden, toggle: toggleHidden } = useBalanceVisibility();
  const { view, setView } = useCurrencyViewStore();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const {
    data: getAllWalletBalance,
    error: getAllWalletBalanceError,
    isPending: getAllWalletBalancePending,
  } = UseGetAllWalletBalances();

  const mainWallet = getAllWalletBalance?.data?.data || [];

  const totalBalance = sumWallets(mainWallet);
  const totalCryptoEquivalent = sumWalletsEquivalent(mainWallet);
  // Per-wallet figures for the tiles below. Only CRYPTO wallets count as
  // crypto, so a naira deposit no longer shows up on the crypto side.
  const { fiatNgn, cryptoUsd, cryptoNgn } = getWalletTotals(mainWallet);

  const money = (symbol: string, value: number) =>
    hidden ? `${symbol}•••••••` : `${symbol}${value.toLocaleString()}`;

  return (
    <>
      <DashboardCard className="border border-teal-border bg-teal-light space-y-4">
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
                className="bg-transparent text-card-text/60 text-base md:text-xs outline-none"
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

        {/* Fiat and crypto wallets, each with its quick action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card-background px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-text leading-5">Fiat wallet</p>
              <p className="text-base font-semibold text-card-text truncate">
                {getAllWalletBalancePending ? "…" : money("₦", fiatNgn)}
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => setAddFundsOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Fund
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card-background px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-text leading-5">Crypto wallet</p>
              <p className="text-base font-semibold text-card-text truncate">
                {getAllWalletBalancePending ? "…" : money("$", cryptoUsd)}
              </p>
              <p className="text-[11px] text-text leading-4">
                {hidden ? "≈ ₦•••" : `≈ ₦${cryptoNgn.toLocaleString()}`}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => setDepositOpen(true)}
            >
              <Download className="w-4 h-4" />
              Deposit
            </Button>
          </div>
        </div>
      </DashboardCard>

      {addFundsOpen && (
        <BankTransferFlow onClose={() => setAddFundsOpen(false)} />
      )}
      <DepositSidebar open={depositOpen} onClose={() => setDepositOpen(false)} />
    </>
  );
}
