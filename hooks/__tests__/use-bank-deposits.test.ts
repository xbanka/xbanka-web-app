import { describe, expect, it, vi } from "vitest";

const getTransactionHistory = vi.fn();
vi.mock("@/lib/actions/wallet", () => ({ getTransactionHistory: (...a: unknown[]) => getTransactionHistory(...a) }));
vi.mock("@/lib/authToken", () => ({ authTokens: { getAccessToken: () => "t" } }));

import {
  BANK_DEPOSITS_PAGE_SIZE,
  BANK_DEPOSITS_QUERY_KEY,
  depositsRefetchInterval,
  fetchBankDeposits,
} from "../use-bank-deposits";
import { PENDING_POLL_MS } from "@/lib/bank-deposit";

const intent = (id: string, status: string) => ({
  id,
  type: "DEPOSIT",
  status,
  amount: 1000,
  reference: `REF-${id}`,
  createdAt: "2026-11-19T07:41:39.241Z",
  updatedAt: "2026-11-19T07:41:39.241Z",
  metadata: JSON.stringify({ source: "BANK_TRANSFER_INTENT" }),
});

describe("bank deposits query", () => {
  // The live wallet stream, declare-intent and deposit notifications all
  // invalidate ["transaction-history"]. Sharing the prefix is what makes a
  // credit reach the banner within seconds instead of on the next poll.
  it("lives under the transaction-history key so every refresh reaches it", () => {
    expect(BANK_DEPOSITS_QUERY_KEY[0]).toBe("transaction-history");
  });

  it("reads the first page of fiat transactions and keeps only intents", async () => {
    getTransactionHistory.mockResolvedValue({
      data: {
        message: "Request successful",
        data: {
          items: [intent("a", "PENDING"), { ...intent("b", "COMPLETED"), type: "TRANSFER_IN" }],
          meta: { totalItems: 2 },
        },
      },
    });
    const deposits = await fetchBankDeposits();
    expect(getTransactionHistory).toHaveBeenCalledWith({
      page: 1,
      limit: BANK_DEPOSITS_PAGE_SIZE,
      category: "FIAT",
    });
    expect(deposits.map((d) => d.id)).toEqual(["a"]);
  });

  it("returns nothing for an empty or odd response", async () => {
    getTransactionHistory.mockResolvedValue(undefined);
    expect(await fetchBankDeposits()).toEqual([]);
  });

  it("polls only while a deposit is pending", () => {
    const pending = { id: "a", status: "PENDING" } as never;
    const done = { id: "b", status: "COMPLETED" } as never;
    expect(depositsRefetchInterval([pending, done])).toBe(PENDING_POLL_MS);
    expect(depositsRefetchInterval([done])).toBe(false);
    expect(depositsRefetchInterval(undefined)).toBe(false);
  });
});
