"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactionHistory } from "@/lib/actions/wallet";
import { authTokens } from "@/lib/authToken";
import {
  BankDeposit,
  bankDepositsFrom,
  PENDING_POLL_MS,
  pendingDeposits,
} from "@/lib/bank-deposit";

/**
 * The query key starts with "transaction-history" on purpose: every place that
 * already refreshes the history (the live wallet stream on a balance event,
 * declare-intent, deposit notifications) refreshes deposits with it, so a
 * credit shows up within seconds of the admin approving it.
 */
export const BANK_DEPOSITS_QUERY_KEY = ["transaction-history", "bank-deposits"] as const;

/** Enough recent fiat rows that a pending deposit is not pushed off the page. */
export const BANK_DEPOSITS_PAGE_SIZE = 20;

export const fetchBankDeposits = async (): Promise<BankDeposit[]> => {
  const response = await getTransactionHistory({
    page: 1,
    limit: BANK_DEPOSITS_PAGE_SIZE,
    category: "FIAT",
  });
  return bankDepositsFrom(response?.data?.data?.items);
};

/** Poll only while something is pending: the stream covers credits, but a
 *  rejection moves no money and is only seen by re-reading. */
export const depositsRefetchInterval = (deposits: BankDeposit[] | undefined) =>
  deposits && pendingDeposits(deposits).length > 0 ? PENDING_POLL_MS : false;

export const useBankDeposits = () => {
  const query = useQuery({
    queryKey: BANK_DEPOSITS_QUERY_KEY,
    // No handleApiError: a background poll must not toast every 30s when the
    // network blips. On error the banner simply stays hidden.
    queryFn: fetchBankDeposits,
    enabled: typeof window !== "undefined" && !!authTokens.getAccessToken(),
    refetchInterval: (q) => depositsRefetchInterval(q.state.data),
    refetchOnWindowFocus: true,
    retry: 1,
  });
  const deposits = query.data ?? [];
  return { ...query, deposits, pending: pendingDeposits(deposits) };
};
