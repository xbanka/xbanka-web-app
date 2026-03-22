"use client"
import { ArrowUpDown } from "lucide-react";
import { AmountRow } from "./amount-input";
import { useState } from "react";
import { MarketHighlight } from "./market-highlight";
import { DashboardCard } from "@/components/Layout/DashboardCard";

export function ConvertTab() {
  const [fromAmount, setFromAmount] = useState("823.50");
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <DashboardCard className="lg:col-span-2 space-y-3">
        <AmountRow
          label="From"
          available="0.00034 BTC"
          value={fromAmount}
          onChange={setFromAmount}
          currency="BTC"
          onCurrencyToggle={() => {}}
          showMax
        />
        <p className="text-[10px] text-text px-1">Min: 0.0001 BTC • Max: 1 BTC</p>
 
        {/* Swap icon */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full border border-border bg-card-background flex items-center justify-center text-text hover:border-border-active hover:text-Green transition-colors cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
          </div>
        </div>
 
        <AmountRow
          label="To (Estimated)"
          value="₦1,092,010.34"
          onChange={() => {}}
          currency="USDT"
          onCurrencyToggle={() => {}}
        />
 
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-text">1 BTC = 92,300 USDT</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-text">Transaction Fee</span>
          <span className="text-green-500 font-medium">0 Fee</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1 font-medium">
          <span className="text-text">You get</span>
          <span className="text-card-text">0.00 USDT</span>
        </div>
 
        <button className="w-full h-11 rounded-xl bg-Green hover:bg-Green/90 text-white text-sm font-semibold transition-colors">
          Get Quote
        </button>
        <p className="text-[10px] text-text text-center">
          By Proceeding, you agree to Xbanka{" "}
          <span className="text-Green cursor-pointer hover:underline">Terms & Conditions</span>
          {" "}and{" "}
          <span className="text-Green cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </DashboardCard>
      <MarketHighlight />
    </div>
  );
}