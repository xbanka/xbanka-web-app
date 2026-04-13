"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { UseGetFiatWallet } from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { Download, Eye, EyeOff, Plus, Send } from "lucide-react";
import { useState } from "react";
import { AddFundsModal } from "./add-funds-modal";
import { AddFundModal } from "./add-fund-modal";

export const FiatBalance = ({ isBvnVerified }: { isBvnVerified: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const { data, error, isPending } = UseGetFiatWallet();
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const wallets = data?.data?.data || [];
  const latestWallet = wallets[0];
  const isAddFundDisabled = !isBvnVerified;
  console.log("fiat wallet balance", data);
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
              {hidden
                ? "₦•••••••"
                : data?.data
                  ? `₦${sumFiatBalances(wallets).toLocaleString()}`
                  : "₦0.00"}
            </p>
            <span className="text-text text-xs font-normal leading-4.5">
              ≈ ₦{latestWallet?.balance ?? 0} today
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="">
              <Button
              onClick={() => setAddFundsOpen(true)}
                variant={isAddFundDisabled ? "disabled" : "default"}
                disabled={isAddFundDisabled}
                size={"sm"}
                className="flex items-center transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Fund
              </Button>
              {isAddFundDisabled && (
                <span className="text-[10px] text-error-text">
                  Verify your bvn
                </span>
              )}
            </div>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center transition-colors"
            >
              <Download className="w-5 h-5" />
              Deposit
            </Button>
            <Button
              variant={"outline"}
              className="flex items-center transition-colors"
            >
              <Send className="w-5 h-5" />
              Send
            </Button>
          </div>
        </div>
        {addFundsOpen && (
          <AddFundModal
            open={addFundsOpen}
            onClose={() => setAddFundsOpen(false)}
            onSuccess={() => setAddFundsOpen(false)}
          />
        )}
        {/* {addFundsOpen && (
          <AddFundsModal
            open={addFundsOpen}
            onClose={() => setAddFundsOpen(false)}
            onSuccess={() => setAddFundsOpen(false)}
          />
        )} */}
      </DashboardCard>
    </div>
  );
};
