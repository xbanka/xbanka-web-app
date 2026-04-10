"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import {
  UseGetAllWalletBalances,
  UseGetCryptoWallet,
  UseGetFiatWallet,
} from "@/lib/services/wallet.service";
import { sumCryptoFiatEquivalent, sumFiatBalances } from "@/lib/sumBalances";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export const ValueBalance = () => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetAllWalletBalances();
  const {
    data: fiatData,
    error: fiatError,
    isPending: fiatIsPending,
  } = UseGetFiatWallet();
  const wallets = fiatData?.data?.data || [];
  const fiatBalance = sumFiatBalances(wallets)
  const latestWallet = wallets[0];
  const { data: cryptoData, error: cryptoError, isPending: cryptoIsPending } = UseGetCryptoWallet();
  const cryptoWallets = cryptoData?.data?.data || [];
  const cryptoBalance = sumCryptoFiatEquivalent(cryptoWallets);
  const totalBalance = fiatBalance + cryptoBalance;

  return (
    <div>
      <DashboardCard className="border-[#004C99] bg-[#051D33]">
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
            <p className="text-3xl sm:text-4xl font-bold text-card-text">
              {hidden
                ? "₦•••••••"
                : totalBalance
                  ? `₦${totalBalance.toLocaleString()}`
                  : "₦0"}
            </p>
            <span className="text-text text-xs font-normal leading-4.5">
              ≈ ₦{totalBalance.toLocaleString()} today
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="border-l-3 border-[#004C99] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">
                Fiat
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••••••"
                  : fiatBalance
                    ? `₦${fiatBalance.toLocaleString()}`
                    : "₦0.00"}
              </p>
            </div>
            <div className="border-l-3 border-[#2DD4BF] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">
                Crypto
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••"
                  : cryptoBalance
                    ? `₦${cryptoBalance.toLocaleString()}`
                    : "₦0"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
