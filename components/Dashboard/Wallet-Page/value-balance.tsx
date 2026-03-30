"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export const ValueBalance = () => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetAllWalletBalances();
  const wallets = data?.data?.data || [];
  const latestWallet = wallets[0];
  
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
                : data?.data?.totalBalance
                  ? `₦${data.data.totalBalance.toLocaleString()}`
                  : "₦0"}
            </p>
            <span className="text-text text-xs font-normal leading-4.5">
              ≈ ₦{latestWallet?.fiatEquivalent?.amount ?? 0} today
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="border-l-3 border-[#004C99] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">
                Fiat
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••"
                  : data?.data?.data[0]?.balance
                    ? data?.data?.data[0]?.balance
                    : "₦0"}
              </p>
            </div>
            <div className="border-l-3 border-[#2DD4BF] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">
                Crypto
              </p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden
                  ? "₦•••"
                  : data?.data?.data[1]?.balance
                    ? data?.data?.data[1]?.balance
                    : "₦0"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
