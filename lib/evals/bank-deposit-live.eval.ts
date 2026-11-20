import { describe, expect, it } from "vitest";
import { BANK_TRANSFER_INTENT_SOURCE, parseMetadata, toBankDeposit } from "@/lib/bank-deposit";

// Live contract eval for bank transfer deposits.
//
// The app has no endpoint just for deposit intents: it reads them from
// GET /wallet/transactions, told apart by metadata.source. This checks the
// deployed backend still returns them in the shape lib/bank-deposit.ts reads,
// so a backend change cannot silently empty the banner and status screens.
// It also reports whether the two fields the app is waiting on have landed:
//   fundingAccountId  which account the user paid from (else "From" uses this device's memory)
//   declaredAmount    what the user entered (5b "credited a different amount")
//
// Pass threshold: every intent row parses. Read-only: nothing is declared.
//
// Required:
//   XBANKA_EVAL_API_URL        preprod API base URL (never prod)
//   XBANKA_EVAL_ACCESS_TOKEN   JWT of a test user who has declared a deposit

const env = process.env;
const API_URL = env.XBANKA_EVAL_API_URL?.replace(/\/$/, "");
const TOKEN = env.XBANKA_EVAL_ACCESS_TOKEN;
const configured = Boolean(API_URL && TOKEN);

it.runIf(!configured)("is configured", () => {
  throw new Error("Set XBANKA_EVAL_API_URL and XBANKA_EVAL_ACCESS_TOKEN.");
});

describe.runIf(configured)("GET /wallet/transactions: bank deposit intents", () => {
  it("returns intent rows the app can read", async () => {
    const res = await fetch(`${API_URL}/wallet/transactions?page=1&limit=50&category=FIAT`, {
      headers: { Authorization: `Bearer ${TOKEN}`, "x-device-id": "bank-deposit-eval" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    const items: Record<string, unknown>[] = body?.data?.items;
    expect(Array.isArray(items), "data.items is a list").toBe(true);

    const intents = items.filter((tx) => parseMetadata(tx.metadata).source === BANK_TRANSFER_INTENT_SOURCE);
    expect(intents.length, "the test user has at least one declared deposit").toBeGreaterThan(0);

    for (const tx of intents) {
      expect(toBankDeposit(tx), `row ${tx.id} parses`).not.toBeNull();
    }

    const metas = intents.map((tx) => parseMetadata(tx.metadata));
    console.info(
      [
        `intents: ${intents.length}`,
        `statuses: ${[...new Set(intents.map((tx) => tx.status))].join(", ")}`,
        `fundingAccountId recorded: ${metas.some((m) => typeof m.fundingAccountId === "string")}`,
        `declaredAmount recorded: ${metas.some((m) => m.declaredAmount !== undefined)}`,
      ].join("\n"),
    );
  });
});
