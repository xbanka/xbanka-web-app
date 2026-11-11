// Trusted wallets: the crypto addresses a customer may withdraw to.
// Spec: "Trusted wallets: frontend integration guide" (backend PRs #35-#39).
//
// Everything here is pure so the rules the guide sets (codes, digits, the
// cooling-off clock, which error sends the customer where) are pinned by gate
// tests instead of living inside components.

export type TrustedWalletStatus = "COOLING_OFF" | "ACTIVE";

export interface TrustedWallet {
  id: string;
  currency: string;
  /** Obiex network code: BTC, ETH, BSC, MATIC, TRX, SOL. */
  network: string;
  address: string;
  memo: string | null;
  label: string;
  /** Worked out by the backend from `unlocksAt` at request time. */
  status: TrustedWalletStatus | string;
  /** ISO time in UTC. */
  unlocksAt: string;
  createdAt: string;
}

export interface SupportedNetwork {
  code: string;
  name: string;
}

export interface SupportedAsset {
  currency: string;
  networks: SupportedNetwork[];
}

export interface TrustedWalletsSupported {
  assets: SupportedAsset[];
  coolingOffHours: number;
  labelMaxLength: number;
  maxWalletsPerNetwork: number;
}

export interface ValidateAddressPayload {
  currency: string;
  network: string;
  address: string;
}

export interface ValidateAddressResult {
  valid: boolean;
  network: string;
  reason?: string;
}

export interface AddTrustedWalletPayload {
  currency: string;
  network: string;
  address: string;
  addressConfirm: string;
  label: string;
  ownershipConfirmed: true;
  pin: string;
  code: string;
}

export interface RemoveTrustedWalletPayload {
  pin: string;
  code: string;
}

export const PIN_LENGTH = 4;
export const CODE_LENGTH = 6;
/** Fallbacks for when GET /supported has not answered yet. */
export const DEFAULT_LABEL_MAX_LENGTH = 24;
export const DEFAULT_COOLING_OFF_HOURS = 24;

// The guide's network table. Labels shown to customers should come from the
// `supported` call; this is the fallback when it has not loaded.
const NETWORK_NAMES: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum (ERC20)",
  BSC: "BSC (BEP20)",
  MATIC: "Polygon",
  TRX: "Tron (TRC20)",
  SOL: "Solana",
};

/** Customer-facing network name: the `supported` label, else the guide's table, else the code. */
export const networkName = (
  code: string | null | undefined,
  supported?: TrustedWalletsSupported | null,
): string => {
  if (!code) return "";
  for (const asset of supported?.assets ?? []) {
    const hit = asset.networks.find((n) => n.code === code);
    if (hit) return hit.name;
  }
  return NETWORK_NAMES[code] ?? code;
};

export interface ActiveNetworkAsset extends SupportedAsset {
  currencyName: string;
}

/**
 * Coins and networks from `/wallets/active-networks`, the list behind the
 * Deposit "Select a coin" dropdown. Only CRYPTO and STABLE assets, with
 * networks mapped to `{ code, name }`. Malformed entries are skipped.
 */
export const assetsFromActiveNetworks = (raw: unknown): ActiveNetworkAsset[] => {
  if (!raw || typeof raw !== "object") return [];
  const out: ActiveNetworkAsset[] = [];
  for (const [currency, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const v = value as {
      currencyType?: string;
      currencyName?: string;
      networks?: { networkCode?: string; networkName?: string }[];
    };
    if (v.currencyType !== "CRYPTO" && v.currencyType !== "STABLE") continue;
    const networks = (Array.isArray(v.networks) ? v.networks : [])
      .filter((n) => n && typeof n.networkCode === "string" && n.networkCode)
      .map((n) => ({
        code: n.networkCode as string,
        name: n.networkName || NETWORK_NAMES[n.networkCode as string] || (n.networkCode as string),
      }));
    out.push({ currency, currencyName: v.currencyName || currency, networks });
  }
  return out;
};

const isDigits = (value: string, length: number) =>
  value.length === length && /^\d+$/.test(value);

export const isCompletePin = (pin: string) => isDigits(pin, PIN_LENGTH);
export const isCompleteCode = (code: string) => isDigits(code, CODE_LENGTH);

/** The label rule: 1 to `max` characters once trimmed. Returns an error, or null. */
export const labelError = (
  label: string,
  max = DEFAULT_LABEL_MAX_LENGTH,
): string | null => {
  const trimmed = label.trim();
  if (!trimmed) return "Give this wallet a name.";
  if (trimmed.length > max) return `Use ${max} characters or fewer.`;
  return null;
};

/**
 * Whether the re-entered address matches the first one. Exact after trimming:
 * stricter than the backend's EVM case-folding, so anything we let through it
 * will accept too.
 */
export const addressesMatch = (first: string, second: string) => {
  const a = first.trim();
  return a.length > 0 && a === second.trim();
};

/** "TXk4mV…1xGo": both ends stay so the customer can check it by eye. */
export const shortAddress = (address: string, head = 6, tail = 4) => {
  const trimmed = address?.trim() ?? "";
  if (trimmed.length <= head + tail + 1) return trimmed;
  return `${trimmed.slice(0, head)}…${trimmed.slice(-tail)}`;
};

export const isCoolingOff = (wallet: Pick<TrustedWallet, "status">) =>
  wallet.status === "COOLING_OFF";

/**
 * A wallet can be picked on the Send screen only when the backend says it is
 * ACTIVE. The device clock is never used to unlock one: the backend refuses
 * early use with WALLET_COOLING_OFF, so the list is refetched instead.
 */
export const canSendTo = (wallet: Pick<TrustedWallet, "status">) =>
  wallet.status === "ACTIVE";

/**
 * Milliseconds until the soonest cooling-off wallet unlocks, plus a small
 * margin so the refetch lands after the backend flips it. Null when nothing
 * is cooling off. Capped below setTimeout's 32-bit limit.
 */
export const nextUnlockDelay = (
  wallets: Pick<TrustedWallet, "status" | "unlocksAt">[],
  now = Date.now(),
  marginMs = 2_000,
): number | null => {
  const times = wallets
    .filter(isCoolingOff)
    .map((w) => new Date(w.unlocksAt).getTime())
    .filter((t) => Number.isFinite(t));
  if (times.length === 0) return null;
  const delay = Math.max(0, Math.min(...times) - now) + marginMs;
  return Math.min(delay, 2_147_000_000);
};

/** "31 Oct 2026, 14:20" in the customer's timezone. */
export const formatUnlockTime = (
  iso: string | null | undefined,
  { withYear = true, timeZone }: { withYear?: boolean; timeZone?: string } = {},
): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
  return `${day}, ${time}`;
};

/** "12 Oct 2026" in the customer's timezone. */
export const formatAddedDate = (iso: string, timeZone?: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  }).format(date);
};

export const statusLabel = (status: string) => {
  if (status === "ACTIVE") return "Active";
  if (status === "COOLING_OFF") return "Cooling off";
  // Unknown future states still read as words, not SHOUTY_CODES.
  const words = status.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** "5 crypto wallets: 2 active, 1 cooling off." */
export const whitelistSummary = (wallets: Pick<TrustedWallet, "status">[]) => {
  const counts = new Map<string, number>();
  for (const w of wallets) counts.set(w.status, (counts.get(w.status) ?? 0) + 1);
  const total = wallets.length;
  const head = `${total} crypto wallet${total === 1 ? "" : "s"}`;
  if (total === 0) return head;
  const order = ["ACTIVE", "COOLING_OFF"];
  const keys = [
    ...order.filter((k) => counts.has(k)),
    ...[...counts.keys()].filter((k) => !order.includes(k)).sort(),
  ];
  return `${head}: ${keys
    .map((k) => `${counts.get(k)} ${statusLabel(k).toLowerCase()}`)
    .join(", ")}.`;
};

/**
 * Coin codes come from two backend lists (the user's balances and the
 * trusted-wallet record), so compare them trimmed and in one case.
 */
export const sameCurrency = (
  a: string | null | undefined,
  b: string | null | undefined,
) => {
  const x = a?.trim().toUpperCase();
  return !!x && x === b?.trim().toUpperCase();
};

/**
 * The body of GET /wallets/trusted-wallets. Anything but an array is refused,
 * not read as "no wallets": before backend #38 the wallet-by-id route answered
 * this path with 200 and no list, which showed "Add a wallet" to customers who
 * already had one.
 */
export const parseTrustedWalletList = (raw: unknown): TrustedWallet[] => {
  if (Array.isArray(raw)) return raw as TrustedWallet[];
  throw new Error("We couldn't load your saved wallets. Please try again.");
};

/** Saved wallets that can carry `currency`, ACTIVE first, then newest first. */
export const walletsForCurrency = (
  wallets: TrustedWallet[],
  currency: string | null | undefined,
) =>
  wallets
    .filter((w) => sameCurrency(w.currency, currency))
    .sort((a, b) => {
      const rank = Number(canSendTo(b)) - Number(canSendTo(a));
      if (rank) return rank;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

// ---- Errors -------------------------------------------------------------

export type TrustedWalletErrorGroup =
  | "TWO_FACTOR_REQUIRED"
  | "PIN_REQUIRED"
  | "WALLET_COOLING_OFF"
  | "TRUSTED_WALLET_REQUIRED";

interface ApiErrorShape {
  status?: number;
  message?: string;
  raw?: {
    response?: {
      status?: number;
      data?: { errorGroup?: string; details?: unknown; message?: string };
    };
  };
}

/**
 * The AxiosInstance interceptor flattens errors to { status, message, raw },
 * dropping the envelope's errorGroup and details. Recover them from `raw`.
 */
export const readApiError = (error: unknown) => {
  const err = (error ?? {}) as ApiErrorShape;
  const data = err.raw?.response?.data;
  return {
    status: err.status ?? err.raw?.response?.status ?? 0,
    message: err.message || data?.message || "Something went wrong",
    errorGroup: (data?.errorGroup || "") as TrustedWalletErrorGroup | "",
    details: typeof data?.details === "string" ? data.details : "",
  };
};

/**
 * What the app does with an error from add, remove or a trusted send, per the
 * guide's error table.
 */
export type TrustedWalletErrorAction =
  | { kind: "setup-2fa"; message: string }
  | { kind: "setup-pin"; message: string }
  | { kind: "cooling-off"; message: string; unlocksAt: string }
  | { kind: "pick-saved-wallet"; message: string }
  | { kind: "locked"; message: string }
  | { kind: "refetch"; message: string }
  | { kind: "inline"; message: string };

export const classifyTrustedWalletError = (
  error: unknown,
): TrustedWalletErrorAction => {
  const { status, message, errorGroup, details } = readApiError(error);
  if (errorGroup === "TWO_FACTOR_REQUIRED") return { kind: "setup-2fa", message };
  if (errorGroup === "PIN_REQUIRED") return { kind: "setup-pin", message };
  if (errorGroup === "WALLET_COOLING_OFF")
    return { kind: "cooling-off", message, unlocksAt: details };
  if (errorGroup === "TRUSTED_WALLET_REQUIRED")
    return { kind: "pick-saved-wallet", message };
  if (status === 429) return { kind: "locked", message };
  if (status === 404) return { kind: "refetch", message };
  // 403 wrong PIN/code, 409 duplicate, 400 address/limit/mismatch: show as is.
  return { kind: "inline", message };
};

// ---- Withdrawals --------------------------------------------------------

/**
 * Headline for a crypto withdrawal's status. PENDING means Obiex accepted the
 * payout but has not paid it, so it must never read as completed.
 */
export const withdrawalStatusText = (status: string | null | undefined) => {
  const s = (status ?? "").toUpperCase();
  if (s === "COMPLETED") return { title: "Sent", done: true };
  if (s === "FAILED") return { title: "Failed", done: false };
  return { title: "Processing", done: false };
};
