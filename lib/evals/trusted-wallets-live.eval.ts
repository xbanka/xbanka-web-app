import { describe, expect, it } from "vitest";

// Live contract eval for trusted wallets (backend PRs #35-#39).
//
// The gate tests pin lib/trusted-wallets.ts to the integration guide. This
// checks the deployed backend still matches it, and in particular whether the
// two fixes the guide calls out are live:
//   #38: GET /wallets/trusted-wallets returns the list (it was answered by the
//        wallet-by-id route, so the list never loaded).
//   #39: networks use Obiex codes (TRX, ETH, BSC, ...).
//
// Pass threshold: every case. Read-only: validate-address saves nothing and
// spends no PIN attempt; nothing is added, removed or sent.
//
// Required:
//   XBANKA_EVAL_API_URL        staging/preprod API base URL. Deliberately not
//                              read from NEXT_PUBLIC_API_URL, which may be prod.
//   XBANKA_EVAL_ACCESS_TOKEN   JWT of any test user

const env = process.env;
const API_URL = env.XBANKA_EVAL_API_URL?.replace(/\/$/, "");
const TOKEN = env.XBANKA_EVAL_ACCESS_TOKEN;
const configured = Boolean(API_URL && TOKEN);

// An eval that could not run is not a pass, so missing config fails loudly.
it.runIf(!configured)("is configured", () => {
  throw new Error("Set XBANKA_EVAL_API_URL and XBANKA_EVAL_ACCESS_TOKEN.");
});

const OBIEX_CODES = ["BTC", "ETH", "BSC", "MATIC", "TRX", "SOL"];
// A well-formed Tron address (the USDT-TRC20 contract), from the guide.
const TRON_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

const call = async (method: string, path: string, body?: unknown) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
      "x-device-id": "trusted-wallets-eval",
      "x-device-name": "eval",
      "x-device-type": "desktop",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

describe.runIf(configured)("trusted wallets backend contract", () => {
  it("GET /supported: assets with Obiex network codes and labels (#39)", async () => {
    const { status, json } = await call("GET", "/wallets/trusted-wallets/supported");
    expect(status).toBe(200);
    const data = json.data;
    expect(Array.isArray(data.assets)).toBe(true);
    expect(data.assets.length).toBeGreaterThan(0);
    for (const asset of data.assets) {
      expect(typeof asset.currency).toBe("string");
      for (const n of asset.networks) {
        expect(OBIEX_CODES).toContain(n.code);
        expect(typeof n.name).toBe("string");
      }
    }
    expect(data.labelMaxLength).toBeGreaterThan(0);
    expect(data.coolingOffHours).toBeGreaterThan(0);
  });

  it("GET /trusted-wallets: returns the list, not a wallet-by-id answer (#38)", async () => {
    const { status, json } = await call("GET", "/wallets/trusted-wallets");
    expect(status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    for (const w of json.data) {
      expect(w).toMatchObject({ id: expect.any(String), label: expect.any(String), unlocksAt: expect.any(String) });
      expect(["ACTIVE", "COOLING_OFF"]).toContain(w.status);
    }
  });

  it("POST /validate-address: accepts a Tron address and explains a bad one", async () => {
    const ok = await call("POST", "/wallets/trusted-wallets/validate-address", {
      currency: "USDT",
      network: "TRX",
      address: TRON_ADDRESS,
    });
    expect(ok.status).toBe(200);
    expect(ok.json.data).toMatchObject({ valid: true, network: "TRX" });

    const bad = await call("POST", "/wallets/trusted-wallets/validate-address", {
      currency: "USDT",
      network: "TRX",
      address: "0x3f5C1a9d2B7e4a80c6D91bE5F0a2c8d7E4b69a21",
    });
    expect(bad.status).toBe(200);
    expect(bad.json.data.valid).toBe(false);
    expect(bad.json.data.reason).toEqual(expect.any(String));
  });

  it("POST /validate-address: still accepts the legacy alias TRC20 and answers with the code", async () => {
    const { status, json } = await call("POST", "/wallets/trusted-wallets/validate-address", {
      currency: "USDT",
      network: "TRC20",
      address: TRON_ADDRESS,
    });
    expect(status).toBe(200);
    expect(json.data.network).toBe("TRX");
  });
});
