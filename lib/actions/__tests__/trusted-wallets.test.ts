import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
vi.mock("../../AxiosInstance/AxiosInstance", () => ({
  default: { get: (...args: unknown[]) => get(...args) },
}));

import { getTrustedWallets } from "../trusted-wallets";

describe("getTrustedWallets", () => {
  beforeEach(() => get.mockReset());

  it("returns the list from the envelope", async () => {
    const list = [{ id: "w1", currency: "USDT" }];
    get.mockResolvedValue({ data: { message: "ok", data: list } });
    await expect(getTrustedWallets()).resolves.toEqual(list);
    expect(get).toHaveBeenCalledWith("/wallets/trusted-wallets", { params: undefined });
  });

  // Regression: a 200 with no list (the wallet-by-id route answering, before
  // backend #38) used to resolve to [], so the Send screen said "Add a wallet"
  // to a customer who already had one. It must reject so the screen shows an
  // error and a retry.
  it.each([
    { data: { data: null } },
    { data: { data: { id: "w1", currency: "USDT" } } },
    { data: {} },
    {},
  ])("rejects a 200 without a list: %j", async (response) => {
    get.mockResolvedValue(response);
    await expect(getTrustedWallets()).rejects.toThrow(/couldn't load your saved wallets/);
  });
});
