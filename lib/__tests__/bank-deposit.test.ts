import { describe, expect, it } from "vitest";
import {
  accountLabel,
  bankDepositsFrom,
  BankDeposit,
  depositFromDeclareResponse,
  depositSource,
  entryStep,
  formatClock,
  formatDepositTime,
  formatNaira,
  formatWaiting,
  isApprovalOpen,
  isBeforeApprovalOpen,
  MAX_WATCHED,
  minutesSince,
  parseAmountInput,
  parseMetadata,
  pendingDeposits,
  pendingVariant,
  planResultPopup,
  resultVariant,
  settleWatch,
  sourceLabel,
  toBankDeposit,
  transferDetailsText,
  UNKNOWN_SOURCE_LABEL,
} from "../bank-deposit";

// Shaped exactly like GET /wallet/transactions on preprod (2026-11-19),
// with names and numbers replaced.
const intentMeta = (extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    source: "BANK_TRANSFER_INTENT",
    registeredFundingAccounts: [
      { id: "fa-gt", bankName: "GTBank", accountNumber: "0127661815", accountName: "ADA LOVELACE" },
    ],
    ...extra,
  });

const row = (over: Record<string, unknown> = {}) => ({
  id: "3b18c95d-4449-4536-8b28-f8c4e1d7f0dd",
  userId: "u-1",
  amount: 1000,
  category: "FIAT",
  createdAt: "2026-11-19T07:41:39.241Z",
  currency: "NGN",
  metadata: intentMeta(),
  note: "Manual bank transfer funding intent",
  reference: "MANUAL-1795074099241-DGA287H",
  status: "PENDING",
  tradeDirection: null,
  type: "DEPOSIT",
  updatedAt: "2026-11-19T07:41:39.241Z",
  ...over,
});

const deposit = (over: Partial<BankDeposit> = {}): BankDeposit => ({
  id: "d1",
  reference: "MANUAL-1",
  status: "PENDING",
  amount: 2000,
  declaredAmount: null,
  createdAt: "2026-11-19T09:42:00.000Z",
  updatedAt: "2026-11-19T09:42:00.000Z",
  fundingAccountId: null,
  ...over,
});

/** A Date at the given Lagos wall-clock time (Lagos = UTC+1). */
const lagos = (iso: string) => new Date(Date.parse(`${iso}Z`) - 60 * 60 * 1000);

describe("parseMetadata", () => {
  it("parses the JSON string the API sends", () => {
    expect(parseMetadata(intentMeta()).source).toBe("BANK_TRANSFER_INTENT");
  });
  it("accepts an object as is", () => {
    expect(parseMetadata({ source: "X" })).toEqual({ source: "X" });
  });
  it.each([null, undefined, "", "not json", "[1,2]", "42", 7, []])("gives {} for %p", (raw) => {
    expect(parseMetadata(raw)).toEqual({});
  });
});

describe("toBankDeposit", () => {
  it("reads a pending intent row", () => {
    expect(toBankDeposit(row())).toEqual({
      id: "3b18c95d-4449-4536-8b28-f8c4e1d7f0dd",
      reference: "MANUAL-1795074099241-DGA287H",
      status: "PENDING",
      amount: 1000,
      declaredAmount: null,
      createdAt: "2026-11-19T07:41:39.241Z",
      updatedAt: "2026-11-19T07:41:39.241Z",
      fundingAccountId: null,
    });
  });

  it("reads a rejected row", () => {
    const failed = row({
      status: "FAILED",
      metadata: intentMeta({ rejectedBy: "admin@x", rejectReason: "not received", rejectedAt: "2026-11-19T07:41:07.513Z" }),
    });
    expect(toBankDeposit(failed)?.status).toBe("FAILED");
  });

  it("picks up declaredAmount and fundingAccountId when the backend sends them", () => {
    const d = toBankDeposit(
      row({ status: "COMPLETED", amount: 1500, metadata: intentMeta({ declaredAmount: "2,000", fundingAccountId: "fa-gt" }) }),
    );
    expect(d).toMatchObject({ amount: 1500, declaredAmount: 2000, fundingAccountId: "fa-gt" });
  });

  it("ignores every other fiat row", () => {
    expect(toBankDeposit(row({ type: "TRANSFER_IN" }))).toBeNull();
    expect(toBankDeposit(row({ metadata: JSON.stringify({ source: "VIRTUAL_ACCOUNT" }) }))).toBeNull();
    expect(toBankDeposit(row({ metadata: null }))).toBeNull();
  });

  it("drops malformed rows instead of showing garbage", () => {
    expect(toBankDeposit(row({ status: "REVERSED" }))).toBeNull();
    expect(toBankDeposit(row({ amount: "abc" }))).toBeNull();
    expect(toBankDeposit(row({ createdAt: "yesterday" }))).toBeNull();
    expect(toBankDeposit(row({ id: 9 }))).toBeNull();
    expect(toBankDeposit(null)).toBeNull();
  });

  it("falls back to the id when there is no reference", () => {
    expect(toBankDeposit(row({ reference: null }))?.reference).toBe(row().id);
  });
});

describe("bankDepositsFrom / pendingDeposits", () => {
  it("keeps only intents, newest first", () => {
    const list = bankDepositsFrom([
      row({ id: "old", createdAt: "2026-11-19T07:07:47.431Z", status: "FAILED" }),
      row({ id: "other", type: "WITHDRAWAL" }),
      row({ id: "new" }),
    ]);
    expect(list.map((d) => d.id)).toEqual(["new", "old"]);
    expect(pendingDeposits(list).map((d) => d.id)).toEqual(["new"]);
  });
  it("handles a missing list", () => {
    expect(bankDepositsFrom(undefined)).toEqual([]);
  });
});

describe("depositFromDeclareResponse", () => {
  it("builds the deposit from the declare-intent payload", () => {
    const data = {
      success: true,
      transactionId: "t1",
      amount: 1000,
      createdAt: "2026-11-19T07:41:39.241Z",
      reference: "MANUAL-X",
      status: "PENDING",
    };
    expect(depositFromDeclareResponse(data, 999, "fa-gt")).toMatchObject({
      id: "t1",
      reference: "MANUAL-X",
      amount: 1000,
      status: "PENDING",
      fundingAccountId: "fa-gt",
    });
  });
  it("is null without a transaction id", () => {
    expect(depositFromDeclareResponse({ success: true }, 1000, null)).toBeNull();
    expect(depositFromDeclareResponse(undefined, 1000, null)).toBeNull();
  });
  it("uses the typed amount if the response has none", () => {
    expect(depositFromDeclareResponse({ transactionId: "t" }, 5000, null)?.amount).toBe(5000);
  });
});

describe("approval hours (Lagos, 8am to 10pm)", () => {
  it.each([
    ["2026-11-19T07:59:59", false],
    ["2026-11-19T08:00:00", true],
    ["2026-11-19T13:00:00", true],
    ["2026-11-19T21:59:59", true],
    ["2026-11-19T22:00:00", false],
    ["2026-11-19T23:59:00", false],
    ["2026-11-20T00:30:00", false],
  ])("%s Lagos → open %s", (at, open) => {
    expect(isApprovalOpen(lagos(at))).toBe(open);
  });

  it("uses Lagos, not UTC: 07:30 UTC is 08:30 in Lagos", () => {
    expect(isApprovalOpen(new Date("2026-11-19T07:30:00Z"))).toBe(true);
  });

  it("tells before-opening from after-closing", () => {
    expect(isBeforeApprovalOpen(lagos("2026-11-19T06:00:00"))).toBe(true);
    expect(isBeforeApprovalOpen(lagos("2026-11-19T23:00:00"))).toBe(false);
  });
});

describe("minutesSince / formatWaiting", () => {
  it("counts whole minutes and never goes negative", () => {
    const now = new Date("2026-11-19T10:00:00Z");
    expect(minutesSince("2026-11-19T09:42:30Z", now)).toBe(17);
    expect(minutesSince("2026-11-19T10:05:00Z", now)).toBe(0);
  });
  it.each([
    [0, "0 minutes"],
    [1, "1 minute"],
    [18, "18 minutes"],
    [60, "1 hour"],
    [65, "1 hour 5 minutes"],
    [125, "2 hours 5 minutes"],
    [24 * 60, "1 day"],
    [3 * 24 * 60 + 5, "3 days"],
  ])("%i → %s", (m, text) => {
    expect(formatWaiting(m)).toBe(text);
  });
});

describe("formatClock / formatDepositTime (Lagos)", () => {
  it("formats 12-hour clock with am/pm", () => {
    expect(formatClock("2026-11-19T09:42:00Z")).toBe("10:42am");
    expect(formatClock("2026-11-19T21:36:00Z")).toBe("10:36pm");
    expect(formatClock("2026-11-18T23:05:00Z")).toBe("12:05am");
    expect(formatClock("2026-11-19T11:00:00Z")).toBe("12:00pm");
  });

  it("says Today / Yesterday / date", () => {
    const now = lagos("2026-11-19T11:00:00");
    expect(formatDepositTime(lagos("2026-11-19T10:42:00").toISOString(), now)).toBe("Today, 10:42am");
    expect(formatDepositTime(lagos("2026-11-18T10:42:00").toISOString(), now)).toBe("Yesterday, 10:42am");
    expect(formatDepositTime(lagos("2026-11-16T10:42:00").toISOString(), now)).toBe("16 Nov, 10:42am");
  });

  it("uses the Lagos day, not the UTC day, around midnight", () => {
    // 23:30 UTC on the 18th is 00:30 on the 19th in Lagos: today, not yesterday.
    const now = lagos("2026-11-19T09:00:00");
    expect(formatDepositTime("2026-11-18T23:30:00Z", now)).toBe("Today, 12:30am");
  });
});

describe("pendingVariant", () => {
  const at = (submitted: string, now: string) =>
    pendingVariant({ createdAt: lagos(submitted).toISOString() }, lagos(now));

  it("waits within 15 minutes during approval hours (P1)", () => {
    expect(at("2026-11-19T10:42:00", "2026-11-19T10:57:00")).toBe("waiting");
  });
  it("is taking longer after 15 minutes (P1b)", () => {
    expect(at("2026-11-19T10:42:00", "2026-11-19T10:58:00")).toBe("taking_longer");
  });
  it("is after hours whenever approvals are closed (P1c)", () => {
    expect(at("2026-11-19T22:36:00", "2026-11-19T23:00:00")).toBe("after_hours");
    // Sent at 9:50pm, still pending at 10:30pm: nobody checks now either.
    expect(at("2026-11-19T21:50:00", "2026-11-19T22:30:00")).toBe("after_hours");
  });
  it("is back to taking longer when approvals reopen", () => {
    expect(at("2026-11-19T22:36:00", "2026-11-20T08:10:00")).toBe("taking_longer");
  });
  it("is delayed from 24 hours, at any time of day (4d)", () => {
    expect(at("2026-11-18T10:42:00", "2026-11-19T10:42:00")).toBe("delayed");
    expect(at("2026-11-18T23:00:00", "2026-11-19T23:30:00")).toBe("delayed");
    expect(at("2026-11-18T10:43:00", "2026-11-19T10:42:00")).toBe("taking_longer");
  });
});

describe("resultVariant", () => {
  it("credited (5a)", () => {
    expect(resultVariant(deposit({ status: "COMPLETED" }))).toBe("credited");
    expect(resultVariant(deposit({ status: "COMPLETED", declaredAmount: 2000 }))).toBe("credited");
  });
  it("credited a different amount (5b), lower or higher", () => {
    expect(resultVariant(deposit({ status: "COMPLETED", amount: 1500, declaredAmount: 2000 }))).toBe("credited_different");
    expect(resultVariant(deposit({ status: "COMPLETED", amount: 2500, declaredAmount: 2000 }))).toBe("credited_different");
  });
  it("not credited (5c)", () => {
    expect(resultVariant(deposit({ status: "FAILED" }))).toBe("not_credited");
  });
  it("nothing while pending", () => {
    expect(resultVariant(deposit())).toBeNull();
  });
});

describe("entryStep (Figma V1 rules)", () => {
  it("a pending deposit wins, even with no accounts", () => {
    expect(entryStep({ hasPending: true, fundingAccountCount: 0 })).toBe("in_progress");
    expect(entryStep({ hasPending: true, fundingAccountCount: 2 })).toBe("in_progress");
  });
  it("no funding account → add one first", () => {
    expect(entryStep({ hasPending: false, fundingAccountCount: 0 })).toBe("add_account");
  });
  it("otherwise amount and source", () => {
    expect(entryStep({ hasPending: false, fundingAccountCount: 1 })).toBe("amount");
  });
});

describe("settleWatch", () => {
  it("shows a watched deposit once it settles and stops watching it", () => {
    const r = settleWatch(["a"], [deposit({ id: "a", status: "COMPLETED" })]);
    expect(r.toShow.map((d) => d.id)).toEqual(["a"]);
    expect(r.nextWatch).toEqual([]);
  });
  it("never shows a deposit it was not watching", () => {
    const r = settleWatch([], [deposit({ id: "old", status: "FAILED" })]);
    expect(r.toShow).toEqual([]);
  });
  it("watches every pending deposit, including ones declared elsewhere", () => {
    const r = settleWatch([], [deposit({ id: "p1" }), deposit({ id: "p2" })]);
    expect(r.nextWatch).toEqual(["p1", "p2"]);
  });
  it("keeps watching ids pushed off the first page", () => {
    const r = settleWatch(["gone"], [deposit({ id: "p1" })]);
    expect(r.nextWatch).toEqual(["p1", "gone"]);
  });
  it("caps the list", () => {
    const many = Array.from({ length: 50 }, (_, i) => `w${i}`);
    expect(settleWatch(many, []).nextWatch).toHaveLength(MAX_WATCHED);
  });
});

describe("planResultPopup", () => {
  const yes = () => true;
  const no = () => false;

  it("shows the newest settled deposit and stops watching it", () => {
    const r = planResultPopup(["a"], [deposit({ id: "a", status: "COMPLETED" })], yes);
    expect(r).toEqual({ show: "a", watch: [] });
  });

  it("keeps a settled deposit watched when it cannot be shown yet", () => {
    const r = planResultPopup(["a"], [deposit({ id: "a", status: "FAILED" })], no);
    expect(r).toEqual({ show: null, watch: ["a"] });
  });

  it("shows one at a time; the rest wait their turn", () => {
    const r = planResultPopup(
      ["a", "b"],
      [deposit({ id: "b", status: "COMPLETED" }), deposit({ id: "a", status: "FAILED" })],
      yes,
    );
    expect(r).toEqual({ show: "b", watch: ["a"] });
  });

  it("never lets the cap drop a settled deposit that is waiting to be shown", () => {
    const pendings = Array.from({ length: MAX_WATCHED + 5 }, (_, i) => deposit({ id: `p${i}` }));
    const r = planResultPopup(["done"], [...pendings, deposit({ id: "done", status: "COMPLETED" })], no);
    expect(r.watch[0]).toBe("done");
    expect(r.watch).toHaveLength(MAX_WATCHED);
  });
});

describe("display helpers", () => {
  it("formatNaira", () => {
    expect(formatNaira(2000)).toBe("₦2,000");
    expect(formatNaira(12450, { decimals: true })).toBe("₦12,450.00");
  });
  it("accountLabel", () => {
    expect(accountLabel({ bankName: "GTBank", accountNumber: "0127661815" })).toBe("GTBank ••••1815");
  });
  it("depositSource prefers the backend's record, then this device's", () => {
    const accounts = [
      { id: "a", bankName: "GTBank", accountNumber: "0127661815" },
      { id: "b", bankName: "OPay", accountNumber: "8059048734" },
    ];
    expect(depositSource({ fundingAccountId: "a" }, accounts, "b")?.id).toBe("a");
    expect(depositSource({ fundingAccountId: null }, accounts, "b")?.id).toBe("b");
    expect(depositSource({ fundingAccountId: null }, accounts, null)).toBeNull();
    expect(depositSource({ fundingAccountId: "deleted" }, accounts, null)).toBeNull();
    expect(sourceLabel(null)).toBe(UNKNOWN_SOURCE_LABEL);
  });
  it("parseAmountInput", () => {
    expect(parseAmountInput("2,000")).toBe(2000);
    expect(parseAmountInput("")).toBe(0);
    expect(parseAmountInput("abc")).toBe(0);
  });
  it("transferDetailsText has every field", () => {
    expect(
      transferDetailsText({ amount: 2000, bankName: "Stanbic IBTC Bank", accountNumber: "0076322108", accountName: "XBANKA LTD" }),
    ).toBe("Amount: ₦2,000\nBank: Stanbic IBTC Bank\nAccount number: 0076322108\nAccount name: XBANKA LTD");
  });
});
