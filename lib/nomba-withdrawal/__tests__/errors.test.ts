import { describe, expect, it } from "vitest";
import {
  classifyWithdrawalError,
  LIMIT_EXCEEDED_MESSAGE,
} from "@/lib/nomba-withdrawal";

// Errors arrive in the shape the axios interceptor rejects with.
const apiError = (status: number, message: string) => ({
  success: false,
  status,
  message,
});

describe("classifyWithdrawalError", () => {
  it.each([
    [400, "Withdrawal request expired. Please start again", "expired"],
    [400, "Invalid withdrawal token", "expired"],
    [403, "Withdrawal blocked: TIER_REQUIRED", "tier-required"],
    [403, "Withdrawal blocked: PIN_SETUP_REQUIRED", "pin-setup-required"],
    [400, "Transaction PIN not set", "pin-setup-required"],
    [403, "Withdrawal blocked: LIMIT_EXCEEDED", "limit-exceeded"],
    [403, "Invalid transaction PIN", "wrong-pin"],
    [429, "Too many incorrect PIN attempts. Try again in 15 minutes", "pin-locked"],
    [408, "Network timeout. Please check your connection.", "unknown-outcome"],
    [503, "Network error. Please check your internet connection.", "unknown-outcome"],
    [500, "Service currently unavailable. Please try again later.", "unknown-outcome"],
    [502, "Bad gateway", "unknown-outcome"],
    [400, "Insufficient NGN balance", "other"],
    [400, "Could not verify bank account", "other"],
    [404, "Withdrawal not found", "other"],
  ])("%i %s -> %s", (status, message, kind) => {
    expect(classifyWithdrawalError(apiError(status, message)).kind).toBe(kind);
  });

  it("matches wording case-insensitively", () => {
    expect(
      classifyWithdrawalError(apiError(400, "WITHDRAWAL REQUEST EXPIRED")).kind,
    ).toBe("expired");
  });

  it("wording beats status: a 5xx about an expired token is still expired", () => {
    // Otherwise the PIN step would retry a token that can never succeed.
    expect(
      classifyWithdrawalError(apiError(500, "Invalid withdrawal token")).kind,
    ).toBe("expired");
  });

  it("replaces the raw LIMIT_EXCEEDED code with readable text", () => {
    expect(
      classifyWithdrawalError(apiError(403, "Withdrawal blocked: LIMIT_EXCEEDED"))
        .message,
    ).toBe(LIMIT_EXCEEDED_MESSAGE);
  });

  it("keeps the backend message for everything else", () => {
    expect(
      classifyWithdrawalError(apiError(400, "Insufficient NGN balance")).message,
    ).toBe("Insufficient NGN balance");
  });

  it.each([undefined, null, {}, new Error("boom")])(
    "never throws on odd input (%s)",
    (input) => {
      expect(classifyWithdrawalError(input).kind).toBe("other");
    },
  );
});
