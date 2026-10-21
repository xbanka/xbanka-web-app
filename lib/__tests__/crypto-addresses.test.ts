import { describe, expect, it } from "vitest";
import type { UserWallet } from "@/components/Dashboard/Wallet-Page/types";
import { listFundedCryptoAddresses } from "../crypto-addresses";

const addr = (id: string, network: string, address: string | null) => ({
  id, walletId: "w", provider: "p", providerRef: "r", network,
  createdAt: "", updatedAt: "", accountName: null, address,
  bankCode: null, bankName: null, memo: null,
});
const wallet = (over: Partial<UserWallet>): UserWallet => ({
  id: "w", userId: "u", currency: "USDT", type: "CRYPTO", balance: 10,
  fiatEquivalent: null, createdAt: "", updatedAt: "", addresses: [], ...over,
});

describe("listFundedCryptoAddresses", () => {
  it("returns an empty list for missing or non-array input", () => {
    expect(listFundedCryptoAddresses(undefined)).toEqual([]);
    expect(listFundedCryptoAddresses(null)).toEqual([]);
  });

  it("skips fiat wallets and crypto wallets with no balance", () => {
    const rows = listFundedCryptoAddresses([
      wallet({ type: "FIAT", currency: "NGN", addresses: [addr("1", "n", "AAAAAAAAAAAA")] }),
      wallet({ balance: 0, currency: "BTC", addresses: [addr("2", "n", "BBBBBBBBBBBB")] }),
      wallet({ currency: "ETH", addresses: [addr("3", "ERC20", "CCCCCCCCCCCC")] }),
    ]);
    expect(rows).toEqual([
      { id: "3", currency: "ETH", network: "ERC20", address: "CCCCCCCCCCCC" },
    ]);
  });

  it("gives one row per network and skips null or empty addresses", () => {
    const rows = listFundedCryptoAddresses([
      wallet({
        addresses: [addr("1", "TRC20", "TTTTTTTTTTTT"), addr("2", "ERC20", "EEEEEEEEEEEE"),
          addr("3", "BEP20", null), addr("4", "SOL", "")],
      }),
    ]);
    expect(rows.map((r) => r.network)).toEqual(["TRC20", "ERC20"]);
  });

  it("does not expose the balance", () => {
    const [row] = listFundedCryptoAddresses([
      wallet({ addresses: [addr("1", "TRC20", "TTTTTTTTTTTT")] }),
    ]);
    expect(Object.keys(row)).not.toContain("balance");
  });
});
