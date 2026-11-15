import { describe, expect, it } from "vitest";
import {
  addressesMatch,
  assetsFromActiveNetworks,
  canSendTo,
  classifyTrustedWalletError,
  formatAddedDate,
  formatUnlockTime,
  isCompleteCode,
  isCompletePin,
  labelError,
  networkName,
  nextUnlockDelay,
  parseTrustedWalletList,
  readApiError,
  sameCurrency,
  shortAddress,
  statusLabel,
  TrustedWallet,
  walletsForCurrency,
  whitelistSummary,
  withdrawalStatusText,
} from "../trusted-wallets";

// The shape AxiosInstance's interceptor rejects with.
const apiError = (
  status: number,
  body: { message?: string; errorGroup?: string; details?: string } = {},
) => ({
  success: false,
  status,
  message: body.message ?? "msg",
  raw: { response: { status, data: { data: null, ...body } } },
});

const wallet = (over: Partial<TrustedWallet> = {}): TrustedWallet => ({
  id: "w1",
  currency: "USDT",
  network: "TRX",
  address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  memo: null,
  label: "Ledger Nano",
  status: "ACTIVE",
  unlocksAt: "2026-11-05T14:20:00.000Z",
  createdAt: "2026-11-04T14:20:00.000Z",
  ...over,
});

describe("networkName", () => {
  const supported = {
    assets: [{ currency: "USDT", networks: [{ code: "TRX", name: "Tron (TRC20)" }] }],
    coolingOffHours: 24,
    labelMaxLength: 24,
    maxWalletsPerNetwork: 10,
  };
  it("prefers the supported call's label", () => {
    expect(networkName("TRX", { ...supported, assets: [{ currency: "USDT", networks: [{ code: "TRX", name: "Tron!" }] }] })).toBe("Tron!");
  });
  it("falls back to the guide's table, then the code", () => {
    expect(networkName("BSC")).toBe("BSC (BEP20)");
    expect(networkName("XYZ")).toBe("XYZ");
    expect(networkName(null)).toBe("");
  });
});

describe("PIN and code completeness", () => {
  it("needs exactly 4 and 6 digits", () => {
    expect(isCompletePin("1234")).toBe(true);
    expect(isCompletePin("123")).toBe(false);
    expect(isCompletePin("12a4")).toBe(false);
    expect(isCompleteCode("123456")).toBe(true);
    expect(isCompleteCode("12345")).toBe(false);
    expect(isCompleteCode("1234567")).toBe(false);
  });
});

describe("labelError", () => {
  it("enforces 1 to max characters after trimming", () => {
    expect(labelError("   ")).toMatch(/name/);
    expect(labelError("Ledger")).toBeNull();
    expect(labelError("x".repeat(24))).toBeNull();
    expect(labelError("x".repeat(25))).toMatch(/24/);
    expect(labelError("x".repeat(11), 10)).toMatch(/10/);
  });
});

describe("addressesMatch", () => {
  it("is exact after trimming and rejects empty", () => {
    expect(addressesMatch(" abc ", "abc")).toBe(true);
    expect(addressesMatch("abc", "abd")).toBe(false);
    expect(addressesMatch("0xAbC", "0xabc")).toBe(false);
    expect(addressesMatch("", "")).toBe(false);
  });
});

describe("shortAddress", () => {
  it("keeps both ends", () => {
    expect(shortAddress("TXk4mV9bR2fWq7LdZ3sNp8YcHjA6uE1xGo")).toBe("TXk4mV…1xGo");
    expect(shortAddress("short")).toBe("short");
  });
});

describe("cooling-off and send rules", () => {
  it("only ACTIVE wallets can be sent to, whatever the device clock says", () => {
    expect(canSendTo(wallet())).toBe(true);
    expect(canSendTo(wallet({ status: "COOLING_OFF", unlocksAt: "2000-01-01T00:00:00Z" }))).toBe(false);
    expect(canSendTo(wallet({ status: "SUSPENDED" }))).toBe(false);
  });

  it("schedules a refetch just after the soonest unlock", () => {
    const now = Date.parse("2026-11-04T14:00:00Z");
    const wallets = [
      wallet({ status: "COOLING_OFF", unlocksAt: "2026-11-04T15:00:00Z" }),
      wallet({ status: "COOLING_OFF", unlocksAt: "2026-11-04T14:30:00Z" }),
      wallet({ status: "ACTIVE", unlocksAt: "2026-11-04T14:01:00Z" }),
    ];
    expect(nextUnlockDelay(wallets, now, 0)).toBe(30 * 60_000);
    expect(nextUnlockDelay(wallets, now)).toBe(30 * 60_000 + 2_000);
  });

  it("refetches promptly when an unlock is already past, and not at all with none cooling", () => {
    const now = Date.parse("2026-11-06T00:00:00Z");
    expect(nextUnlockDelay([wallet({ status: "COOLING_OFF" })], now, 0)).toBe(0);
    expect(nextUnlockDelay([wallet()], now)).toBeNull();
    expect(nextUnlockDelay([wallet({ status: "COOLING_OFF", unlocksAt: "nope" })], now)).toBeNull();
  });

  it("stays inside setTimeout's 32-bit range", () => {
    const delay = nextUnlockDelay([wallet({ status: "COOLING_OFF", unlocksAt: "2099-01-01T00:00:00Z" })], 0);
    expect(delay).toBeLessThan(2 ** 31);
  });
});

describe("time formatting", () => {
  it("formats in the requested timezone", () => {
    expect(formatUnlockTime("2026-11-05T14:20:00.000Z", { timeZone: "UTC" })).toBe("5 Nov 2026, 14:20");
    expect(formatUnlockTime("2026-11-05T14:20:00.000Z", { timeZone: "Africa/Lagos" })).toBe("5 Nov 2026, 15:20");
    expect(formatUnlockTime("2026-11-05T14:20:00.000Z", { withYear: false, timeZone: "UTC" })).toBe("5 Nov, 14:20");
    expect(formatAddedDate("2026-10-12T10:00:00Z", "UTC")).toBe("12 Oct 2026");
  });
  it("degrades instead of printing Invalid Date", () => {
    expect(formatUnlockTime("")).toBe("");
    expect(formatUnlockTime("garbage")).toBe("garbage");
  });
});

describe("labels and summaries", () => {
  it("names statuses", () => {
    expect(statusLabel("ACTIVE")).toBe("Active");
    expect(statusLabel("COOLING_OFF")).toBe("Cooling off");
    expect(statusLabel("PENDING_VERIFICATION")).toBe("Pending verification");
  });
  it("summarises the whitelist", () => {
    expect(whitelistSummary([])).toBe("0 crypto wallets");
    expect(whitelistSummary([wallet()])).toBe("1 crypto wallet: 1 active.");
    expect(
      whitelistSummary([wallet(), wallet(), wallet({ status: "COOLING_OFF" }), wallet({ status: "SUSPENDED" })]),
    ).toBe("4 crypto wallets: 2 active, 1 cooling off, 1 suspended.");
  });
  it("filters to the asset and puts usable wallets first", () => {
    const list = [
      wallet({ id: "a", status: "COOLING_OFF", createdAt: "2026-11-05T00:00:00Z" }),
      wallet({ id: "b", createdAt: "2026-11-01T00:00:00Z" }),
      wallet({ id: "c", createdAt: "2026-11-03T00:00:00Z" }),
      wallet({ id: "d", currency: "BTC", network: "BTC" }),
    ];
    expect(walletsForCurrency(list, "USDT").map((w) => w.id)).toEqual(["c", "b", "a"]);
    expect(walletsForCurrency(list, null)).toEqual([]);
  });
  // Regression: the balance list and the trusted-wallet record can spell the
  // coin differently; an exact match hid a saved wallet behind "Add a wallet".
  it("matches the coin whatever its case or padding", () => {
    const list = [wallet({ id: "a", currency: "usdt" }), wallet({ id: "b", currency: " USDT " })];
    expect(walletsForCurrency(list, "USDT").map((w) => w.id)).toEqual(["a", "b"]);
    expect(walletsForCurrency(list, "Usdt")).toHaveLength(2);
    expect(walletsForCurrency(list, "")).toEqual([]);
    expect(sameCurrency("", "")).toBe(false);
  });
});

describe("parseTrustedWalletList", () => {
  it("passes an array through", () => {
    const list = [wallet()];
    expect(parseTrustedWalletList(list)).toBe(list);
    expect(parseTrustedWalletList([])).toEqual([]);
  });
  // Regression: before backend #38 the wallet-by-id route answered the list
  // path with 200 and no array; reading that as [] showed "Add a wallet".
  it.each([null, undefined, {}, { id: "w1" }, "x", 0])("refuses %j instead of reading it as empty", (raw) => {
    expect(() => parseTrustedWalletList(raw)).toThrow(/couldn't load your saved wallets/);
  });
});

describe("error routing (guide: Errors the app should handle)", () => {
  it("recovers errorGroup and details the interceptor drops", () => {
    expect(readApiError(apiError(400, { errorGroup: "WALLET_COOLING_OFF", details: "2026-11-05T14:20:00.000Z" }))).toMatchObject({
      status: 400,
      errorGroup: "WALLET_COOLING_OFF",
      details: "2026-11-05T14:20:00.000Z",
    });
    expect(readApiError(undefined)).toMatchObject({ status: 0, errorGroup: "" });
  });

  it.each([
    [apiError(403, { errorGroup: "TWO_FACTOR_REQUIRED" }), "setup-2fa"],
    [apiError(400, { errorGroup: "PIN_REQUIRED" }), "setup-pin"],
    [apiError(400, { errorGroup: "WALLET_COOLING_OFF", details: "x" }), "cooling-off"],
    [apiError(400, { errorGroup: "TRUSTED_WALLET_REQUIRED" }), "pick-saved-wallet"],
    [apiError(429), "locked"],
    [apiError(404), "refetch"],
    [apiError(403), "inline"],
    [apiError(409), "inline"],
    [apiError(400), "inline"],
  ])("%#: routes to %s", (err, kind) => {
    expect(classifyTrustedWalletError(err).kind).toBe(kind);
  });

  it("keeps the customer-facing message", () => {
    expect(classifyTrustedWalletError(apiError(409, { message: "Already saved" })).message).toBe("Already saved");
  });
});

describe("withdrawalStatusText", () => {
  it("never calls PENDING completed", () => {
    expect(withdrawalStatusText("PENDING")).toEqual({ title: "Processing", done: false });
    expect(withdrawalStatusText(undefined).title).toBe("Processing");
    expect(withdrawalStatusText("COMPLETED")).toEqual({ title: "Sent", done: true });
    expect(withdrawalStatusText("failed").title).toBe("Failed");
  });
});

describe("assetsFromActiveNetworks", () => {
  it("keeps CRYPTO and STABLE coins with their networks, in response order", () => {
    expect(
      assetsFromActiveNetworks({
        USDT: {
          currencyName: "Tether",
          currencyType: "STABLE",
          networks: [{ networkCode: "TRX", networkName: "Tron (TRC20)" }],
        },
        NGN: { currencyName: "Naira", currencyType: "FIAT", networks: [] },
        BTC: { currencyName: "Bitcoin", currencyType: "CRYPTO", networks: [] },
      }),
    ).toEqual([
      { currency: "USDT", currencyName: "Tether", networks: [{ code: "TRX", name: "Tron (TRC20)" }] },
      { currency: "BTC", currencyName: "Bitcoin", networks: [] },
    ]);
  });

  it("falls back to known names, skips networks without a code, and tolerates junk", () => {
    expect(
      assetsFromActiveNetworks({
        USDT: {
          currencyType: "STABLE",
          networks: [{ networkCode: "TRX" }, { networkName: "No code" }, null],
        },
        BAD: null,
        ODD: { currencyType: "CRYPTO", networks: "nope" },
      }),
    ).toEqual([
      { currency: "USDT", currencyName: "USDT", networks: [{ code: "TRX", name: networkName("TRX") }] },
      { currency: "ODD", currencyName: "ODD", networks: [] },
    ]);
    expect(assetsFromActiveNetworks(undefined)).toEqual([]);
    expect(assetsFromActiveNetworks("x")).toEqual([]);
  });
});
