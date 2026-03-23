"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export const ValueBalance = () => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetAllWalletBalances()
  console.log("wallet balane", data)
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
              {hidden ? "₦•••••••" : "₦12,345,234.45"}
            </p>
            <p className="text-[#A6F4C5] text-xs font-medium leading-5">+₦240,000 (0.85) today</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="border-l-3 border-[#004C99] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">Flat</p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden ? "₦•••" : "₦10,345,234.00"}
              </p>
            </div>
            <div className="border-l-3 border-[#2DD4BF] bg-border px-4 py-3">
              <p className="text-text font-medium leading-5 text-[12px]">Crypto</p>
              <p className="font-medium leading-5 text-sm text-card-text">
                {hidden ? "₦•••" : "₦2,000,000.45"}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
