/**
 * Bank transfer deposits (Add Fund V2, Figma "ADD FUND - BANK TRANSFER").
 *
 * A deposit is a manual funding intent: the user taps "I have sent the money"
 * (POST /wallet/funding-accounts/declare-intent), which creates a PENDING
 * DEPOSIT transaction. Staff match it against the bank statement in the admin
 * app and complete it (COMPLETED, wallet credited) or reject it (FAILED).
 *
 * There is no endpoint just for intents: they come back from
 * GET /wallet/transactions, told apart by `metadata.source`. Everything here
 * is pure so the rules can be tested without React or a network.
 *
 * Times: approval hours are 8am to 10pm Lagos time, and every time shown in
 * this flow is Lagos time too, so "submitted 10:36pm" and "credited from 8am"
 * always agree. Lagos is UTC+1 all year (no daylight saving), so the offset is
 * a constant instead of a timezone database lookup.
 */

export const BANK_TRANSFER_INTENT_SOURCE = "BANK_TRANSFER_INTENT";

/** "Usually credited within 15 minutes" (product decision, 2026-11-19). */
export const CREDIT_SLA_MINUTES = 15;
/** Past this, the deposit shows as delayed (frame 4d). */
export const DELAYED_AFTER_MINUTES = 24 * 60;
export const APPROVAL_OPEN_HOUR = 8;
export const APPROVAL_CLOSE_HOUR = 22;
export const MIN_DEPOSIT_NGN = 1_000;
/** How often a pending deposit is re-read. Rejections move no money, so the
 *  wallet stream never announces them; this poll is what surfaces them. */
export const PENDING_POLL_MS = 30_000;

const LAGOS_OFFSET_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export type DepositStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface BankDeposit {
  id: string;
  reference: string;
  status: DepositStatus;
  /** What the wallet was (or will be) credited with. */
  amount: number;
  /** What the user said they sent, when the backend records it separately. */
  declaredAmount: number | null;
  createdAt: string;
  updatedAt: string;
  /** The account the user paid from, when the backend records it. */
  fundingAccountId: string | null;
}

export interface FundingAccountLike {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
}

type TransactionLike = {
  id?: unknown;
  type?: unknown;
  status?: unknown;
  amount?: unknown;
  reference?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  metadata?: unknown;
};

const STATUSES: readonly DepositStatus[] = ["PENDING", "COMPLETED", "FAILED"];

/** Transaction metadata arrives as a JSON string; anything unreadable is {}. */
export const parseMetadata = (raw: unknown): Record<string, unknown> => {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw !== "string" || raw.trim() === "") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const isValidDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

/** A transaction row as a bank deposit, or null if it is anything else. */
export const toBankDeposit = (tx: TransactionLike | null | undefined): BankDeposit | null => {
  if (!tx || tx.type !== "DEPOSIT") return null;
  const meta = parseMetadata(tx.metadata);
  if (meta.source !== BANK_TRANSFER_INTENT_SOURCE) return null;

  const status = STATUSES.find((s) => s === tx.status);
  const amount = toNumber(tx.amount);
  if (!status || amount === null || typeof tx.id !== "string" || !isValidDate(tx.createdAt)) {
    return null;
  }

  const declared = toNumber(meta.declaredAmount);
  return {
    id: tx.id,
    reference: typeof tx.reference === "string" ? tx.reference : tx.id,
    status,
    amount,
    declaredAmount: declared,
    createdAt: tx.createdAt,
    updatedAt: isValidDate(tx.updatedAt) ? tx.updatedAt : tx.createdAt,
    fundingAccountId:
      typeof meta.fundingAccountId === "string" && meta.fundingAccountId
        ? meta.fundingAccountId
        : null,
  };
};

/** Bank deposits in a transaction list, newest first. */
export const bankDepositsFrom = (items: unknown): BankDeposit[] =>
  (Array.isArray(items) ? items : [])
    .map((tx) => toBankDeposit(tx as TransactionLike))
    .filter((d): d is BankDeposit => d !== null)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

export const pendingDeposits = (deposits: BankDeposit[]) =>
  deposits.filter((d) => d.status === "PENDING");

/** The deposit just declared, built from the declare-intent response so the
 *  status screen can open before the transaction list catches up. */
export const depositFromDeclareResponse = (
  data: unknown,
  fallbackAmount: number,
  fundingAccountId: string | null,
): BankDeposit | null => {
  const d = (data ?? {}) as Record<string, unknown>;
  if (typeof d.transactionId !== "string") return null;
  const createdAt = isValidDate(d.createdAt) ? d.createdAt : new Date().toISOString();
  return {
    id: d.transactionId,
    reference: typeof d.reference === "string" ? d.reference : d.transactionId,
    status: "PENDING",
    amount: toNumber(d.amount) ?? fallbackAmount,
    declaredAmount: null,
    createdAt,
    updatedAt: createdAt,
    fundingAccountId,
  };
};

// ── Time (Lagos) ────────────────────────────────────────────────────────────

/** A Date whose UTC fields read as Lagos wall-clock time. */
const lagos = (at: Date | string | number) =>
  new Date(new Date(at).getTime() + LAGOS_OFFSET_MS);

const lagosDayKey = (at: Date | string | number) => {
  const d = lagos(at);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
};

/** True from 8:00am up to (not including) 10:00pm Lagos time. */
export const isApprovalOpen = (now: Date) => {
  const hour = lagos(now).getUTCHours();
  return hour >= APPROVAL_OPEN_HOUR && hour < APPROVAL_CLOSE_HOUR;
};

/** Before 8am (as opposed to after 10pm): changes the after-hours wording. */
export const isBeforeApprovalOpen = (now: Date) =>
  lagos(now).getUTCHours() < APPROVAL_OPEN_HOUR;

/** Whole minutes since `iso`, never negative (device clocks drift). */
export const minutesSince = (iso: string, now: Date) =>
  Math.max(0, Math.floor((now.getTime() - Date.parse(iso)) / MINUTE_MS));

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

/** "18 minutes", "1 hour 5 minutes", "2 days". */
export const formatWaiting = (minutes: number) => {
  const m = Math.max(0, Math.floor(minutes));
  if (m < 60) return plural(m, "minute");
  if (m < DELAYED_AFTER_MINUTES) {
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return rest ? `${plural(h, "hour")} ${plural(rest, "minute")}` : plural(h, "hour");
  }
  return plural(Math.floor(m / DELAYED_AFTER_MINUTES), "day");
};

/** "10:42am", "10:36pm", "12:05am". */
export const formatClock = (iso: string) => {
  const d = lagos(iso);
  const h24 = d.getUTCHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h12}:${mm}${h24 < 12 ? "am" : "pm"}`;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Today, 10:42am", "Yesterday, 10:42am", "16 Nov, 10:42am". */
export const formatDepositTime = (iso: string, now: Date) => {
  const clock = formatClock(iso);
  if (lagosDayKey(iso) === lagosDayKey(now)) return `Today, ${clock}`;
  if (lagosDayKey(iso) === lagosDayKey(now.getTime() - DELAYED_AFTER_MINUTES * MINUTE_MS)) {
    return `Yesterday, ${clock}`;
  }
  const d = lagos(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${clock}`;
};

// ── States ─────────────────────────────────────────────────────────────────

/**
 * Which pending message to show. Most specific first:
 *  - delayed (4d): pending over 24 hours, whatever the time of day
 *  - after_hours (P1c): approvals are closed right now, so nobody is checking
 *  - taking_longer (P1b): past the 15-minute promise during approval hours
 *  - waiting (P1): within the promise
 */
export type PendingVariant = "waiting" | "taking_longer" | "after_hours" | "delayed";

export const pendingVariant = (deposit: Pick<BankDeposit, "createdAt">, now: Date): PendingVariant => {
  const waited = minutesSince(deposit.createdAt, now);
  if (waited >= DELAYED_AFTER_MINUTES) return "delayed";
  if (!isApprovalOpen(now)) return "after_hours";
  if (waited > CREDIT_SLA_MINUTES) return "taking_longer";
  return "waiting";
};

/** Which result screen a settled deposit gets (5a / 5b / 5c). */
export type ResultVariant = "credited" | "credited_different" | "not_credited";

export const resultVariant = (deposit: BankDeposit): ResultVariant | null => {
  if (deposit.status === "FAILED") return "not_credited";
  if (deposit.status !== "COMPLETED") return null;
  return deposit.declaredAmount !== null && deposit.declaredAmount !== deposit.amount
    ? "credited_different"
    : "credited";
};

/**
 * Where "Add Fund" lands (Figma "V1 rules"):
 *  - a deposit is already pending → "You have a deposit in progress"
 *  - no funding account registered → add the account first
 *  - otherwise → amount and source
 */
export type EntryStep = "in_progress" | "add_account" | "amount";

export const entryStep = ({
  hasPending,
  fundingAccountCount,
}: {
  hasPending: boolean;
  fundingAccountCount: number;
}): EntryStep => {
  if (hasPending) return "in_progress";
  if (fundingAccountCount === 0) return "add_account";
  return "amount";
};

/**
 * Result screens pop up once, and only for deposits this browser watched while
 * pending: old deposits never pop up, and one declared, then approved while
 * the tab was closed, still shows its result on the next visit.
 *
 * Returns the deposits to show (newest first) and the new watch list:
 * every pending deposit, plus watched ids not in this page of results (kept so
 * a deposit pushed off the first page is not forgotten), minus settled ones.
 */
export const MAX_WATCHED = 20;

export const settleWatch = (
  watched: readonly string[],
  deposits: BankDeposit[],
): { toShow: BankDeposit[]; nextWatch: string[] } => {
  const byId = new Map(deposits.map((d) => [d.id, d]));
  const watchSet = new Set(watched);
  const toShow = deposits.filter((d) => watchSet.has(d.id) && d.status !== "PENDING");
  const next = [
    ...deposits.filter((d) => d.status === "PENDING").map((d) => d.id),
    ...watched.filter((id) => !byId.has(id)),
  ];
  return { toShow, nextWatch: [...new Set(next)].slice(0, MAX_WATCHED) };
};

/**
 * One read of the deposits: which result to pop up now (if any) and what to
 * keep watching. A settled deposit that cannot be shown right now (the user is
 * mid-flow on something else, or another result is showing) stays watched, at
 * the front so the cap never drops it, and gets its turn on a later read.
 */
export const planResultPopup = (
  watched: readonly string[],
  deposits: BankDeposit[],
  canShow: (depositId: string) => boolean,
): { show: string | null; watch: string[] } => {
  const { toShow, nextWatch } = settleWatch(watched, deposits);
  const first = toShow[0];
  const show = first && canShow(first.id) ? first.id : null;
  const unshown = toShow.filter((d) => d.id !== show).map((d) => d.id);
  return { show, watch: [...new Set([...unshown, ...nextWatch])].slice(0, MAX_WATCHED) };
};

// ── Display ────────────────────────────────────────────────────────────────

/** "₦2,000", or "₦12,450.00" with decimals. */
export const formatNaira = (amount: number, { decimals = false } = {}) =>
  `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 2,
  })}`;

/** "GTBank ••••1815". */
export const accountLabel = (account: Pick<FundingAccountLike, "bankName" | "accountNumber">) =>
  `${account.bankName} ••••${account.accountNumber.slice(-4)}`;

/** Shown when we cannot tell which registered account paid. */
export const UNKNOWN_SOURCE_LABEL = "Your registered account";

/**
 * The account a deposit was paid from: the backend's record first, then the
 * choice remembered on this device, else unknown.
 */
export const depositSource = (
  deposit: Pick<BankDeposit, "fundingAccountId"> | null,
  fundingAccounts: FundingAccountLike[],
  rememberedId: string | null,
): FundingAccountLike | null => {
  const id = deposit?.fundingAccountId ?? rememberedId;
  return (id && fundingAccounts.find((a) => a.id === id)) || null;
};

export const sourceLabel = (account: FundingAccountLike | null) =>
  account ? accountLabel(account) : UNKNOWN_SOURCE_LABEL;

/** Parses "2,000" (as typed) to 2000; anything else to 0. */
export const parseAmountInput = (value: string) => {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** What "Copy all details" puts on the clipboard. */
export const transferDetailsText = ({
  amount,
  bankName,
  accountNumber,
  accountName,
}: {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}) =>
  [
    `Amount: ${formatNaira(amount)}`,
    `Bank: ${bankName}`,
    `Account number: ${accountNumber}`,
    `Account name: ${accountName}`,
  ].join("\n");

/** The WhatsApp message for "Contact support" on a deposit. */
export const depositSupportMessage = (deposit: BankDeposit, source: string) =>
  [
    `Deposit of ${formatNaira(deposit.declaredAmount ?? deposit.amount)} from ${source}`,
    `Request ID: ${deposit.reference}`,
    `Status: ${deposit.status}`,
  ].join("\n");
