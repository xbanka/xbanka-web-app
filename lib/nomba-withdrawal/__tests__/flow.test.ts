import { describe, expect, it, vi } from "vitest";
import {
  confirmWithRetry,
  EXPIRY_SAFETY_MARGIN_MS,
  isWithdrawalExpired,
  nextStatusPollInterval,
  STATUS_POLL_INTERVAL_MS,
  UNKNOWN_OUTCOME_RETRY_DELAYS_MS,
  WITHDRAWAL_TOKEN_TTL_MS,
} from "@/lib/nomba-withdrawal";

const err = (status: number, message: string) => ({ success: false, status, message });
const TIMEOUT = err(408, "Network timeout. Please check your connection.");
const NETWORK = err(503, "Network error. Please check your internet connection.");
const WRONG_PIN = err(403, "Invalid transaction PIN");
const EXPIRED = err(400, "Withdrawal request expired. Please start again");
const noWait = () => Promise.resolve();

describe("isWithdrawalExpired", () => {
  const receivedAt = 1_000_000;
  const deadline = receivedAt + WITHDRAWAL_TOKEN_TTL_MS - EXPIRY_SAFETY_MARGIN_MS;

  it("is valid right after initiate", () => {
    expect(isWithdrawalExpired(receivedAt, receivedAt)).toBe(false);
  });

  it("expires a safety margin before the 10-minute TTL", () => {
    expect(isWithdrawalExpired(receivedAt, deadline - 1)).toBe(false);
    expect(isWithdrawalExpired(receivedAt, deadline)).toBe(true);
    expect(isWithdrawalExpired(receivedAt, receivedAt + WITHDRAWAL_TOKEN_TTL_MS)).toBe(true);
  });

  it("matches the contract's 10-minute TTL", () => {
    expect(WITHDRAWAL_TOKEN_TTL_MS).toBe(10 * 60_000);
  });

  it("ignores device clock skew: only elapsed local time counts", () => {
    // A phone 1 hour fast still gets the full window, because both
    // timestamps come from the same (wrong) clock.
    const skewedReceivedAt = Date.parse("2026-10-05T11:30:00.000Z");
    expect(isWithdrawalExpired(skewedReceivedAt, skewedReceivedAt + 60_000)).toBe(false);
  });
});

describe("nextStatusPollInterval", () => {
  it("polls while PENDING inside the window", () => {
    expect(nextStatusPollInterval("PENDING", 1_000, 2_000)).toBe(STATUS_POLL_INTERVAL_MS);
  });

  it("stops at the end of the window", () => {
    expect(nextStatusPollInterval("PENDING", 2_000, 2_000)).toBe(false);
  });

  it.each(["COMPLETED", "FAILED", undefined] as const)("stops for %s", (status) => {
    expect(nextStatusPollInterval(status, 0, 60_000)).toBe(false);
  });

  it("stays inside the contract's 3 to 5 second range", () => {
    expect(STATUS_POLL_INTERVAL_MS).toBeGreaterThanOrEqual(3_000);
    expect(STATUS_POLL_INTERVAL_MS).toBeLessThanOrEqual(5_000);
  });
});

describe("confirmWithRetry", () => {
  it("returns the first success without retrying", async () => {
    const confirm = vi.fn().mockResolvedValue("ok");
    await expect(confirmWithRetry(confirm, { wait: noWait })).resolves.toBe("ok");
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it("retries a timeout and returns the retried result", async () => {
    const confirm = vi.fn().mockRejectedValueOnce(TIMEOUT).mockResolvedValue("ok");
    const onRetry = vi.fn();
    await expect(confirmWithRetry(confirm, { wait: noWait, onRetry })).resolves.toBe("ok");
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(1);
  });

  it("waits the configured delay before each retry", async () => {
    const confirm = vi.fn().mockRejectedValue(NETWORK);
    const wait = vi.fn<(ms: number) => Promise<void>>(noWait);
    await expect(confirmWithRetry(confirm, { wait })).rejects.toBe(NETWORK);
    expect(wait.mock.calls.map(([ms]) => ms)).toEqual([...UNKNOWN_OUTCOME_RETRY_DELAYS_MS]);
    expect(confirm).toHaveBeenCalledTimes(UNKNOWN_OUTCOME_RETRY_DELAYS_MS.length + 1);
  });

  it("does not retry a known failure", async () => {
    const confirm = vi.fn().mockRejectedValue(WRONG_PIN);
    await expect(confirmWithRetry(confirm, { wait: noWait })).rejects.toBe(WRONG_PIN);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it("reports an expired token after a timeout as unknown, not expired", async () => {
    // Attempt 1 may have paid out. Sending the user back to initiate would
    // let them start a second withdrawal.
    const confirm = vi.fn().mockRejectedValueOnce(TIMEOUT).mockRejectedValue(EXPIRED);
    await expect(confirmWithRetry(confirm, { wait: noWait })).rejects.toBe(TIMEOUT);
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it("reports a wrong PIN after a timeout as unknown too", async () => {
    const confirm = vi.fn().mockRejectedValueOnce(NETWORK).mockRejectedValue(WRONG_PIN);
    await expect(confirmWithRetry(confirm, { wait: noWait })).rejects.toBe(NETWORK);
  });

  it("with no delays configured, never retries", async () => {
    const confirm = vi.fn().mockRejectedValue(TIMEOUT);
    await expect(confirmWithRetry(confirm, { delaysMs: [], wait: noWait })).rejects.toBe(TIMEOUT);
    expect(confirm).toHaveBeenCalledTimes(1);
  });
});
