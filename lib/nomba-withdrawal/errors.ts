import { ApiError } from "@/lib/types/error-types";

// Error cases from CONTRACT.md ("Errors" table). The backend only exposes a
// message string, so the wording-based cases below are pinned by
// __tests__/contract.test.ts, which reads the table and fails when a row is
// added or reworded without a matching classification here.
export type WithdrawalErrorKind =
  | "expired" // token expired or invalid: restart from initiate
  | "tier-required" // BVN not verified: send to KYC
  | "pin-setup-required" // no transaction PIN: send to PIN setup
  | "limit-exceeded" // daily withdrawal limit reached
  | "wrong-pin" // incorrect PIN: let them retry
  | "pin-locked" // too many wrong PINs: disable PIN entry
  | "unknown-outcome" // timeout / network / 5xx: the withdrawal may exist
  | "other";

export interface ClassifiedWithdrawalError {
  kind: WithdrawalErrorKind;
  message: string;
}

export const LIMIT_EXCEEDED_MESSAGE =
  "You've reached your daily withdrawal limit. Please try again tomorrow.";

export const classifyWithdrawalError = (
  error: unknown,
): ClassifiedWithdrawalError => {
  const { status, message = "Something went wrong" } = (error ??
    {}) as Partial<ApiError>;
  const text = message.toLowerCase();

  if (
    text.includes("withdrawal request expired") ||
    text.includes("invalid withdrawal token")
  ) {
    return { kind: "expired", message };
  }
  if (text.includes("tier_required")) return { kind: "tier-required", message };
  if (
    text.includes("pin_setup_required") ||
    text.includes("transaction pin not set")
  ) {
    return { kind: "pin-setup-required", message };
  }
  if (text.includes("limit_exceeded")) {
    return { kind: "limit-exceeded", message: LIMIT_EXCEEDED_MESSAGE };
  }
  if (status === 429) return { kind: "pin-locked", message };
  if (text.includes("invalid transaction pin")) {
    return { kind: "wrong-pin", message };
  }
  // The axios interceptor maps timeouts to 408 and network failures to 503.
  if (status === 408 || (status ?? 0) >= 500) {
    return { kind: "unknown-outcome", message };
  }
  return { kind: "other", message };
};
