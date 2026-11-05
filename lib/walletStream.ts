/**
 * Live wallet balances over Server-Sent Events.
 *
 * Backend contract (Live wallet balances: frontend integration guide, backend
 * PR #40): POST /wallets/stream/ticket returns a one-time ticket, then
 * GET /wallets/stream?ticket=... sends a `snapshot` of every balance, a
 * `balance` event per change, and a `ping` every 25s. The server closes the
 * stream after 30 minutes. A ticket works once, so EventSource's own
 * reconnect (same URL) would 401: we close on error and reconnect with a new
 * ticket.
 *
 * Events carry balances only. The fiat tab, crypto tab and home page each
 * cache their own list (GET /wallets/fiat, /wallets/crypto, /wallets), so one
 * stream patches all of them, matching on currency.
 */

/** React Query keys whose data is `{ data: { data: wallet[] } }`. */
export const WALLET_BALANCE_QUERY_KEYS = [
  "all-wallet-balances",
  "fiat-wallet",
  "crypto-wallet",
] as const;

export type StreamWallet = {
  currency: string;
  type: "FIAT" | "CRYPTO" | string;
  balance: number;
};

export type BalanceEvent = StreamWallet & {
  previousBalance: number | null;
  changedAt: string;
};

export type WalletStreamStatus =
  /** Fetching a ticket or waiting for the snapshot. */
  | "connecting"
  /** Snapshot received; balances are live. */
  | "live"
  /** Lost or never got the stream; retrying with backoff. Poll meanwhile. */
  | "down"
  /** The backend has no stream endpoint (404). Poll only, do not retry. */
  | "unsupported";

type Equivalent = { amount: number; currency: string; rate: number } | null;

type CachedWallet = {
  currency?: string;
  balance?: number | string;
  fiatEquivalent?: Equivalent;
  usdEquivalent?: Equivalent;
  [key: string]: unknown;
};

/**
 * Scale a derived value (naira or dollar equivalent) with the balance. The
 * ratio comes from the server's own figures, so no rate direction is assumed.
 * From a zero balance there is no ratio; the caller refetches to fill it in.
 */
const rescale = (eq: Equivalent | undefined, from: number, to: number) => {
  if (!eq || typeof eq.amount !== "number") return eq;
  if (to === 0) return { ...eq, amount: 0 };
  if (!from) return eq;
  return { ...eq, amount: (eq.amount * to) / from };
};

/**
 * Write new balances into one cached wallet query. Returns the same object
 * when nothing changed, so React Query does not re-render for a no-op.
 * Currencies the cache does not list are ignored (the snapshot can include
 * wallets GET /wallets does not return).
 */
export function patchWalletCache<T>(
  cached: T,
  balances: ReadonlyMap<string, number>,
): T {
  const envelope = (cached as { data?: { data?: unknown } } | undefined)?.data;
  const list = envelope?.data;
  if (!Array.isArray(list) || balances.size === 0) return cached;

  let changed = false;
  const next = list.map((wallet: CachedWallet) => {
    const key = wallet?.currency?.toUpperCase();
    if (!key || !balances.has(key)) return wallet;
    const balance = balances.get(key)!;
    const previous = Number(wallet.balance) || 0;
    if (previous === balance && typeof wallet.balance === "number") {
      return wallet;
    }
    changed = true;
    const patched: CachedWallet = { ...wallet, balance };
    if ("fiatEquivalent" in wallet) {
      patched.fiatEquivalent = rescale(wallet.fiatEquivalent, previous, balance);
    }
    if ("usdEquivalent" in wallet) {
      patched.usdEquivalent = rescale(wallet.usdEquivalent, previous, balance);
    }
    return patched;
  });

  if (!changed) return cached;
  return {
    ...(cached as object),
    data: { ...(envelope as object), data: next },
  } as T;
}

/** Currency -> balance, upper-cased so "ngn" and "NGN" match. */
export const toBalanceMap = (wallets: readonly StreamWallet[]) =>
  new Map(
    wallets
      .filter((w) => typeof w?.currency === "string" && Number.isFinite(w.balance))
      .map((w) => [w.currency.toUpperCase(), w.balance]),
  );

/**
 * Drops `balance` events older than what we already applied for that
 * currency. A snapshot is the truth at connect time, so it resets the guard.
 */
export function createStaleGuard() {
  let latest = new Map<string, number>();
  return {
    reset() {
      latest = new Map();
    },
    /** True if the event is new enough to apply; records it if so. */
    accept(event: Pick<BalanceEvent, "currency" | "changedAt">) {
      const at = Date.parse(event.changedAt);
      const key = event.currency.toUpperCase();
      if (Number.isNaN(at)) return !latest.has(key);
      const held = latest.get(key);
      if (held !== undefined && at <= held) return false;
      latest.set(key, at);
      return true;
    },
  };
}

/** Exponential backoff: 1s, 2s, 4s ... capped at 30s. */
export const backoffDelay = (attempt: number) =>
  Math.min(30_000, 1000 * 2 ** Math.max(0, attempt));

/**
 * A connection that lived at least this long counts as healthy, so the next
 * failure starts the backoff over. A stream closed straight after its snapshot
 * (the server evicting the oldest of 5+ tabs) keeps backing off instead of
 * kicking the other tabs every second.
 */
export const HEALTHY_CONNECTION_MS = 60_000;

type EventSourceLike = {
  addEventListener(type: string, listener: (e: { data?: unknown }) => void): void;
  onerror: ((e: unknown) => void) | null;
  close(): void;
};

export type WalletStreamDeps = {
  /** POST /wallets/stream/ticket, resolving to the ticket string. */
  fetchTicket: () => Promise<string>;
  /** Backend base URL, e.g. process.env.NEXT_PUBLIC_API_URL. */
  baseUrl: string;
  createEventSource?: (url: string) => EventSourceLike;
  onSnapshot: (wallets: StreamWallet[]) => void;
  onBalance: (event: BalanceEvent) => void;
  onStatus?: (status: WalletStreamStatus) => void;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (id: unknown) => void;
};

export const streamUrl = (baseUrl: string, ticket: string) =>
  `${baseUrl.replace(/\/+$/, "")}/wallets/stream?ticket=${encodeURIComponent(ticket)}`;

const parse = (raw: unknown) => {
  try {
    return typeof raw === "string" ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Opens the stream and keeps it open. Call the returned function to stop. */
export function openWalletStream(deps: WalletStreamDeps): () => void {
  const {
    fetchTicket,
    baseUrl,
    onSnapshot,
    onBalance,
    onStatus = () => {},
    createEventSource = (url) => new EventSource(url) as unknown as EventSourceLike,
    now = Date.now,
    setTimer = (fn, ms) => setTimeout(fn, ms),
    clearTimer = (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
  } = deps;

  let source: EventSourceLike | null = null;
  let timer: unknown = null;
  let attempt = 0;
  let stopped = false;
  let openedAt: number | null = null;

  const retryLater = () => {
    if (stopped) return;
    onStatus("down");
    timer = setTimer(connect, backoffDelay(attempt++));
  };

  async function connect() {
    timer = null;
    if (stopped) return;
    onStatus("connecting");

    let ticket: string;
    try {
      ticket = await fetchTicket();
    } catch (err) {
      if (stopped) return;
      if ((err as { status?: number })?.status === 404) {
        onStatus("unsupported");
        return;
      }
      retryLater();
      return;
    }
    if (stopped) return;

    const es = createEventSource(streamUrl(baseUrl, ticket));
    source = es;

    es.addEventListener("snapshot", (e) => {
      const wallets = parse(e.data)?.wallets;
      if (!Array.isArray(wallets)) return;
      openedAt = now();
      onSnapshot(wallets);
      onStatus("live");
    });
    es.addEventListener("balance", (e) => {
      const event = parse(e.data);
      if (typeof event?.currency !== "string" || !Number.isFinite(event.balance)) {
        return;
      }
      onBalance(event);
    });
    es.onerror = () => {
      es.close();
      if (source !== es) return;
      source = null;
      if (openedAt !== null && now() - openedAt >= HEALTHY_CONNECTION_MS) {
        attempt = 0;
      }
      openedAt = null;
      retryLater();
    };
  }

  connect();

  return () => {
    stopped = true;
    if (timer !== null) clearTimer(timer);
    source?.close();
    source = null;
  };
}
