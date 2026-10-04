"use client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { CATEGORIES, QUICK_ACTIONS, RECENT_TRANSACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { BillerLogo } from "./biller-logo";
import {
  Biller,
  BillerCategoryId,
  BILLERS,
  billersByCategory,
  findBiller,
} from "./billers-data";
import { BillTransaction, PayBillModal } from "./pay-bill-modal";

export default function BillPaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BillerCategoryId | null>(null);
  const [payingBiller, setPayingBiller] = useState<Biller | null>(null);
  const [transactions, setTransactions] =
    useState<BillTransaction[]>(RECENT_TRANSACTIONS);

  const query = search.trim().toLowerCase();
  const searchResults = query
    ? BILLERS.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.desc.toLowerCase().includes(query) ||
          b.category.includes(query),
      )
    : [];

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  const billerTile = (biller: Biller) => (
    <button
      key={biller.id}
      onClick={() => setPayingBiller(biller)}
      className="group flex items-center gap-3 p-4 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
    >
      <BillerLogo
        logo={biller.logo}
        name={biller.name}
        fallbackColor={biller.fallbackColor}
        size={44}
        rounded="rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors truncate">
          {biller.name}
        </p>
        <p className="text-xs text-text truncate mt-0.5">{biller.desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
    </button>
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-card-text">
          Bill Payments
        </h1>
        <p className="text-sm text-text mt-0.5">
          Pay your bills quickly and securely
        </p>
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

      {query ? (
        /* Search results across every category */
        <div>
          <h3 className="font-semibold text-card-text text-sm mb-1">
            Search Results
          </h3>
          <p className="text-xs text-text mb-4">
            {searchResults.length} biller{searchResults.length === 1 ? "" : "s"}{" "}
            matching “{search.trim()}”
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map(billerTile)}
            </div>
          ) : (
            <div className="bg-card-background border border-border rounded-2xl p-8 text-center text-sm text-text">
              No billers found. Try MTN, IKEDC or DSTV.
            </div>
          )}
        </div>
      ) : selectedCategory && activeCategory ? (
        /* Billers in the selected category */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-lg border border-border text-text hover:text-card-text hover:border-border-active transition-colors"
              aria-label="Back to categories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-semibold text-card-text text-sm">
                {activeCategory.name}
              </h3>
              <p className="text-xs text-text">Choose a biller to continue</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {billersByCategory(selectedCategory).map(billerTile)}
          </div>
        </div>
      ) : (
        /* Browse by category */
        <div>
          <h3 className="font-semibold text-card-text text-sm mb-1">
            Browse by Category
          </h3>
          <p className="text-xs text-text mb-4">
            Select a service below to get started
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as BillerCategoryId)}
                  className="group flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors leading-tight">
                      {cat.name}
                    </p>
                    <p className="text-xs text-text mt-0.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-Green font-medium">
                    Select <ArrowUpRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-text text-sm">
              Recent Transaction
            </h3>
            <button className="text-xs text-Green flex items-center gap-1 hover:underline">
              See all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 4).map((tx, i) => {
              const biller = findBiller(tx.billerId);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-border/20 transition-colors rounded-lg px-1 cursor-pointer"
                >
                  <BillerLogo
                    logo={biller?.logo}
                    name={biller?.name ?? tx.name}
                    fallbackColor={biller?.fallbackColor}
                    size={36}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-text">
                      {tx.name}
                    </p>
                    <p className="text-xs text-text truncate">
                      {tx.number} • {tx.time}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-card-text">
                      {tx.amount}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card-background border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-card-text text-sm mb-4">
            Quick Action
          </h3>
          <div className="space-y-2.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-border-active transition-colors text-left group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${action.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-text">
                      {action.label}
                    </p>
                    <p className="text-xs text-text">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {payingBiller && (
        <PayBillModal
          biller={payingBiller}
          onClose={() => setPayingBiller(null)}
          onSuccess={(tx) => setTransactions((prev) => [tx, ...prev])}
        />
      )}
    </div>
  );
}
