"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
} from "lucide-react";
import {
  BillPaymentsIcon,
  CryptoIcon,
  GiftCardsIcon,
  WalletIcon,
  type NavIconProps,
} from "@/components/icons/nav-icons";
import type { ComponentType, ReactNode } from "react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Input } from "@/components/ui/input";
import { SelectFieldWithValue } from "@/components/ui/select-with-value";
import { TransactionReceiptModal } from "@/components/ui/transaction-receipt-modal";
import { ErrorField } from "@/components/ui/field-error";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/formatDate";
import { formatTo12Hour } from "@/lib/formatTime";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { TransactionHistoryStatusBadge } from "@/lib/statusBadge";
import { buildTransactionReceipt } from "@/lib/transactionReceipt";
import {
  GROUP_LABEL,
  isInflow,
  signedAmount,
  summarise,
  transactionGroup,
  transactionTitle,
  type TransactionGroup,
} from "@/lib/transactionDisplay";
import type { TransactionTypes } from "@/lib/types/transaction-types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
// The summary reads the most recent transactions in one request; a month of
// activity fits comfortably. It is labelled as the last 30 days.
const SUMMARY_SAMPLE = 100;
const SUMMARY_DAYS = 30;

type Tab = "all" | TransactionGroup;
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fiat", label: "Fiat" },
  { id: "crypto", label: "Crypto" },
  { id: "bills", label: "Bills" },
  { id: "giftcards", label: "Gift cards" },
];

/** The API filters by category; bills are fiat with a type of BILL_PAYMENT. */
const TAB_CATEGORY: Record<Tab, "FIAT" | "CRYPTO" | "GIFTCARD" | undefined> = {
  all: undefined,
  fiat: "FIAT",
  bills: "FIAT",
  crypto: "CRYPTO",
  giftcards: "GIFTCARD",
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "Any status" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PENDING", label: "Pending" },
  { value: "FAILED", label: "Failed" },
];

// Chip and icon tile colours per group, from the Quick Actions palette.
const GROUP_STYLE: Record<TransactionGroup, string> = {
  fiat: "bg-border text-text",
  crypto: "bg-teal-light text-teal-text",
  bills: "bg-blue-light text-blue-text",
  giftcards: "bg-coral-light text-coral-text",
};

// The Figma sidebar icons, one per group; direction reads from the amount.
const GROUP_ICON: Record<TransactionGroup, ComponentType<NavIconProps>> = {
  fiat: WalletIcon,
  crypto: CryptoIcon,
  bills: BillPaymentsIcon,
  giftcards: GiftCardsIcon,
};
const iconFor = (tx: TransactionTypes) => GROUP_ICON[transactionGroup(tx)];

/**
 * Cuts text to its cell with an ellipsis and shows all of it on hover. The
 * full text stays in the DOM, so screen readers and copy get the whole value.
 */
function Truncated({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span className="group/full relative block min-w-0">
      <span className={cn("block truncate", className)}>{children ?? text}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-full z-30 mt-1.5 w-max max-w-[min(22rem,70vw)] whitespace-normal break-all rounded-md border border-border bg-card-background px-2.5 py-1.5 text-xs leading-5 text-card-text opacity-0 shadow-xl transition-opacity duration-100 group-hover/full:visible group-hover/full:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

/** Teal for inflows only, so income is easy to find; failed reads as void. */
const amountClass = (tx: TransactionTypes) =>
  tx.status?.toUpperCase() === "FAILED"
    ? "text-text line-through"
    : isInflow(tx)
      ? "text-teal-text"
      : "text-card-text";

export default function TransactionsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [receiptFor, setReceiptFor] = useState<TransactionTypes | null>(null);
  const debouncedSearch = useDebounce(search.trim(), 400);

  const { data, isPending, isError, error } = UseGetTransactionHistory(
    page,
    PAGE_SIZE,
    TAB_CATEGORY[tab],
    debouncedSearch || undefined,
  );
  const { data: recent, isPending: recentPending } = UseGetTransactionHistory(
    1,
    SUMMARY_SAMPLE,
  );

  const items: TransactionTypes[] = useMemo(
    () => data?.data?.data?.items ?? [],
    [data],
  );
  const totalPages: number = data?.data?.data?.meta?.totalPages ?? 1;

  // Bills and status narrow the page the API returned.
  const rows = useMemo(
    () =>
      items.filter(
        (tx) =>
          (tab !== "bills" || tx.type === "BILL_PAYMENT") &&
          (tab !== "fiat" || tx.type !== "BILL_PAYMENT") &&
          (status === "ALL" || tx.status?.toUpperCase() === status),
      ),
    [items, tab, status],
  );

  const summary = useMemo(() => {
    const since = new Date(Date.now() - SUMMARY_DAYS * 24 * 60 * 60 * 1000);
    return summarise(recent?.data?.data?.items ?? [], since);
  }, [recent]);

  const changeTab = (next: Tab) => {
    setTab(next);
    setPage(1);
  };

  const tiles = [
    {
      label: "Money in",
      value: summary.moneyIn,
      note: `${summary.countIn} transactions`,
      icon: ArrowDownLeft,
      tone: "bg-teal-light text-teal-text",
    },
    {
      label: "Money out",
      value: summary.moneyOut,
      note: `${summary.countOut} transactions`,
      icon: ArrowUpRight,
      tone: "bg-border text-card-text",
    },
    {
      label: "Pending",
      value: summary.pending,
      note:
        summary.countPending === 1
          ? "1 awaiting confirmation"
          : `${summary.countPending} awaiting confirmation`,
      icon: Clock,
      tone: "bg-yellow-warning-light text-yellow-warning-text",
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Title */}
      <div className="space-y-1" data-tour="transactions-title">
        <h1 className="font-display text-xl sm:text-2xl font-semibold leading-8 text-card-text">
          Transactions
        </h1>
        <p className="text-sm text-text">
          Every movement of money across your naira wallet, crypto, bills and
          gift cards.
        </p>
      </div>

      {/* Summary */}
      <section
        aria-label={`Last ${SUMMARY_DAYS} days`}
        data-tour="transactions-summary"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {tiles.map(({ label, value, note, icon: Icon, tone }, i) => (
          <DashboardCard
            key={label}
            className={cn(
              "space-y-2 p-4 sm:p-5",
              i === 2 && "col-span-2 lg:col-span-1",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text">
                {label}
                <span className="sr-only">, last {SUMMARY_DAYS} days</span>
              </span>
              <span
                className={cn("grid place-items-center w-8 h-8 rounded-lg", tone)}
                aria-hidden="true"
              >
                <Icon className="w-4 h-4" />
              </span>
            </div>
            {recentPending ? (
              <div className="h-8 w-32 rounded-md bg-card-text/10 animate-pulse" />
            ) : (
              <p className="font-display text-xl sm:text-[26px] font-bold leading-8 tracking-[-0.04em] tabular-nums text-card-text">
                ₦{value.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-text">{note}</p>
          </DashboardCard>
        ))}
      </section>
      <p className="-mt-2 text-xs text-text">
        Totals cover naira transactions in the last {SUMMARY_DAYS} days.
      </p>

      {/* History */}
      <DashboardCard className="p-0 max-sm:p-0 space-y-0">
        {/* Filters */}
        <div
          data-tour="transactions-filters"
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 sm:px-5 border-b border-border"
        >
          <div
            role="tablist"
            aria-label="Category"
            className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-0.5 sm:p-1 sm:border sm:border-border sm:rounded-lg sm:w-fit"
          >
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => changeTab(id)}
                className={cn(
                  "shrink-0 h-9 sm:h-8 px-3.5 sm:px-3 text-[13px] sm:text-sm font-medium transition-colors rounded-md border sm:border-0",
                  tab === id
                    ? "border-Green bg-teal-light text-teal-text sm:bg-border sm:text-card-text"
                    : "border-input bg-card-background text-text hover:text-card-text sm:bg-transparent",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0 lg:flex-none">
              <label htmlFor="transactions-search" className="sr-only">
                Search transactions
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
              <Input
                id="transactions-search"
                type="search"
                placeholder="Search by reference or amount"
                className="pl-9 pr-3 w-full lg:w-72 truncate"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="shrink-0 w-36">
              <SelectFieldWithValue
                placeholder="Status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
              />
            </div>
          </div>
        </div>

        {isError && (
          <div className="p-6">
            <ErrorField message={error?.message} />
          </div>
        )}

        {/* Desktop table */}
        {!isError && (
          // Fixed column widths so the table always fits its card; columns
          // that matter least drop out as the screen narrows (the whole row
          // still opens the receipt).
          <div className="hidden md:block" data-tour="transactions-list">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-[13px] text-text">
                  <th className="w-[6.5rem] lg:w-[7.5rem] px-5 py-3 font-medium border-b border-border">Date &amp; Time</th>
                  <th className="px-4 py-3 font-medium border-b border-border">Transaction</th>
                  <th className="hidden xl:table-cell w-[6.5rem] px-4 py-3 font-medium border-b border-border">Category</th>
                  <th className="w-[6rem] lg:w-[11rem] px-4 py-3 font-medium border-b border-border">Reference</th>
                  <th className="w-[6.5rem] lg:w-[7rem] px-4 py-3 font-medium border-b border-border">Status</th>
                  <th className="w-[7rem] lg:w-[8rem] px-4 py-3 font-medium border-b border-border text-right">Amount</th>
                  <th className="hidden xl:table-cell w-[8.5rem] px-5 py-3 border-b border-border">
                    <span className="sr-only">Receipt</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isPending &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`s${i}`}>
                      <td colSpan={7} className="px-5 py-3 border-b border-border">
                        <div className="h-9 rounded-md bg-card-text/5 animate-pulse" />
                      </td>
                    </tr>
                  ))}
                {!isPending && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center text-text">
                      {search || status !== "ALL" || tab !== "all"
                        ? "No transactions match these filters."
                        : "No transactions yet."}
                    </td>
                  </tr>
                )}
                {!isPending &&
                  rows.map((tx) => {
                    const Icon = iconFor(tx);
                    const group = transactionGroup(tx);
                    const { title, subtitle } = transactionTitle(tx);
                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setReceiptFor(tx)}
                        className="cursor-pointer text-card-text hover:bg-border/50 transition-colors"
                      >
                        <td className="px-5 py-3 border-b border-border whitespace-nowrap">
                          <div>{formatDate(tx.createdAt)}</div>
                          <div className="text-xs text-text">{formatTo12Hour(tx.createdAt)}</div>
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={cn("hidden lg:grid place-items-center w-9 h-9 shrink-0 rounded-lg", GROUP_STYLE[group])}
                              aria-hidden="true"
                            >
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <Truncated text={title} className="font-medium" />
                              <div className="text-xs text-text truncate">{subtitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden xl:table-cell px-4 py-3 border-b border-border">
                          <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap", GROUP_STYLE[group])}>
                            {GROUP_LABEL[group]}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <Truncated
                            text={tx.reference || tx.id}
                            className="font-mono text-[13px] text-text"
                          />
                        </td>
                        <td className="px-4 py-3 border-b border-border">
                          <TransactionHistoryStatusBadge status={tx.status} />
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 border-b border-border text-right font-display font-semibold tabular-nums truncate",
                            amountClass(tx),
                          )}
                        >
                          {signedAmount(tx)}
                        </td>
                        <td className="hidden xl:table-cell px-5 py-3 border-b border-border text-right">
                          <button
                            type="button"
                            onClick={(event) => {
                              // The row opens the receipt too.
                              event.stopPropagation();
                              setReceiptFor(tx);
                            }}
                            className="inline-flex items-center rounded-full border border-Green/40 bg-Green/10 px-3 py-1.5 text-xs font-medium text-Green transition-colors hover:border-Green hover:bg-Green/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Green/40 whitespace-nowrap"
                          >
                            View receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phone list */}
        {!isError && (
          <ul className="md:hidden divide-y divide-border" data-tour="transactions-list-mobile">
            {isPending &&
              Array.from({ length: 5 }).map((_, i) => (
                <li key={`s${i}`} className="px-4 py-3">
                  <div className="h-10 rounded-md bg-card-text/5 animate-pulse" />
                </li>
              ))}
            {!isPending && rows.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-text">
                {search || status !== "ALL" || tab !== "all"
                  ? "No transactions match these filters."
                  : "No transactions yet."}
              </li>
            )}
            {!isPending &&
              rows.map((tx) => {
                const Icon = iconFor(tx);
                const group = transactionGroup(tx);
                const { title, subtitle } = transactionTitle(tx);
                const failed = tx.status?.toUpperCase() === "FAILED";
                const pending = tx.status?.toUpperCase() === "PENDING";
                return (
                  <li key={tx.id}>
                    <button
                      type="button"
                      onClick={() => setReceiptFor(tx)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-border/60 transition-colors"
                    >
                      <span
                        className={cn("grid place-items-center w-10 h-10 shrink-0 rounded-[10px]", GROUP_STYLE[group])}
                        aria-hidden="true"
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-card-text truncate">{title}</span>
                        <span className="block text-xs text-text truncate">
                          {formatDate(tx.createdAt)} · {formatTo12Hour(tx.createdAt)} · {subtitle}
                        </span>
                      </span>
                      <span className="flex flex-col items-end shrink-0">
                        <span className={cn("text-sm font-display font-semibold tabular-nums", amountClass(tx))}>
                          {signedAmount(tx)}
                        </span>
                        <span
                          className={cn(
                            "text-[11px]",
                            failed
                              ? "text-error-text"
                              : pending
                                ? "text-yellow-warning-text"
                                : "text-green-success-text dark:text-[#A6F4C5]",
                          )}
                        >
                          {failed ? "Failed" : pending ? "Pending" : "Completed"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        )}

        {/* Pagination */}
        {!isError && totalPages > 1 && (
          <nav
            aria-label="Pages"
            className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border text-[13px] text-text"
          >
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="grid place-items-center w-10 h-10 rounded-lg border border-input text-card-text disabled:opacity-40 hover:bg-border transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="grid place-items-center w-10 h-10 rounded-lg border border-input text-card-text disabled:opacity-40 hover:bg-border transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </DashboardCard>

      {receiptFor && (
        <TransactionReceiptModal
          {...buildTransactionReceipt(receiptFor)}
          onClose={() => setReceiptFor(null)}
        />
      )}
    </div>
  );
}
