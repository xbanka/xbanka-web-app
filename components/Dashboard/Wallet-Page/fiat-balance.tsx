"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { UseGetFiatWallet } from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { Download, Eye, EyeOff, Plus, Send } from "lucide-react";
import { useState } from "react";

export const FiatBalance = () => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetFiatWallet()
  console.log("fiat wallet balance", data)
  return (
    <div>
      <DashboardCard className="border-[#004C99] bg-[#051D33]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text text-[14px] leading-6 font-normal">
              <span>Available Balance</span>
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
              {hidden ? "₦•••••••" : data?.data ? `₦${sumFiatBalances(data?.data?.data).toLocaleString()}` : "₦0.00" }
            </p>
            <p className="text-[#A6F4C5] text-xs font-medium leading-5">+₦240,000 (0.85) today</p>
          </div>
          <div className="flex items-center gap-4">
            <Button size={"sm"} className="flex items-center transition-colors">
              <Plus className="w-5 h-5" />
              Add Fund
            </Button>
            <Button variant={"outline"} size={"sm"} className="flex items-center transition-colors">
              <Download className="w-5 h-5" />
              Deposit
            </Button>
            <Button variant={"outline"} className="flex items-center transition-colors">
              <Send className="w-5 h-5" />
              Send
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
