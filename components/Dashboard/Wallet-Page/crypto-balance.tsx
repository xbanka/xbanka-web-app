import React, { useState } from "react";
import { Download, Eye, EyeOff, RefreshCcw, Send } from "lucide-react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Button } from "@/components/ui/button";

export const CryptoBalance = () => {
  const [hidden, setHidden] = useState(false);
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
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-bold">
                {hidden ? "₦•••••••" : "₦2,000,000.45"}
              </p>
              <span className="text-white/60 text-xs">≈ $1,103 USDT</span>
            </div>
            <p className="text-white/50 text-xs mt-1">+₦240,000 (0.85) today</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size={"sm"} className="flex items-center transition-colors">
              <Download className="w-5 h-5" />
              Deposit
            </Button>
            <Button size={"sm"} variant={"outline"} className="flex items-center transition-colors">
              <Send className="w-5 h-5" />
              Send
            </Button>
            <Button size={"sm"} variant={"outline"} className="flex items-center transition-colors">
              <RefreshCcw className="w-5 h-5" />
              Convert
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};
