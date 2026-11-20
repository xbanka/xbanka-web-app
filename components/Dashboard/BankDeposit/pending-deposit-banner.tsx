"use client";

import { ChevronRight, Clock } from "lucide-react";
import { useBalanceVisibility } from "@/hooks/use-balance-visibility";
import { useBankDeposits } from "@/hooks/use-bank-deposits";
import { useNow } from "@/hooks/use-now";
import {
  BankDeposit,
  CREDIT_SLA_MINUTES,
  formatClock,
  formatDepositTime,
  formatNaira,
  PendingVariant,
  pendingVariant,
} from "@/lib/bank-deposit";
import { useDepositFlowStore } from "@/store/deposit-flow-store";

const TAIL: Record<PendingVariant, string> = {
  waiting: `usually credited within ${CREDIT_SLA_MINUTES} minutes`,
  taking_longer: "taking longer than usual",
  after_hours: "it'll be credited from 8am",
  delayed: "pending for over 24 hours",
};

/** "Submitted 10:42am · usually credited within 15 minutes". */
export const bannerSubtitle = (deposit: BankDeposit, now: Date) => {
  const when = formatDepositTime(deposit.createdAt, now);
  const submitted = when.startsWith("Today, ") ? formatClock(deposit.createdAt) : when;
  return `Submitted ${submitted} · ${TAIL[pendingVariant(deposit, now)]}`;
};

/**
 * "Your ₦2,000 deposit is waiting to be credited". Sits under the top bar on
 * every dashboard page while a bank deposit is pending, and disappears the
 * moment it settles. No dismiss button: it is a live status, not a promo.
 */
export function PendingDepositBanner() {
  const { pending } = useBankDeposits();
  const openStatus = useDepositFlowStore((s) => s.openStatus);
  const go = useDepositFlowStore((s) => s.go);
  const { hidden } = useBalanceVisibility();
  const now = useNow();

  const latest = pending[0];
  if (!latest) return null;

  const amount = hidden ? "₦••••" : formatNaira(latest.amount);
  const title =
    pending.length > 1
      ? `You have ${pending.length} deposits waiting to be credited`
      : `Your ${amount} deposit is waiting to be credited`;

  return (
    <div className="shrink-0 px-4 pt-4 sm:px-8 sm:pt-5" data-testid="pending-deposit-banner">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-4 rounded-xl border border-Green/40 bg-card-background px-5 py-4 max-sm:gap-3 max-sm:px-4 max-sm:py-3"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-Green/10 text-Green max-sm:h-9 max-sm:w-9">
          <Clock className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-card-text sm:text-base">{title}</p>
          <p className="truncate text-xs text-text sm:text-sm">{bannerSubtitle(latest, now)}</p>
        </div>
        <button
          type="button"
          onClick={() => (pending.length > 1 ? go({ name: "in_progress" }) : openStatus(latest.id))}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-Green hover:underline"
        >
          <span className="max-sm:hidden">View status</span>
          <span className="sm:hidden">View</span>
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
