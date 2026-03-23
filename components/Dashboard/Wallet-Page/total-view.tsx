"use client"
import { Eye, EyeOff, Send } from "lucide-react";
import { useState } from "react";
import { TransactionHistory } from "./transaction-history";

function TotalValueView() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="space-y-4">
      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0a2040] via-[#0d3560] to-[#0a1f42] p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <span>Total Portfolio Value</span>
              <button onClick={() => setHidden(h => !h)} className="opacity-60 hover:opacity-100 transition-opacity">
                {hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-3xl sm:text-4xl font-bold">{hidden ? "₦•••••••" : "₦12,345,234.45"}</p>
            <p className="text-white/50 text-xs mt-1">+₦240,000 (0.85) today</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <p className="text-white/60 text-[10px] mb-1">Flat</p>
              <p className="font-semibold text-sm">{hidden ? "₦•••" : "₦10,345,234.00"}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <p className="text-white/60 text-[10px] mb-1">Crypto</p>
              <p className="font-semibold text-sm">{hidden ? "₦•••" : "₦2,000,000.45"}</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* This month's spending */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-card-text text-sm mb-3">This Month's Spending</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Crypto", amount: "₦284,000", txns: "4 transactions", color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Transfers", amount: "₦189,000", txns: "3 transactions", color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Bill Payments", amount: "₦64,000", txns: "14 transactions", color: "text-orange-400", bg: "bg-orange-500/10" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
              <div className={`w-8 h-8 rounded-full ${s.bg} border border-current/20 flex items-center justify-center ${s.color}`}>
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