import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { classifyWithdrawalError, WithdrawalErrorKind } from "@/lib/nomba-withdrawal";

// Pins the classifier to the backend's documented errors. If the backend team
// adds, removes or rewords a row in CONTRACT.md, this fails until EXPECTED
// (and, if needed, errors.ts) is updated to match.
const EXPECTED: Record<string, WithdrawalErrorKind> = {
  "Insufficient NGN balance": "other",
  "Could not verify bank account": "other",
  "Invalid amount": "other",
  "Withdrawal request expired": "expired",
  "Invalid withdrawal token": "expired",
  "Transaction PIN not set": "pin-setup-required",
  "Invalid transaction PIN": "wrong-pin",
  "Withdrawal blocked: TIER_REQUIRED": "tier-required",
  "Withdrawal blocked: PIN_SETUP_REQUIRED": "pin-setup-required",
  "Withdrawal blocked: LIMIT_EXCEEDED": "limit-exceeded",
  "Withdrawal not found": "other",
  "Too many incorrect PIN attempts": "pin-locked",
};

interface ContractRow {
  status: number;
  message: string;
}

/** Rows of the "## Errors" table that carry a backticked message. */
const readErrorRows = (): ContractRow[] => {
  const doc = readFileSync(
    fileURLToPath(new URL("../CONTRACT.md", import.meta.url)),
    "utf8",
  );
  const section = doc.split(/^## Errors\s*$/m)[1]?.split(/^## /m)[0] ?? "";
  return section
    .split("\n")
    .map((line) => line.match(/^\|\s*(\d{3})\s*\|\s*`([^`]+)`/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map(([, status, message]) => ({
      status: Number(status),
      message: message.replace(/\.{3}$/, "").trim(),
    }));
};

describe("CONTRACT.md errors table", () => {
  const rows = readErrorRows();

  it("parses the table", () => {
    expect(rows.length).toBeGreaterThanOrEqual(Object.keys(EXPECTED).length);
  });

  it("has a classification for every documented error", () => {
    const unclassified = rows.map((r) => r.message).filter((m) => !(m in EXPECTED));
    expect(unclassified).toEqual([]);
  });

  it("still documents every error the classifier depends on", () => {
    const documented = new Set(rows.map((r) => r.message));
    expect(Object.keys(EXPECTED).filter((m) => !documented.has(m))).toEqual([]);
  });

  it.each(rows)("$status $message", ({ status, message }) => {
    // The backend may append detail after the documented prefix ("...").
    const kind = classifyWithdrawalError({ status, message: `${message}. Detail` }).kind;
    expect(kind).toBe(EXPECTED[message]);
  });
});
