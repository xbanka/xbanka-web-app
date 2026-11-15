import { describe, expect, it } from "vitest";
import {
  addressesMatch,
  assetsFromActiveNetworks,
  canSendTo,
  classifyTrustedWalletError,
  isCompleteCode,
  isCompletePin,
  labelError,
  nextUnlockDelay,
  parseTrustedWalletList,
  TrustedWallet,
  walletsForCurrency,
  withdrawalStatusText,
} from "../trusted-wallets";

// Spec: "Trusted wallets: frontend integration guide", Errors and Rules tables.
// Sweeps the rules across every combination instead of a few examples, so a
// change that quietly breaks one row of the guide fails here.

const ERROR_TABLE: { status: number; errorGroup: string; kind: string }[] = [
  { status: 403, errorGroup: "TWO_FACTOR_REQUIRED", kind: "setup-2fa" },
  { status: 400, errorGroup: "PIN_REQUIRED", kind: "setup-pin" },
  { status: 403, errorGroup: "", kind: "inline" },
  { status: 429, errorGroup: "", kind: "locked" },
  { status: 400, errorGroup: "WALLET_COOLING_OFF", kind: "cooling-off" },
  { status: 400, errorGroup: "TRUSTED_WALLET_REQUIRED", kind: "pick-saved-wallet" },
  { status: 409, errorGroup: "", kind: "inline" },
  { status: 400, errorGroup: "", kind: "inline" },
  { status: 404, errorGroup: "", kind: "refetch" },
];

describe("error routing matches every row of the guide's table", () => {
  it("routes each row, with or without a message, and keeps the message", () => {
    let cases = 0;
    for (const row of ERROR_TABLE) {
      for (const message of ["", "Shown as is"]) {
        const err = {
          status: row.status,
          message,
          raw: { response: { status: row.status, data: { errorGroup: row.errorGroup, details: "2026-11-05T14:20:00.000Z" } } },
        };
        const action = classifyTrustedWalletError(err);
        expect(action.kind).toBe(row.kind);
        if (message) expect(action.message).toBe(message);
        if (action.kind === "cooling-off") expect(action.unlocksAt).toBe("2026-11-05T14:20:00.000Z");
        cases++;
      }
    }
    expect(cases).toBe(ERROR_TABLE.length * 2);
  });
});

describe("digits: the button never sends an incomplete code", () => {
  it("accepts only exactly 4 / 6 digits across lengths 0-8 and junk characters", () => {
    for (let n = 0; n <= 8; n++) {
      for (const fill of ["1", "a", " ", "٣"]) {
        const v = fill.repeat(n);
        expect(isCompletePin(v)).toBe(n === 4 && fill === "1");
        expect(isCompleteCode(v)).toBe(n === 6 && fill === "1");
      }
    }
  });
});

describe("label: 1 to labelMaxLength characters", () => {
  it("holds at every length for several limits", () => {
    for (const max of [1, 10, 24, 40]) {
      for (let n = 0; n <= max + 2; n++) {
        expect(labelError("a".repeat(n), max) === null).toBe(n >= 1 && n <= max);
        expect(labelError(`  ${"a".repeat(n)}  `, max) === null).toBe(n >= 1 && n <= max);
      }
    }
  });
});

describe("address confirmation", () => {
  it("never accepts a one-character difference anywhere in the address", () => {
    const addr = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    for (let i = 0; i < addr.length; i++) {
      const swapped = addr.slice(0, i) + (addr[i] === "x" ? "y" : "x") + addr.slice(i + 1);
      expect(addressesMatch(addr, swapped)).toBe(false);
    }
    expect(addressesMatch(addr, `\t${addr}\n`)).toBe(true);
  });
});

describe("cooling-off: the device clock never unlocks a wallet", () => {
  it("only ACTIVE is sendable, whatever unlocksAt says", () => {
    for (const status of ["ACTIVE", "COOLING_OFF", "SUSPENDED", "PENDING_VERIFICATION", ""]) {
      for (const unlocksAt of ["2000-01-01T00:00:00Z", "2999-01-01T00:00:00Z"]) {
        expect(canSendTo({ status })).toBe(status === "ACTIVE");
        expect(nextUnlockDelay([{ status, unlocksAt }], Date.parse("2026-11-06T00:00:00Z")) !== null).toBe(
          status === "COOLING_OFF",
        );
      }
    }
  });
});

describe("withdrawal status: PENDING never reads as completed", () => {
  it("only COMPLETED is done, in any letter case", () => {
    for (const s of ["PENDING", "pending", "COMPLETED", "completed", "FAILED", "PROCESSING", "", null, undefined]) {
      expect(withdrawalStatusText(s).done).toBe((s ?? "").toUpperCase() === "COMPLETED");
    }
  });
});

describe("add-wallet coin list mirrors the deposit active-networks list", () => {
  it("offers exactly the CRYPTO and STABLE coins, each with every coded network", () => {
    const types = ["CRYPTO", "STABLE", "FIAT", "crypto", "", undefined];
    const raw: Record<string, unknown> = {};
    types.forEach((currencyType, i) => {
      raw[`C${i}`] = {
        currencyType,
        currencyName: `Coin ${i}`,
        networks: [
          { networkCode: `N${i}a`, networkName: `Net ${i}a` },
          { networkCode: "", networkName: "blank" },
          { networkCode: `N${i}b` },
        ],
      };
    });
    const assets = assetsFromActiveNetworks(raw);
    expect(assets.map((a) => a.currency)).toEqual(["C0", "C1"]);
    for (const a of assets) {
      expect(a.networks.map((n) => n.code)).toEqual([`${a.currency.replace("C", "N")}a`, `${a.currency.replace("C", "N")}b`]);
      expect(a.networks.every((n) => n.name.length > 0)).toBe(true);
    }
  });
});

describe("Send screen never hides a saved wallet behind 'Add a wallet'", () => {
  const COINS = ["USDT", "BTC", "ETH", "BNB", "SOL", "TRX", "USDC"];
  const spellings = (c: string) => [c, c.toLowerCase(), ` ${c} `, c[0] + c.slice(1).toLowerCase()];
  const w = (id: string, currency: string): TrustedWallet => ({
    id, currency, network: "TRX", address: "addr", memo: null, label: id,
    status: "ACTIVE", unlocksAt: "2026-11-01T00:00:00Z", createdAt: "2026-11-01T00:00:00Z",
  });

  it("every picked coin lists exactly its saved wallets, whatever the spelling", () => {
    // Every subset of saved coins x every coin picked x every spelling.
    for (let mask = 0; mask < 1 << COINS.length; mask++) {
      const savedCoins = COINS.filter((_, i) => mask & (1 << i));
      for (const spell of [0, 1, 2, 3]) {
        const list = savedCoins.map((c, i) => w(`w${i}`, spellings(c)[spell]));
        for (const picked of COINS) {
          for (const pickedSpelling of spellings(picked)) {
            const shown = walletsForCurrency(list, pickedSpelling);
            expect(shown.length).toBe(savedCoins.includes(picked) ? 1 : 0);
          }
        }
      }
    }
  });

  it("only an array is ever read as the wallet list", () => {
    for (const raw of [null, undefined, {}, { data: [] }, { id: "x" }, "[]", 0, false]) {
      expect(() => parseTrustedWalletList(raw)).toThrow();
    }
    expect(parseTrustedWalletList([])).toEqual([]);
  });
});
