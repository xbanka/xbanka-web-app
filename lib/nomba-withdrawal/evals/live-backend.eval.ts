import { describe, expect, it } from "vitest";
import { classifyWithdrawalError, WITHDRAWAL_TOKEN_TTL_MS } from "@/lib/nomba-withdrawal";

// Live contract eval against a real (staging) backend.
//
// The gate tests pin the classifier to CONTRACT.md. This checks that the
// backend still behaves the way CONTRACT.md says: same status codes, same
// envelope, same error wording. If the backend rewords an error the
// classifier keys on, this is where it shows up.
//
// Pass threshold: every case. Each one is a contract the UI depends on.
//
// Safe by construction: it only calls initiate (no money moves) and status.
// It never calls confirm, so it can't pay out or count toward the PIN lockout.
//
// Required:
//   XBANKA_EVAL_API_URL        staging API base URL. Deliberately not read
//                              from NEXT_PUBLIC_API_URL, which may be prod.
//   XBANKA_EVAL_ACCESS_TOKEN   JWT of a test user with BVN-verified KYC
// Optional (enables the happy-path case):
//   XBANKA_EVAL_BANK_CODE      bank code of a real account
//   XBANKA_EVAL_ACCOUNT_NUMBER that account's 10-digit number

const env = process.env;
const API_URL = env.XBANKA_EVAL_API_URL?.replace(/\/$/, "");
const TOKEN = env.XBANKA_EVAL_ACCESS_TOKEN;
const BANK_CODE = env.XBANKA_EVAL_BANK_CODE;
const ACCOUNT_NUMBER = env.XBANKA_EVAL_ACCOUNT_NUMBER;
const configured = Boolean(API_URL && TOKEN);

// An eval that could not run is not a pass, so missing config fails loudly.
it.runIf(!configured)("is configured", () => {
  throw new Error(
    "Set XBANKA_EVAL_API_URL and XBANKA_EVAL_ACCESS_TOKEN " +
      "(see lib/nomba-withdrawal/README.md).",
  );
});

interface Envelope {
  message?: string;
  data?: Record<string, unknown> | null;
}

/** Calls the API and returns the error in the shape the axios interceptor produces. */
const call = async (method: "GET" | "POST", path: string, body?: unknown) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "x-device-id": "nomba-withdrawal-eval",
      "x-device-name": "eval",
      "x-device-type": "desktop",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as Envelope;
  return {
    status: res.status,
    json,
    error: { success: false, status: res.status, message: json.message ?? "" },
  };
};

const initiate = (overrides: Record<string, unknown>) =>
  call("POST", "/wallets/withdraw/nomba/initiate", {
    bankCode: BANK_CODE ?? "058",
    accountNumber: ACCOUNT_NUMBER ?? "0123456789",
    amount: 5_000,
    ...overrides,
  });

/** A TIER_REQUIRED answer means the eval user is misconfigured, not a contract break. */
const assertEvalUserIsVerified = (message: string) => {
  if (/tier_required/i.test(message)) {
    throw new Error("XBANKA_EVAL_ACCESS_TOKEN user lacks BVN-verified KYC; fix the test user.");
  }
};

describe.skipIf(!configured)("nomba withdrawal: live backend contract", () => {
  it("rejects an unverifiable account with a 400 the UI shows inline", async () => {
    const { status, json, error } = await initiate({ accountNumber: "0000000000" });
    assertEvalUserIsVerified(json.message ?? "");
    expect(status).toBe(400);
    expect(json.message).toBeTruthy();
    expect(json.data ?? null).toBeNull();
    expect(classifyWithdrawalError(error).kind).toBe("other");
  });

  it("rejects an amount under the minimum as a 400", async () => {
    const { status, json, error } = await initiate({ amount: 50 });
    assertEvalUserIsVerified(json.message ?? "");
    expect(status).toBe(400);
    expect(classifyWithdrawalError(error).kind).toBe("other");
  });

  it("rejects narration over 100 characters as a 400", async () => {
    const { status, json } = await initiate({ narration: "x".repeat(101) });
    assertEvalUserIsVerified(json.message ?? "");
    expect(status).toBe(400);
  });

  it("returns 404 for a reference the user doesn't own", async () => {
    const { status, error } = await call(
      "GET",
      "/wallets/withdraw/nomba/status/NWD-00000000-0000-0000-0000-000000000000",
    );
    expect(status).toBe(404);
    expect(classifyWithdrawalError(error).kind).toBe("other");
  });

  it.skipIf(!BANK_CODE || !ACCOUNT_NUMBER)(
    "initiate returns a usable 10-minute token and the account name",
    async () => {
      const startedAt = Date.now();
      const { status, json } = await initiate({ amount: 100, narration: "eval" });
      assertEvalUserIsVerified(json.message ?? "");
      expect(status).toBe(201);
      const data = json.data as Record<string, unknown>;
      expect(data).toMatchObject({
        withdrawalToken: expect.any(String),
        accountName: expect.stringMatching(/\S/),
        accountNumber: ACCOUNT_NUMBER,
        bankCode: BANK_CODE,
        amount: 100,
        currency: "NGN",
      });
      // The client measures expiry with WITHDRAWAL_TOKEN_TTL_MS, so the
      // server's real TTL must match it. Allow a minute for clock skew.
      const ttlMs = Date.parse(data.expiresAt as string) - startedAt;
      expect(Math.abs(ttlMs - WITHDRAWAL_TOKEN_TTL_MS)).toBeLessThan(60_000);
    },
  );
});
