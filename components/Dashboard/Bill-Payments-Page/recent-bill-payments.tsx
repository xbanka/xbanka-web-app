"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, ReceiptText } from "lucide-react";
import { CATEGORIES } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { formatDateTime } from "@/lib/formatDate";
import type { TransactionTypes } from "@/lib/types/transaction-types";
import { cn } from "@/lib/utils";
import { BillerLogo } from "./biller-logo";
import {
  Biller,
  billerFromText,
  BillTransaction,
  discoBiller,
  findBiller,
} from "./billers-data";

/** How many payments the card lists; "See all" opens the full history. */
const MAX_ROWS = 8;

// Bill · Recipient · Date · Amount · Status · chevron, from `md` up. Below
// that each row is a compact two-column line (bill on the left, amount and
// status on the right).
const GRID =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.3fr)_minmax(0,1.5fr)_minmax(0,1fr)_7rem_1rem] md:gap-4";

export type RecentBillRow = BillTransaction & { historyTx?: TransactionTypes };

const categoryName = (id?: string) =>
  CATEGORIES.find((c) => c.id === id)?.name;

/**
 * The page's Recent Transactions card, full width now that Quick Actions is
 * gone: a table on desktop, compact rows on phones, and category chips when
 * the list holds more than one kind of bill.
 */
export function RecentBillPayments({
  rows,
  isPending,
  isError,
  onOpen,
}: {
  rows: RecentBillRow[];
  isPending: boolean;
  isError: boolean;
  onOpen: (row: RecentBillRow) => void;
}) {
  const [filter, setFilter] = useState<string>("all");

  const resolved = useMemo(
    () =>
      rows.map((row) => {
        // Disco codes ("IKEJA_ELECTRIC") aren't always biller ids, and rows
        // built before a biller was known carry no id at all — fall back to
        // the description ("ikeja prepaid…").
        const biller: Biller | undefined =
          findBiller(row.billerId) ??
          discoBiller(row.billerId) ??
          billerFromText(row.name);
        return { row, biller, category: biller?.category as string | undefined };
      }),
    [rows],
  );

  // Only categories that actually appear, in the page's category order.
  const chips = CATEGORIES.filter((c) =>
    resolved.some((r) => r.category === c.id),
  );
  const active = chips.some((c) => c.id === filter) ? filter : "all";
  const visible = resolved
    .filter((r) => active === "all" || r.category === active)
    .slice(0, MAX_ROWS);

  return (
    <section
      data-tour="bills-recent"
      className="bg-card-background border border-border rounded-2xl p-5 max-sm:p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-card-text text-base">
            Recent Transaction
          </h3>
          <p className="mt-0.5 text-[13px] text-text">
            Tap a payment to see its receipt.
          </p>
        </div>
        <Link
          href="/wallet?tab=fiat&type=BILL_PAYMENT"
          className="shrink-0 text-xs text-Green flex items-center gap-1 hover:underline"
        >
          See all <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {chips.length > 1 && (
        // One scrolling row on phones rather than wrapping onto a second line.
        <div
          className="mt-4 flex flex-wrap gap-2 max-sm:-mx-4 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-4 max-sm:[scrollbar-width:none]"
          role="group"
          aria-label="Filter by category"
        >
          {[{ id: "all", name: "All" }, ...chips].map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={active === c.id}
              onClick={() => setFilter(c.id)}
              className={cn(
                "h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition-colors",
                active === c.id
                  ? "border-Green bg-teal-light text-teal-text"
                  : "border-input bg-input-background text-card-text hover:bg-border",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {isPending && rows.length === 0 ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-border/40 animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-teal-border bg-teal-light text-teal-text">
              <ReceiptText className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-text">
                {isError
                  ? "We couldn't load your recent transactions."
                  : "No bill payments yet"}
              </p>
              {!isError && (
                <p className="text-[13px] text-text">
                  Airtime, data, electricity and TV payments will show up here.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border">
            <div
              className={cn(
                GRID,
                "hidden md:grid border-b border-border px-4 py-2.5 text-[12px] font-medium text-text",
              )}
            >
              <span>Bill</span>
              <span>Recipient</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span>Status</span>
              <span />
            </div>
            <ul className="divide-y divide-border stagger">
              {visible.map(({ row, biller, category }, i) => {
                const date = row.historyTx?.createdAt;
                return (
                  <li key={row.reference ?? i}>
                    <button
                      type="button"
                      onClick={() => onOpen(row)}
                      className={cn(
                        GRID,
                        "group w-full px-4 py-3 text-left transition-colors hover:bg-border/40 max-sm:px-3",
                      )}
                    >
                      {/* Bill */}
                      <span className="flex min-w-0 items-center gap-3">
                        <BillerLogo
                          logo={biller?.logo}
                          name={biller?.name ?? row.name}
                          fallbackColor={biller?.fallbackColor}
                          size={36}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-card-text">
                            {row.name}
                          </span>
                          <span className="block truncate text-xs text-text md:hidden">
                            {row.number} • {row.time}
                          </span>
                          <span className="hidden truncate text-xs text-text md:block">
                            {[biller?.name, categoryName(category)]
                              .filter(Boolean)
                              .join(" · ") || "Bill payment"}
                          </span>
                        </span>
                      </span>

                      {/* Recipient */}
                      <span className="hidden truncate text-sm text-card-text md:block">
                        {row.number}
                      </span>

                      {/* Date */}
                      <span className="hidden min-w-0 md:block">
                        <span className="block truncate text-sm text-card-text">
                          {date ? formatDateTime(date) : row.time}
                        </span>
                        {date && (
                          <span className="block truncate text-xs text-text">
                            {row.time}
                          </span>
                        )}
                      </span>

                      {/* Amount (and status, on phones) */}
                      <span className="flex flex-col items-end gap-1 text-right">
                        <span className="text-sm font-semibold text-card-text">
                          {row.amount}
                        </span>
                        <span className="md:hidden">
                          <StatusBadge status={row.status} />
                        </span>
                      </span>

                      {/* Status */}
                      <span className="hidden md:block">
                        <StatusBadge status={row.status} />
                      </span>

                      <ChevronRight className="hidden h-4 w-4 text-text transition-transform group-hover:translate-x-0.5 md:block" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
