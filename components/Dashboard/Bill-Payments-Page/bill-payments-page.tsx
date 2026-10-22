"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronRight, Search, X } from "lucide-react";
import { CATEGORIES, QUICK_ACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/ui/error-layout";
import { cn } from "@/lib/utils";
import {
  useBettingProviders,
  useBillNetworks,
  useDiscos,
} from "@/lib/services/bills.service";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { BillPayment, BillProvider } from "@/lib/types/bills-types";
import { TransactionTypes } from "@/lib/types/transaction-types";
import {
  buildTransactionReceipt,
  TransactionReceiptData,
} from "@/lib/transactionReceipt";
import { parseMetadata } from "@/lib/parsedMetadata";
import { timeAgo } from "@/lib/formatDate";
import { TransactionReceiptModal } from "@/components/ui/transaction-receipt-modal";
import { BillerLogo } from "./biller-logo";
import {
  Biller,
  BillerCategoryId,
  BILLERS,
  billerFromText,
  BillTransaction,
  CABLE_PROVIDERS,
  categoryBiller,
  discoBiller,
  findBiller,
  formatNaira,
  isCategoryLive,
  networkBiller,
} from "./billers-data";
import { BillReceiptContext, buildBillReceipt } from "./bill-receipt";
import { BillCheckoutModal, CheckoutTarget } from "./bill-checkout-modal";
import { FavouriteBill, useFavouriteBills } from "./use-favourite-bills";

const CATEGORY_PROMPTS: Partial<Record<BillerCategoryId, string>> = {
  electricity: "Choose your electricity provider",
  cable: "Choose your TV provider",
  betting: "Choose your betting provider",
};

/** The Recent Transactions row icon is looked up by this id, so resolve the
 *  provider code to one of our biller ids where possible ("EKO" → ekedc). */
const targetBillerId = (target: CheckoutTarget) => {
  if (target.kind === "network") return target.network.toLowerCase();
  if (target.kind === "disco")
    return (
      categoryBiller("electricity", target.disco.code, target.disco.name)?.id ??
      target.disco.code.toLowerCase()
    );
  const category = target.kind === "cable" ? "cable" : "betting";
  return (
    categoryBiller(category, target.provider.code, target.provider.name)?.id ??
    target.provider.code.toLowerCase()
  );
};

const STATUS_LABELS: Record<BillPayment["status"], string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
};

/** A row in the recent list: a payment made this session (carries `payment`)
 *  or one from the user's transaction history (carries `historyTx`). */
type RecentRow = BillTransaction & { historyTx?: TransactionTypes };

export default function BillPaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<BillerCategoryId | null>(null);
  /** `prefill` is set only when checkout was opened from a saved favourite. */
  const [checkout, setCheckout] = useState<{
    target: CheckoutTarget;
    prefill?: FavouriteBill;
  } | null>(null);
  const { favourites, remove: removeFavourite } = useFavouriteBills();
  const [receipt, setReceipt] = useState<TransactionReceiptData | null>(null);
  /** Payments made this session — richer than their history rows (receipt
   *  context, live PENDING → COMPLETED status from the poll). */
  const [transactions, setTransactions] = useState<BillTransaction[]>([]);

  const history = UseGetTransactionHistory(1, 25);

  /** The user's real bill payments from transaction history, newest first.
   *  Confirming a payment invalidates this query, so new purchases appear
   *  here on their own once the session rows are gone. */
  const historyRows = useMemo<RecentRow[]>(() => {
    const items: TransactionTypes[] = history.data?.data?.data?.items ?? [];
    return items
      .filter((tx) => tx.type === "BILL_PAYMENT")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((tx) => {
        const meta = parseMetadata(tx.metadata) as Record<
          string,
          unknown
        > | null;
        const network = typeof meta?.network === "string" ? meta.network : "";
        // The metadata doesn't always name the network, but the description
        // does ("MTN data 2.5GB … for 0810…") — read both from it if needed.
        const biller = network
          ? networkBiller(network)
          : billerFromText(tx.note ?? "");
        const phone =
          [meta?.phoneNumber, meta?.recipientId, meta?.customerId].find(
            (v): v is string => typeof v === "string" && v !== "",
          ) ?? tx.note?.match(/\b0\d{10}\b/)?.[0];
        return {
          billerId: biller?.id ?? network.toLowerCase(),
          name: tx.note?.trim() || "Bill payment",
          number: phone ?? tx.reference.slice(0, 14),
          time: timeAgo(tx.createdAt) ?? "",
          amount: formatNaira(tx.amount),
          status: STATUS_LABELS[tx.status] ?? tx.status,
          reference: tx.reference,
          historyTx: tx,
        };
      });
  }, [history.data]);

  // Session rows first (newest payments), then history minus the payments
  // already shown as session rows.
  const sessionRefs = new Set(transactions.map((t) => t.reference));
  const recentRows: RecentRow[] = [
    ...transactions,
    ...historyRows.filter((r) => !sessionRefs.has(r.reference)),
  ].slice(0, 4);

  const query = search.trim().toLowerCase();

  // Electricity and betting providers come from the API, so search has to query
  // the live data (cached for 10 minutes) rather than only the hardcoded
  // billers
  const networks = useBillNetworks(selectedCategory === "airtime");
  const discos = useDiscos(selectedCategory === "electricity" || !!query);
  const bettingProviders = useBettingProviders(
    selectedCategory === "betting" || !!query,
  );

  const liveCatalogues = {
    electricity: discos,
    betting: bettingProviders,
  } as const;

  // Hardcoded billers stand in for a live category only until its list loads
  // (or if it fails to load), so search still shows something.
  const searchResults = query
    ? BILLERS.filter(
        (b) =>
          !(
            b.category in liveCatalogues &&
            liveCatalogues[b.category as keyof typeof liveCatalogues].isSuccess
          ) &&
          (b.name.toLowerCase().includes(query) ||
            b.desc.toLowerCase().includes(query) ||
            b.category.includes(query)),
      )
    : [];

  const liveSearchResults = query
    ? (Object.keys(liveCatalogues) as (keyof typeof liveCatalogues)[]).flatMap(
        (category) =>
          (liveCatalogues[category].data ?? [])
            .filter(
              (p) =>
                p.name.toLowerCase().includes(query) ||
                p.code.toLowerCase().includes(query) ||
                category.includes(query),
            )
            .map((provider) => ({ category, provider })),
      )
    : [];
  const resultCount = searchResults.length + liveSearchResults.length;

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  /** Upserts a payment into the recent list by reference, so the PENDING →
   *  COMPLETED/FAILED poll updates the row instead of adding a new one. The
   *  full payment rides along so the row can open its receipt later. */
  const handlePayment = (
    payment: BillPayment,
    context?: BillReceiptContext,
  ) => {
    setTransactions((prev) => {
      const status = STATUS_LABELS[payment.status];
      const existing = prev.findIndex((t) => t.reference === payment.reference);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], status, payment };
        return next;
      }
      return [
        {
          billerId: checkout ? targetBillerId(checkout.target) : "",
          name: payment.note,
          number:
            context?.phoneNumber ??
            context?.meterNumber ??
            payment.reference.slice(0, 14),
          time: "Just now",
          amount: formatNaira(payment.amount),
          status,
          reference: payment.reference,
          payment,
          phoneNumber: context?.phoneNumber,
          planName: context?.planName,
          meterNumber: context?.meterNumber,
        },
        ...prev,
      ];
    });
  };

  /** Session rows build their receipt from the live payment + checkout
   *  context; history rows use the shared history-receipt builder. */
  const openReceipt = (row: RecentRow) => {
    if (row.payment) {
      setReceipt(
        buildBillReceipt(row.payment, {
          networkName:
            findBiller(row.billerId)?.name ?? discoBiller(row.billerId)?.name,
          phoneNumber: row.phoneNumber,
          planName: row.planName,
          meterNumber: row.meterNumber,
        }),
      );
    } else if (row.historyTx) {
      setReceipt(buildTransactionReceipt(row.historyTx));
    }
  };

  /** Search results are display metadata only. Airtime and cable codes are
   *  known up front so those open checkout directly; electricity and betting
   *  open the live provider list so the code we send is the one the API
   *  returned. */
  const openBiller = (biller: Biller) => {
    if (biller.category === "airtime") {
      setCheckout({
        target: { kind: "network", network: biller.id.toUpperCase() },
      });
      return;
    }
    if (biller.category === "cable") {
      const provider = CABLE_PROVIDERS.find((p) => p.name === biller.name);
      if (provider) {
        setCheckout({ target: { kind: "cable", provider } });
        return;
      }
    }
    setSearch("");
    setSelectedCategory(biller.category);
  };

  /** Reopens checkout for a saved payment with its account already filled in.
   *  The remove button is a sibling rather than a child, since a button can't
   *  legally nest inside the tile's own button. */
  const favouriteTile = (fav: FavouriteBill) => {
    const biller = findBiller(fav.billerId);
    return (
      <div key={fav.id} className="relative">
        <button
          onClick={() =>
            setCheckout({
              target:
                fav.kind === "network"
                  ? { kind: "network", network: fav.code }
                  : fav.kind === "disco"
                    ? {
                        kind: "disco",
                        disco: { code: fav.code, name: fav.providerName },
                      }
                    : {
                        kind: fav.kind,
                        provider: { code: fav.code, name: fav.providerName },
                      },
              prefill: fav,
            })
          }
          className="group flex w-full items-center gap-3 p-4 pr-11 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
        >
          <BillerLogo
            logo={biller?.logo}
            name={biller?.name ?? fav.providerName}
            fallbackColor={biller?.fallbackColor}
            size={44}
            rounded="rounded-xl"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors truncate">
              {fav.providerName}
            </p>
            <p className="text-xs text-text truncate mt-0.5">
              {fav.label} • {fav.account}
            </p>
          </div>
        </button>
        <button
          onClick={() => removeFavourite(fav.id)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-placeholder hover:text-card-text hover:bg-border/50 transition-colors"
          aria-label={`Remove ${fav.providerName} ${fav.label} from favourites`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
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
        onClick={() => setCheckout({ target: { kind: "network", network } })}
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

  const providerTile = (
    category: "electricity" | "cable" | "betting",
    provider: BillProvider,
  ) => {
    const meta = categoryBiller(category, provider.code, provider.name);
    const fallbackDesc = {
      electricity: "Prepaid & postpaid",
      cable: "TV subscriptions",
      betting: "Fund your betting wallet",
    }[category];
    return (
      <button
        key={provider.code}
        onClick={() =>
          setCheckout({
            target:
              category === "electricity"
                ? { kind: "disco", disco: provider }
                : {
                    kind: category === "cable" ? "cable" : "betting",
                    provider,
                  },
          })
        }
        className="group flex items-center gap-3 p-4 rounded-2xl border border-border bg-card-background hover:border-border-active transition-colors text-left"
      >
        <BillerLogo
          logo={meta?.logo}
          name={provider.name}
          fallbackColor={meta?.fallbackColor}
          size={44}
          rounded="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-text group-hover:text-Green transition-colors truncate">
            {provider.name}
          </p>
          <p className="text-xs text-text truncate mt-0.5">
            {meta?.desc ?? fallbackDesc}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-placeholder group-hover:text-Green transition-colors shrink-0" />
      </button>
    );
  };

  // Cable providers are fixed by the API reference, so that category has no
  // query to wait on.
  const catalogue =
    selectedCategory === "electricity"
      ? discos
      : selectedCategory === "betting"
        ? bettingProviders
        : selectedCategory === "cable"
          ? null
          : networks;

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
          className="w-full h-12 pl-11 pr-11 text-base md:text-sm border border-input rounded-xl bg-card-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active focus:ring-[3px] focus:ring-border-active/20 transition-[border-color,box-shadow]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-placeholder hover:text-card-text transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {query ? (
        /* Search results across every category */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setSearch("")}
              className="p-2 rounded-lg border border-border text-text hover:text-card-text hover:border-border-active transition-colors"
              aria-label="Back to categories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-semibold text-card-text text-sm">
                Search Results
              </h3>
              <p className="text-xs text-text">
                {resultCount} biller{resultCount === 1 ? "" : "s"} matching “
                {search.trim()}”
              </p>
            </div>
          </div>
          {resultCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchResults.map(billerTile)}
              {liveSearchResults.map(({ category, provider }) =>
                providerTile(category, provider),
              )}
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
                {CATEGORY_PROMPTS[selectedCategory] ??
                  "Choose a network to continue"}
              </p>
            </div>
          </div>
          {catalogue?.isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-19.5 rounded-2xl border border-border bg-card-background animate-pulse"
                />
              ))}
            </div>
          ) : catalogue && catalogue.error ? (
            <div className="max-w-md space-y-3">
              <ErrorLayout message={catalogue.error.message} />
              <Button variant="outline" onClick={() => catalogue.refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCategory === "electricity"
                ? discos.data?.map((d) => providerTile("electricity", d))
                : selectedCategory === "betting"
                  ? bettingProviders.data?.map((p) =>
                      providerTile("betting", p),
                    )
                  : selectedCategory === "cable"
                    ? CABLE_PROVIDERS.map((p) => providerTile("cable", p))
                    : networks.data?.map(networkTile)}
            </div>
          )}
        </div>
      ) : (
        /* Browse by category, with saved payments above it */
        <div className="space-y-5">
          {favourites.length > 0 && (
            <div>
              <h3 className="font-semibold text-card-text text-sm mb-1">
                Favourites
              </h3>
              <p className="text-xs text-text mb-4">
                Payments you saved — tap one to pay it again
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favourites.map(favouriteTile)}
              </div>
            </div>
          )}

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
        </div>
      )}

      {/* Bottom grid — hidden while searching, so the results own the page */}
      {!query && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Transactions */}
          <div className="bg-card-background border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-card-text text-sm">
                Recent Transaction
              </h3>
              <Link
                href="/wallet?tab=fiat&type=BILL_PAYMENT"
                className="text-xs text-Green flex items-center gap-1 hover:underline"
              >
                See all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            {history.isPending && recentRows.length === 0 ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-13 rounded-lg bg-border/40 animate-pulse"
                  />
                ))}
              </div>
            ) : recentRows.length === 0 ? (
              <p className="py-8 text-center text-sm text-text">
                {history.isError
                  ? "We couldn't load your recent transactions."
                  : "No bill payments yet — your purchases will show up here."}
              </p>
            ) : (
              <div className="space-y-3">
                {recentRows.map((tx, i) => {
                  // Disco codes ("IKEJA_ELECTRIC") aren't always biller ids,
                  // and rows built before a biller was known carry no id at
                  // all — fall back to the description ("ikeja prepaid…").
                  const biller =
                    findBiller(tx.billerId) ??
                    discoBiller(tx.billerId) ??
                    billerFromText(tx.name);
                  return (
                    <div
                      key={tx.reference ?? i}
                      onClick={() => openReceipt(tx)}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-0 transition-colors rounded-lg px-1 hover:bg-border/20 cursor-pointer"
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
            )}
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
      )}

      {checkout && (
        <BillCheckoutModal
          target={checkout.target}
          prefill={checkout.prefill}
          onClose={() => setCheckout(null)}
          onPayment={handlePayment}
        />
      )}

      {receipt && (
        <TransactionReceiptModal
          {...receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}
