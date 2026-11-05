// @vitest-environment happy-dom
import { createElement, ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ticket = vi.hoisted(() => vi.fn());
vi.mock("@/lib/actions/wallet", () => ({ getWalletStreamTicket: ticket }));

import {
  FALLBACK_POLL_MS,
  REFRESH_DEBOUNCE_MS,
  useLiveWalletBalances,
} from "@/hooks/use-live-wallet-balances";

class FakeSource {
  static all: FakeSource[] = [];
  listeners: Record<string, ((e: { data: string }) => void)[]> = {};
  onerror: (() => void) | null = null;
  closed = false;
  constructor(public url: string) {
    FakeSource.all.push(this);
  }
  addEventListener(type: string, fn: (e: { data: string }) => void) {
    (this.listeners[type] ??= []).push(fn);
  }
  emit(type: string, data: unknown) {
    this.listeners[type]?.forEach((fn) => fn({ data: JSON.stringify(data) }));
  }
  close() {
    this.closed = true;
  }
}

const envelope = (wallets: object[]) => ({
  success: true,
  status: 200,
  data: { data: wallets },
});
const NGN = { currency: "NGN", type: "FIAT", balance: 1000 };
const USDT = {
  currency: "USDT",
  type: "CRYPTO",
  balance: 2,
  fiatEquivalent: { amount: 3000, currency: "NGN", rate: 1500 },
};

let client: QueryClient;
let visibility: DocumentVisibilityState;

const mount = () =>
  renderHook(() => useLiveWalletBalances(), {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client }, children),
  });

const flush = () => act(async () => {});
const balanceOf = (key: string, currency: string) =>
  (
    client.getQueryData<{ data: { data: { currency: string; balance: number }[] } }>([key])
      ?.data.data ?? []
  ).find((w) => w.currency === currency)?.balance;

const setVisibility = (state: DocumentVisibilityState) => {
  visibility = state;
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  FakeSource.all = [];
  vi.stubGlobal("EventSource", FakeSource);
  visibility = "visible";
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => visibility,
  });
  localStorage.setItem("accessToken", "token");
  let n = 0;
  ticket.mockReset().mockImplementation(async () => `t${++n}`);

  client = new QueryClient();
  // The three separate caches the fiat tab, crypto tab and home page read.
  client.setQueryData(["all-wallet-balances"], envelope([NGN, USDT]));
  client.setQueryData(["fiat-wallet"], envelope([NGN]));
  client.setQueryData(["crypto-wallet"], envelope([USDT]));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("useLiveWalletBalances", () => {
  it("updates the fiat tab, crypto tab and home caches from one stream", async () => {
    mount();
    await flush();
    const source = FakeSource.all[0];

    act(() =>
      source.emit("balance", {
        currency: "NGN",
        type: "FIAT",
        balance: 1500,
        previousBalance: 1000,
        changedAt: "2026-11-04T14:20:00.000Z",
      }),
    );
    expect(balanceOf("fiat-wallet", "NGN")).toBe(1500);
    expect(balanceOf("all-wallet-balances", "NGN")).toBe(1500);
    expect(balanceOf("crypto-wallet", "NGN")).toBeUndefined();

    act(() =>
      source.emit("balance", {
        currency: "USDT",
        type: "CRYPTO",
        balance: 5,
        previousBalance: 2,
        changedAt: "2026-11-04T14:20:03.000Z",
      }),
    );
    expect(balanceOf("crypto-wallet", "USDT")).toBe(5);
    expect(balanceOf("all-wallet-balances", "USDT")).toBe(5);
    expect(
      client.getQueryData<{ data: { data: typeof USDT[] } }>(["crypto-wallet"])
        ?.data.data[0].fiatEquivalent.amount,
    ).toBe(7500);
  });

  it("drops a balance event older than the one already applied", async () => {
    mount();
    await flush();
    const source = FakeSource.all[0];
    const event = (balance: number, changedAt: string) => ({
      currency: "NGN",
      type: "FIAT",
      balance,
      previousBalance: null,
      changedAt,
    });

    act(() => source.emit("balance", event(2000, "2026-11-04T14:20:05.000Z")));
    act(() => source.emit("balance", event(1200, "2026-11-04T14:20:01.000Z")));
    expect(balanceOf("fiat-wallet", "NGN")).toBe(2000);
  });

  it("lets the snapshot replace balances and ignores unknown wallets", async () => {
    mount();
    await flush();
    act(() =>
      FakeSource.all[0].emit("snapshot", {
        wallets: [
          { currency: "NGN", type: "FIAT", balance: 777 },
          { currency: "DOGE", type: "CRYPTO", balance: 9 },
        ],
      }),
    );
    expect(balanceOf("fiat-wallet", "NGN")).toBe(777);
    expect(balanceOf("all-wallet-balances", "DOGE")).toBeUndefined();
  });

  it("refetches wallets, history and notifications once per burst", async () => {
    const spy = vi.spyOn(client, "invalidateQueries");
    mount();
    await flush();
    const source = FakeSource.all[0];
    for (let i = 1; i <= 3; i++) {
      act(() =>
        source.emit("balance", {
          currency: "NGN",
          type: "FIAT",
          balance: 1000 + i,
          previousBalance: 1000,
          changedAt: `2026-11-04T14:20:0${i}.000Z`,
        }),
      );
    }
    expect(spy).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(REFRESH_DEBOUNCE_MS));
    const keys = spy.mock.calls.map(([f]) => f?.queryKey?.[0]);
    expect(keys.sort()).toEqual([
      "all-wallet-balances",
      "crypto-wallet",
      "fiat-wallet",
      "get-notifications",
      "transaction-history",
    ]);
  });

  it("closes the stream while hidden and reopens with a new ticket", async () => {
    mount();
    await flush();
    const first = FakeSource.all[0];

    act(() => setVisibility("hidden"));
    expect(first.closed).toBe(true);

    act(() => setVisibility("visible"));
    await flush();
    expect(FakeSource.all).toHaveLength(2);
    expect(FakeSource.all[1].url).toContain("ticket=t2");
  });

  it("polls balances while the stream endpoint is missing", async () => {
    ticket.mockRejectedValue({ status: 404 });
    const spy = vi.spyOn(client, "invalidateQueries");
    mount();
    await flush();

    expect(FakeSource.all).toHaveLength(0);
    act(() => vi.advanceTimersByTime(FALLBACK_POLL_MS));
    expect(spy.mock.calls.map(([f]) => f?.queryKey?.[0]).sort()).toEqual([
      "all-wallet-balances",
      "crypto-wallet",
      "fiat-wallet",
    ]);
  });

  it("does nothing without a session and closes on unmount", async () => {
    localStorage.removeItem("accessToken");
    const signedOut = mount();
    await flush();
    expect(ticket).not.toHaveBeenCalled();
    signedOut.unmount();

    localStorage.setItem("accessToken", "token");
    const signedIn = mount();
    await flush();
    signedIn.unmount();
    expect(FakeSource.all[0].closed).toBe(true);
  });
});
