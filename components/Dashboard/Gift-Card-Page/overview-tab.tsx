"use state"

import { CARD_RATES, GIFT_TRANSACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { ArrowDown, ArrowUp, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { PayoutChart } from "./payout-chart";
import { useState } from "react";

export function OverviewTab() {
  const [period, setPeriod] = useState("Weekly");
 
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Cards Sold", value: "23", sub: "+1.0% vs last month", icon: "📦", color: "bg-blue-500/10 text-blue-500" },
          { label: "Total Payout", value: "₦22,456,235.00", sub: "+3.0% vs last week", icon: "💰", color: "bg-green-500/10 text-green-500" },
          { label: "Top Traded Card", value: "Amazon", sub: "35 Traded", icon: "🏆", color: "bg-orange-500/10 text-orange-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card-background border border-border rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-base mb-3`}>
              {s.icon}
            </div>
            <p className="text-xs text-text mb-1">{s.label}</p>
            <p className="text-lg font-bold text-card-text">{s.value}</p>
            <p className="text-xs text-text mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-card-text text-sm">Payout Over Time</h3>
              <p className="text-xs text-text mt-0.5">Transaction volume by service</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 text-card-text hover:border-border-active transition-colors">
              {period}
              <ChevronDown className="w-3.5 h-3.5 text-placeholder" />
            </button>
          </div>
          {/* Y-axis labels */}
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[10px] text-text py-1 pr-2">
              {["₦700k", "₦600k", "₦500k", "₦400k", "₦300k"].map(v => (
                <span key={v}>{v}</span>
              ))}
            </div>
            <div className="flex-1">
              <PayoutChart />
            </div>
          </div>
        </div>
 
        {/* Current card rates */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-text text-sm">Current Card Rates</h3>
            <button className="text-xs text-Green hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CARD_RATES.map((card) => (
              <div key={card.name} className="border border-border rounded-xl p-3 hover:border-border-active transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: card.bg }}
                  >
                    {card.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-card-text">{card.name}</p>
                    <span className={`text-[10px] flex items-center gap-0.5 ${card.up ? "text-green-500" : "text-red-500"}`}>
                      {card.up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                      {card.change} today
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text">{card.rate}</p>
                  <button className="text-xs text-Green font-medium hover:underline">Trade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Transaction History */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-card-text text-sm">Transaction History</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
              <input placeholder="Search..." className="pl-8 pr-3 h-8 text-xs border border-input rounded-lg bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active w-36" />
            </div>
            <button className="flex items-center gap-1.5 h-8 px-3 text-xs border border-input rounded-lg text-card-text hover:border-border-active transition-colors">
              Transaction Type <SlidersHorizontal className="w-3 h-3 text-placeholder" />
            </button>
          </div>
        </div>
        <div className="flex gap-1 mb-4 border-b border-border overflow-x-auto">
          {["All", "Pending", "Completed", "In Progress", "Failed"].map((t) => (
            <button key={t} className="pb-2 px-3 text-xs font-medium border-b-2 border-transparent text-text hover:text-card-text whitespace-nowrap transition-colors first:border-Green first:text-Green">{t}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text border-b border-border">
                <th className="text-left pb-2 font-medium">Date & Time</th>
                <th className="text-left pb-2 font-medium">Reference ID</th>
                <th className="text-left pb-2 font-medium">Card Type</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Payout</th>
                <th className="text-left pb-2 font-medium">Region</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {GIFT_TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="hover:bg-border/20 transition-colors">
                  <td className="py-2.5">
                    <p className="text-card-text font-medium">{tx.date}</p>
                    <p className="text-text">{tx.time}</p>
                  </td>
                  <td className="py-2.5 font-mono text-text">{tx.ref}</td>
                  <td className="py-2.5 text-card-text">{tx.cardType}</td>
                  <td className="py-2.5 font-medium text-card-text">{tx.amount}</td>
                  <td className="py-2.5 text-Green font-medium">{tx.payout}</td>
                  <td className="py-2.5 text-text">{tx.region}</td>
                  <td className="py-2.5"><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}