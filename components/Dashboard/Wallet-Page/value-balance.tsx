"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ErrorField } from "@/components/ui/field-error";
import {
  UseGetAllWalletBalances,
  UseGetCryptoWallet,
  UseGetFiatWallet,
} from "@/lib/services/wallet.service";
import {
  sumCryptoFiatEquivalent,
  sumFiatBalances,
  sumWallets,
  sumWalletsEquivalent,
} from "@/lib/sumBalances";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const ValueBalance = () => {
  const [hidden, setHidden] = useState(false);
  const {
    data: getAllWalletBalance,
    error: getAllWalletBalanceError,
    isPending: getAllWalletBalancePending,
  } = UseGetAllWalletBalances();

  const mainWallet = getAllWalletBalance?.data?.data || [];

  const totalBalance = sumWallets(mainWallet);
  const totalCryptoEquivalent = sumWalletsEquivalent(mainWallet);

  return (
    <div>
      <DashboardCard className="border-blue-border bg-blue-light">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text text-[14px] leading-6 font-normal">
              <span>Total Portfolio Value</span>
              <button
                onClick={() => setHidden((h) => !h)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {hidden ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {getAllWalletBalancePending && (
              <div className="text-sm text-card-text font-bold leading-11">
                Your balance might have changed
              </div>
            )}
            {!getAllWalletBalancePending && !getAllWalletBalanceError && (
              <p className="text-3xl sm:text-4xl font-bold text-card-text ">
                {hidden
                  ? "₦•••••••"
                  : totalBalance
                    ? `₦${totalBalance.toLocaleString()}`
                    : "₦0"}
              </p>
            )}
            {(getAllWalletBalanceError) && (
              <ErrorField
                message={getAllWalletBalanceError?.message}
              />
            )}

            {!getAllWalletBalancePending && !getAllWalletBalancePending && (
              <span className="text-text text-xs font-normal leading-4.5">
                {hidden
                  ? "₦•••••••"
                  : `≈ ₦${totalBalance.toLocaleString()} today`}
              </span>
            )}
            {getAllWalletBalancePending && getAllWalletBalancePending && (
              <span className="text-text text-xs font-normal leading-4.5">
                Calculating...
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-sm:flex-row max-sm:w-full">
            <div className="border-l-3 border-[#004C99] bg-border px-4 py-3 max-sm:w-full ">
              <p className="text-text font-medium leading-5 text-[12px]">
                Fiat
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••••••"
                  : totalBalance
                    ? `₦${totalBalance.toLocaleString()}`
                    : "₦0.00"}
              </p>
            </div>
            <div className="border-l-3 border-border-active bg-border px-4 py-3 max-sm:w-full ">
              <p className="text-text font-medium leading-5 text-[12px]">
                Crypto
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••"
                  : totalCryptoEquivalent
                    ? `₦${totalCryptoEquivalent.toLocaleString()}`
                    : "₦0"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
