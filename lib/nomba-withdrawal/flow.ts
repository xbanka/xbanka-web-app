import type { NombaWithdrawalStatus } from "@/lib/types/wallet-types";
import { classifyWithdrawalError } from "./errors";

/** CONTRACT.md: poll every 3 to 5 seconds for about a minute while PENDING. */
export const STATUS_POLL_INTERVAL_MS = 4_000;
export const STATUS_POLL_WINDOW_MS = 60_000;

/** CONTRACT.md: the withdrawalToken expires 10 minutes after initiate. */
export const WITHDRAWAL_TOKEN_TTL_MS = 10 * 60_000;

/**
 * Treat the token as expired slightly early, so a user who reaches the PIN
 * screen with seconds left doesn't submit a PIN only to be bounced back.
 */
export const EXPIRY_SAFETY_MARGIN_MS = 15_000;

/** Waits before each retry of a confirm whose outcome is unknown. */
export const UNKNOWN_OUTCOME_RETRY_DELAYS_MS: readonly number[] = [1_000, 2_000];

/**
 * Whether a token received at `receivedAt` (local ms) should be treated as
 * expired at `now` (local ms).
 *
 * Measured from when this client received the token, not from the server's
 * `expiresAt`: comparing `expiresAt` with the device clock breaks on any
 * phone whose clock is off. If the clock runs 10+ minutes fast, every token
 * looks expired on arrival and the user can never get past the amount step.
 * The backend stays authoritative: it still rejects a truly expired token.
 */
export const isWithdrawalExpired = (receivedAt: number, now: number): boolean =>
  now - receivedAt >= WITHDRAWAL_TOKEN_TTL_MS - EXPIRY_SAFETY_MARGIN_MS;

/** react-query `refetchInterval` for the status query. */
export const nextStatusPollInterval = (
  status: NombaWithdrawalStatus | undefined,
  now: number,
  pollUntil: number,
): number | false =>
  status === "PENDING" && now < pollUntil ? STATUS_POLL_INTERVAL_MS : false;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Calls `confirm`, retrying while the outcome is unknown (timeout, network
 * drop, 5xx). Retrying is safe: confirm is idempotent per withdrawalToken, so
 * the backend returns the original withdrawal instead of paying twice.
 *
 * Once any attempt has had an unknown outcome, a later error is rethrown as
 * that unknown-outcome error, not as itself. Example: attempt 1 times out
 * after the transfer was sent, attempt 2 reports "Withdrawal request expired".
 * Surfacing "expired" would send the user back to initiate a second,
 * independent withdrawal while the first may have paid out.
 */
export async function confirmWithRetry<T>(
  confirm: () => Promise<T>,
  {
    delaysMs = UNKNOWN_OUTCOME_RETRY_DELAYS_MS,
    wait = sleep,
    onRetry,
  }: {
    delaysMs?: readonly number[];
    wait?: (ms: number) => Promise<void>;
    onRetry?: (attempt: number) => void;
  } = {},
): Promise<T> {
  let unknownOutcome: unknown = null;

  for (let attempt = 0; ; attempt++) {
    try {
      return await confirm();
    } catch (err) {
      const isUnknown = classifyWithdrawalError(err).kind === "unknown-outcome";
      if (isUnknown) unknownOutcome = err;
      if (!isUnknown || attempt >= delaysMs.length) {
        throw unknownOutcome ?? err;
      }
      onRetry?.(attempt + 1);
      await wait(delaysMs[attempt]);
    }
  }
}
