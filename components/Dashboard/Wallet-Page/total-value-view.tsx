import { useState } from "react";
import { TransactionHistory } from "./transaction-history";
import { BlocksIcon, Eye, EyeOff, LucideGift, Send } from "lucide-react";

export function TotalValueView() {
  return (
    <div className="space-y-4">
      {/* This month's spending */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-card-text text-sm mb-3">This Month's Spending</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Crypto", icon: BlocksIcon, amount: "₦284,000", txns: "4 transactions", color: "text-abstract-green bg-[#0F766E]", },
            { label: "Transfers", icon: LucideGift, amount: "₦189,000", txns: "3 transactions", color: "bg-[#037508] text-[#A6F4C5]", },
            { label: "Bill Payments", icon: BlocksIcon, amount: "₦64,000", txns: "14 transactions", color: "bg-[#004C99] text-[#B7DBFF]", },
          ].map((s) => (
            <div key={s.label} className={`rounded-md bg-border px-3 py-2.5 flex items-center gap-3`}>
              <div className={`p-2.5 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium leading-5 text-xs text-text">{s.label}</p>
                <p className={`ffont-medium leading-5 text-card-text text-sm`}>{s.amount}</p>
                <p className="font-medium leading-5 text-xs text-text">{s.txns}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <TransactionHistory />
    </div>
  );
}