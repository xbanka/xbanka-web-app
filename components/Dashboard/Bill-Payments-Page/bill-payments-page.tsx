"use client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronRight, Search } from "lucide-react";
import { CATEGORIES, QUICK_ACTIONS, RECENT_TRANSACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/ui/error-layout";
import { cn } from "@/lib/utils";
import { useBillNetworks, useDiscos } from "@/lib/services/bills.service";
import { BillPayment, Disco } from "@/lib/types/bills-types";
import { BillerLogo } from "./biller-logo";
import {
  Biller,
  BillerCategoryId,
  BILLERS,
  BillTransaction,
  findBiller,
  formatNaira,
  discoBiller,
  isCategoryLive,
  networkBiller,
} from "./billers-data";
import { BillCheckoutModal } from "./bill-checkout-modal";

const STATUS_LABELS: Record<BillPayment["status"], string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
};

export default function BillPaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BillerCategoryId | null>(null);
  const [payingNetwork, setPayingNetwork] = useState<string | null>(null);
  const [payingDisco, setPayingDisco] = useState<Disco | null>(null);
  const [transactions, setTransactions] =
    useState<BillTransaction[]>(RECENT_TRANSACTIONS);

  const networks = useBillNetworks(selectedCategory === "airtime");
  const discos = useDiscos(selectedCategory === "electricity");

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

  /** Upserts a payment into the recent list by reference, so the PENDING →
   *  COMPLETED/FAILED poll updates the row instead of adding a new one. */
  const handlePayment = (payment: BillPayment) => {
    setTransactions((prev) => {
      const status = STATUS_LABELS[payment.status];
      const existing = prev.findIndex((t) => t.reference === payment.reference);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], status };
        return next;
      }
      return [
        {
          billerId: (payingDisco?.code ?? payingNetwork)?.toLowerCase() ?? "",
          name: payment.note,
          number: payment.reference.slice(0, 14),
          time: "Just now",
          amount: formatNaira(payment.amount),
          status,
          reference: payment.reference,
        },
        ...prev,
      ];
    });
  };

  /** Search results are display metadata only; airtime tiles open checkout
   *  directly, electricity ones open the live disco list so the code we send
   *  is the one the API returned. */
  const openBiller = (biller: Biller) => {
    if (biller.category === "electricity") {
      setSearch("");
      setSelectedCategory("electricity");
      return;
    }
    setPayingNetwork(biller.id.toUpperCase());
  };

  const billerTile = (biller: Biller) => {
    const live = isCategoryLive(biller.category);
    return (
      <button
        key={biller.id}
        onClick={live ? () => openBiller(biller) : undefined}
        disabled={!live}
        className={cn(
          "group flex items-center gap-3 p-4 rounded-2xl border border-border bg-card-background transition-colors text-left",
          live ? "hover:border-border-active" : "opacity-60 cursor-not-allowed",
        )}
      >
        <BillerLogo
          logo={biller.logo}
          name={biller.name}
          fallbackColor={biller.fallbackColor}
          size={44}
          rounded="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold text-card-text truncate",
              live && "group-hover:text-Green transition-colors",
            )}
          >
            {biller.name}
          </p>
          <p className="text-xs text-text truncate mt-0.5">{biller.desc}</p>
        </div>
        {live ? (
          <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
        ) : (
          <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full border border-border text-text">
            Coming soon
          </span>
        )}
      </button>
    );
  };

  const networkTile = (network: string) => {
    const meta = networkBiller(network);
    return (
      <button
        key={network}
        onClick={() => setPayingNetwork(network)}
        className="group flex items-center gap-3 p-4 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
      >
        <BillerLogo
          logo={meta?.logo}
          name={meta?.name ?? network}
          fallbackColor={meta?.fallbackColor}
          size={44}
          rounded="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors truncate">
            {meta?.name ?? network}
          </p>
          <p className="text-xs text-text truncate mt-0.5">
            Airtime & data bundles
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
      </button>
    );
  };

  const discoTile = (disco: Disco) => {
    const meta = discoBiller(disco.code);
    return (
      <button
        key={disco.code}
        onClick={() => setPayingDisco(disco)}
        className="group flex items-center gap-3 p-4 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
      >
        <BillerLogo
          logo={meta?.logo}
          name={disco.name}
          fallbackColor={meta?.fallbackColor}
          size={44}
          rounded="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors truncate">
            {disco.name}
          </p>
          <p className="text-xs text-text truncate mt-0.5">
            {meta?.desc ?? "Prepaid & postpaid"}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
      </button>
    );
  };

  const catalogue = selectedCategory === "electricity" ? discos : networks;

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
              <p className="text-xs text-text">
                {selectedCategory === "electricity"
                  ? "Choose your electricity provider"
                  : "Choose a network to continue"}
              </p>
            </div>
          </div>
          {catalogue.isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-19.5 rounded-2xl border border-border bg-card-background animate-pulse"
                />
              ))}
            </div>
          ) : catalogue.error ? (
            <div className="max-w-md space-y-3">
              <ErrorLayout message={catalogue.error.message} />
              <Button variant="outline" onClick={() => catalogue.refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCategory === "electricity"
                ? discos.data?.map(discoTile)
                : networks.data?.map(networkTile)}
            </div>
          )}
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
              const live = isCategoryLive(cat.id as BillerCategoryId);
              return (
                <button
                  key={cat.id}
                  onClick={
                    live
                      ? () => setSelectedCategory(cat.id as BillerCategoryId)
                      : undefined
                  }
                  disabled={!live}
                  className={cn(
                    "group flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card-background transition-colors text-left",
                    live
                      ? "hover:border-border-active"
                      : "opacity-60 cursor-not-allowed",
                  )}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-white`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold text-card-text leading-tight",
                        live && "group-hover:text-Green transition-colors",
                      )}
                    >
                      {cat.name}
                    </p>
                    <p className="text-xs text-text mt-0.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  {live ? (
                    <div className="flex items-center gap-1 text-xs text-Green font-medium">
                      Select <ArrowUpRight className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="text-xs text-text font-medium">
                      Coming soon
                    </div>
                  )}
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
                  key={tx.reference ?? i}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-border/20 transition-colors rounded-lg px-1 cursor-pointer"
                >
                  <BillerLogo
                    logo={biller?.logo}
                    name={biller?.name ?? tx.name}
                    fallbackColor={biller?.fallbackColor}
                    size={36}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-text truncate">
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

      {(payingNetwork || payingDisco) && (
        <BillCheckoutModal
          network={payingNetwork ?? undefined}
          disco={payingDisco ?? undefined}
          onClose={() => {
            setPayingNetwork(null);
            setPayingDisco(null);
          }}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
}
