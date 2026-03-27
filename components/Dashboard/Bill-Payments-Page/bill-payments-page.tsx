"use client"
import { CATEGORIES, QUICK_ACTIONS, RECENT_TRANSACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { MtnAvatar } from "./mtn-avatar";
import { useState } from "react";

export default function BillPaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
 
  const filtered = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-card-text">Bill Payments</h1>
        <p className="text-sm text-text mt-0.5">Pay your bills quickly and securely</p>
      </div>
 
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for billers e.g MTN, IKEDC, DSTV"
          className="w-full h-12 pl-11 pr-4 text-sm border border-input rounded-xl bg-card-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]"
        />
      </div>
 
      {/* Browse by category */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-card-text text-sm mb-1">Browse by Category</h3>
        <p className="text-xs text-text mb-4">Select a service below to get started</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filtered.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`group flex flex-col gap-3 p-4 rounded-xl border text-left transition-all
                ${selectedCategory === cat.id
                  ? "border-Green bg-Green/5"
                  : "border-border hover:border-border-active"
                }`}
            >
              <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-xl`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors leading-tight">
                  {cat.name}
                </p>
                <p className="text-xs text-text mt-0.5 leading-relaxed">{cat.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-Green font-medium">
                Select <ArrowUpRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
 
      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-text text-sm">Recent Transaction</h3>
            <button className="text-xs text-Green flex items-center gap-1 hover:underline">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((tx, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-border/20 transition-colors rounded-lg px-1 cursor-pointer"
              >
                <MtnAvatar />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-text">{tx.name}</p>
                  <p className="text-xs text-text truncate">{tx.number} • {tx.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-card-text">{tx.amount}</p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Quick Actions */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-card-text text-sm mb-4">Quick Action</h3>
          <div className="space-y-2.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-border-active transition-colors text-left group"
                >
                  <div className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-text">{action.label}</p>
                    <p className="text-xs text-text">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
 