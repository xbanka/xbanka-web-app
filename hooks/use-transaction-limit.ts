"use client";

import { UseVerificationStatus } from "@/lib/services/profile.service";
import {
  UseGetFiatWallet,
  UseGetTransactionHistory,
} from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import {
  checkBalanceCap,
  checkDailyLimit,
  spentToday,
} from "@/lib/transaction-limit";

/**
 * Today's spend is read from the latest fiat transactions. 100 rows covers
 * any realistic day; past that the backend limit still applies.
 */
const TODAY_WINDOW = 100;

/** Reusable tier-limit guard for any money-out or money-in screen. */
export const useTransactionLimit = () => {
  const { data: verification } = UseVerificationStatus();
  const { data: history, isPending: historyPending } = UseGetTransactionHistory(
    1,
    TODAY_WINDOW,
    "FIAT",
  );
  const { data: wallet } = UseGetFiatWallet();

  const tier = verification?.data?.tierLevel ?? 0;
  const spent = spentToday(history?.data?.data?.items ?? []);
  const balance = sumFiatBalances(wallet?.data?.data || []);

  return {
    tier,
    spent,
    balance,
    /** Until history loads we cannot say what is left; don't block on it. */
    ready: !historyPending,
    checkDaily: (amount: number) => checkDailyLimit({ tier, amount, spent }),
    checkDeposit: (amount: number) => checkBalanceCap({ tier, amount, balance }),
  };
};
