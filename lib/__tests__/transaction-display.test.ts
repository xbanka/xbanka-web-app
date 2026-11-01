import { describe, expect, it } from "vitest";
import {
  signedAmount,
  summarise,
  transactionGroup,
  transactionTitle,
} from "@/lib/transactionDisplay";
import type { TransactionTypes } from "@/lib/types/transaction-types";

const tx = (overrides: Partial<TransactionTypes>): TransactionTypes => ({
  id: "t1",
  type: "DEPOSIT",
  status: "COMPLETED",
  amount: 1000,
  currency: "NGN",
  reference: "REF",
  note: "",
  metadata: null,
  createdAt: "2026-10-30T10:00:00.000Z",
  category: "FIAT",
  ...overrides,
});

describe("transaction display", () => {
  it("signs money in and out", () => {
    expect(signedAmount(tx({ type: "DEPOSIT", amount: 5000 }))).toBe("+₦5,000");
    expect(signedAmount(tx({ type: "BILL_PAYMENT", amount: 100 }))).toBe("−₦100");
    expect(signedAmount(tx({ type: "TRANSFER_OUT", amount: -40 }))).toBe("−₦40");
  });

  it("puts bills in their own group even though they are fiat", () => {
    expect(transactionGroup(tx({ type: "BILL_PAYMENT", category: "FIAT" }))).toBe("bills");
    expect(transactionGroup(tx({ category: "CRYPTO" }))).toBe("crypto");
    expect(transactionGroup(tx({ category: "GIFTCARD" }))).toBe("giftcards");
    expect(transactionGroup(tx({}))).toBe("fiat");
  });

  it("leads with the note when there is one", () => {
    expect(transactionTitle(tx({ type: "BILL_PAYMENT", note: "MTN airtime for 0810" }))).toEqual({
      title: "MTN airtime for 0810",
      subtitle: "Bill payment",
    });
    expect(transactionTitle(tx({ type: "DEPOSIT", note: "  " }))).toEqual({
      title: "Deposit",
      subtitle: "Fiat",
    });
  });

  it("sums naira in, out and pending for the period, skipping failed and crypto", () => {
    const since = new Date("2026-10-01T00:00:00.000Z");
    const s = summarise(
      [
        tx({ type: "DEPOSIT", amount: 5000 }),
        tx({ type: "BILL_PAYMENT", amount: 100 }),
        tx({ type: "WITHDRAWAL", amount: 300, status: "PENDING" }),
        tx({ type: "WITHDRAWAL", amount: 900, status: "FAILED" }),
        tx({ type: "DEPOSIT", amount: 12, currency: "USDT", category: "CRYPTO" }),
        tx({ type: "DEPOSIT", amount: 7000, createdAt: "2026-09-01T00:00:00.000Z" }),
      ],
      since,
    );
    expect(s).toEqual({ moneyIn: 5000, moneyOut: 100, pending: 300, countIn: 1, countOut: 1, countPending: 1 });
  });
});
