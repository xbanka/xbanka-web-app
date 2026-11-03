import { getNextTier, getTierLimit } from "./tier-limits";
import { isInflow } from "./transactionDisplay";
import type { TransactionTypes } from "./types/transaction-types";

/**
 * Client-side guard for the tier limits in the KYC & Transaction Access
 * Architecture v4.0, section 9 (Tier 0 ₦150k, Tier 1 ₦500k, Tier 2 ₦2M).
 *
 * Two checks share one tier table:
 * - checkDailyLimit: money out today (send, withdraw, bills) plus this amount.
 * - checkBalanceCap: wallet balance plus an incoming deposit.
 *
 * The backend is the source of truth. This guard stops the user before the
 * request and tells them why; it never lets through what the backend blocks.
 */

export type LimitBlock = "upgrade" | "support";

export type LimitCheck =
  | { allowed: true; limit: number; remaining: number }
  | {
      allowed: false;
      limit: number;
      remaining: number;
      /** Tier 0/1 upgrade to the next tier; Tier 2 goes to Support. */
      action: LimitBlock;
      nextTier: number | null;
      message: string;
    };

const naira = (n: number) => `₦${Math.max(0, n).toLocaleString("en-NG")}`;

/** Lagos is UTC+1 all year (no DST), so the daily window is fixed. */
const LAGOS_OFFSET_MS = 60 * 60 * 1000;

export const startOfLagosDay = (now: Date): Date => {
  const lagos = new Date(now.getTime() + LAGOS_OFFSET_MS);
  lagos.setUTCHours(0, 0, 0, 0);
  return new Date(lagos.getTime() - LAGOS_OFFSET_MS);
};

/**
 * Naira that left the wallet since Lagos midnight. Pending outflows count:
 * the money is already committed. Failed ones moved nothing.
 */
export const spentToday = (
  txs: Pick<TransactionTypes, "type" | "amount" | "currency" | "status" | "createdAt">[],
  now: Date = new Date(),
): number => {
  const since = startOfLagosDay(now).getTime();
  let total = 0;
  for (const tx of txs) {
    if (tx.currency !== "NGN") continue;
    if (isInflow(tx)) continue;
    if (tx.status?.toUpperCase() === "FAILED") continue;
    if (new Date(tx.createdAt).getTime() < since) continue;
    total += Math.abs(Number(tx.amount)) || 0;
  }
  return total;
};

const blocked = (
  tier: number,
  limit: number,
  remaining: number,
  reason: string,
): LimitCheck => {
  const nextTier = getNextTier(tier);
  return {
    allowed: false,
    limit,
    remaining: Math.max(0, remaining),
    action: nextTier === null ? "support" : "upgrade",
    nextTier,
    message:
      nextTier === null
        ? `${reason} Contact Support for a manual review.`
        : `${reason} Upgrade to Tier ${nextTier} to continue.`,
  };
};

export const checkDailyLimit = ({
  tier,
  amount,
  spent,
}: {
  tier: number;
  amount: number;
  spent: number;
}): LimitCheck => {
  const limit = getTierLimit(tier);
  const remaining = limit - spent;
  if (amount <= remaining) return { allowed: true, limit, remaining };
  const reason =
    remaining <= 0
      ? `You've reached your Tier ${tier} daily limit of ${naira(limit)}.`
      : `This is above your Tier ${tier} daily limit of ${naira(limit)}. You can send up to ${naira(remaining)} more today.`;
  return blocked(tier, limit, remaining, reason);
};

export const checkBalanceCap = ({
  tier,
  amount,
  balance,
}: {
  tier: number;
  amount: number;
  balance: number;
}): LimitCheck => {
  const limit = getTierLimit(tier);
  const remaining = limit - balance;
  if (amount <= remaining) return { allowed: true, limit, remaining };
  const reason =
    remaining <= 0
      ? `Your wallet is at the Tier ${tier} limit of ${naira(limit)}.`
      : `This deposit would take your wallet above the Tier ${tier} limit of ${naira(limit)}. You can add up to ${naira(remaining)}.`;
  return blocked(tier, limit, remaining, reason);
};
