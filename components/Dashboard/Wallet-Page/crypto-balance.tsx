import React, { useState } from "react";
import { Download, Eye, EyeOff, RefreshCcw, Send } from "lucide-react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";
import { UseGetCryptoWallet } from "@/lib/services/wallet.service";
import { sumCryptoBalance, sumCryptoFiatEquivalent } from "@/lib/sumBalances";
import { DepositModal } from "./deposit-modal";

export const CryptoBalance = () => {
  const [hidden, setHidden] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [view, setView] = useState<"NGN" | "CRYPTO">("NGN");
  const { data, error, isPending } = UseGetCryptoWallet();
  const wallets = data?.data?.data || [];
  
  const latestWallet = wallets[0];
  return (
    <div>
      <DashboardCard className="border-[#0F766E] bg-[#042F2E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <span>Total Crypto Value</span>
              <button
                onClick={() => setHidden((h) => !h)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {hidden ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl sm:text-4xl font-bold">
                {hidden
                  ? "•••••••"
                  : view === "NGN"
                    ? `₦${sumCryptoFiatEquivalent(wallets).toLocaleString()}`
                    : `$${sumCryptoBalance(wallets).toLocaleString()}`}
              </p>
              <select
                value={view}
                onChange={(e) => setView(e.target.value as "NGN" | "CRYPTO")}
                className="bg-transparent text-white/60 text-xs outline-none"
              >
                <option value="NGN">NGN</option>
                <option value="CRYPTO">USDT</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text text-xs font-normal leading-4.5">
                ≈ ${latestWallet?.balance ?? 0}
              </span>
              <span className="bg-text h-1.5 w-1.5 rounded-full"></span>
              <span className="text-[#A6F4C5] text-xs font-medium leading-5">
                + ₦{latestWallet?.fiatEquivalent?.amount ?? 0} today
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size={"sm"}
              onClick={() => setAddFundsOpen(true)}
              className="flex items-center transition-colors"
            >
              <Download className="w-5 h-5" />
              Deposit
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex items-center transition-colors"
            >
              <Send className="w-5 h-5" />
              Send
            </Button>
            <Button
              size={"sm"}
              variant={"outline"}
              className="flex items-center transition-colors"
            >
              <RefreshCcw className="w-5 h-5" />
              Convert
            </Button>
          </div>
        </div>
      </DashboardCard>
      {
        addFundsOpen && <DepositModal onClose={() => setAddFundsOpen(false)} />
      }
    </div>
  );
};
