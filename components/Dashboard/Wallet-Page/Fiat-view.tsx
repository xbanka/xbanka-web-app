"use client"
import { Send } from "lucide-react";
import { TransactionHistory } from "./transaction-history";

export function FlatView() {
  return (
    <div className="space-y-4">
      {/* Spending + transactions reused */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-card-text text-sm mb-3">This Month's Spending</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Crypto", amount: "₦284,000", txns: "4 transactions", color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Transfers", amount: "₦189,000", txns: "3 transactions", color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Bill Payments", amount: "₦64,000", txns: "14 transactions", color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
              <div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center ${s.color}`}>
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs text-text">{s.label}</p>
                <p className={`font-bold text-sm ${s.color}`}>{s.amount}</p>
                <p className="text-[10px] text-text">{s.txns}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
}