import { describe, expect, it, vi } from "vitest";
import {
  backoffDelay,
  createStaleGuard,
  HEALTHY_CONNECTION_MS,
  openWalletStream,
  patchWalletCache,
  streamUrl,
  toBalanceMap,
  WalletStreamStatus,
} from "@/lib/walletStream";

// Same envelope the fiat, crypto and all-wallets queries cache.
type TestWallet = {
  id: string;
  currency: string;
  type: string;
  balance: number;
  usdEquivalent?: { amount: number; currency: string; rate: number };
  fiatEquivalent?: { amount: number; currency: string; rate: number };
};

const cache = (wallets: TestWallet[]) => ({
  success: true,
  status: 200,
  data: { message: "ok", data: wallets },
});

const ngn = (balance: number) => ({
  id: "w-ngn",
  currency: "NGN",
  type: "FIAT",
  balance,
  usdEquivalent: { amount: balance / 1500, currency: "USD", rate: 1500 },
});

const usdt = (balance: number) => ({
  id: "w-usdt",
  currency: "USDT",
  type: "CRYPTO",
  balance,
  fiatEquivalent: { amount: balance * 1500, currency: "NGN", rate: 1500 },
});

describe("patchWalletCache", () => {
  it("updates the matching currency and keeps every other field", () => {
    const before = cache([ngn(1000), usdt(2)]);
    const after = patchWalletCache(before, new Map([["NGN", 4000]]));

    expect(after.data.data[0]).toMatchObject({ id: "w-ngn", balance: 4000 });
    expect(after.data.data[1]).toBe(before.data.data[1]);
    expect(after.data.message).toBe("ok");
    expect(after.status).toBe(200);
    // The original cache object is never mutated.
    expect(before.data.data[0].balance).toBe(1000);
  });

  it("rescales naira and dollar equivalents with the balance", () => {
    const after = patchWalletCache(
      cache([ngn(1500), usdt(2)]),
      new Map([
        ["NGN", 3000],
        ["USDT", 5],
      ]),
    );

    expect(after.data.data[0].usdEquivalent!.amount).toBeCloseTo(2);
    expect(after.data.data[1].fiatEquivalent!.amount).toBeCloseTo(7500);
  });

  it("zeroes the equivalent when the balance drops to zero", () => {
    const after = patchWalletCache(cache([usdt(2)]), new Map([["USDT", 0]]));
    expect(after.data.data[0].fiatEquivalent!.amount).toBe(0);
  });

  it("leaves the equivalent for the refetch when coming from zero", () => {
    const after = patchWalletCache(cache([usdt(0)]), new Map([["USDT", 3]]));
    expect(after.data.data[0].balance).toBe(3);
    expect(after.data.data[0].fiatEquivalent!.amount).toBe(0);
  });

  it("returns the same object when nothing changed", () => {
    const before = cache([ngn(1000)]);
    expect(patchWalletCache(before, new Map([["NGN", 1000]]))).toBe(before);
    // A wallet the cache does not list is ignored (guide: snapshot can
    // include wallets GET /wallets does not return).
    expect(patchWalletCache(before, new Map([["BTC", 1]]))).toBe(before);
    expect(patchWalletCache(before, new Map())).toBe(before);
  });

  it("matches currency case-insensitively", () => {
    const after = patchWalletCache(
      cache([{ ...ngn(1), currency: "ngn" }]),
      toBalanceMap([{ currency: "NGN", type: "FIAT", balance: 9 }]),
    );
    expect(after.data.data[0].balance).toBe(9);
  });

  it("ignores caches that are empty or not a wallet list", () => {
    const balances = new Map([["NGN", 1]]);
    expect(patchWalletCache(undefined, balances)).toBeUndefined();
    const odd = { data: { data: { not: "a list" } } };
    expect(patchWalletCache(odd, balances)).toBe(odd);
  });
});

describe("toBalanceMap", () => {
  it("drops entries without a currency or a finite balance", () => {
    const map = toBalanceMap([
      { currency: "NGN", type: "FIAT", balance: 5 },
      { currency: "BTC", type: "CRYPTO", balance: NaN },
      { currency: undefined as unknown as string, type: "FIAT", balance: 1 },
    ]);
    expect([...map]).toEqual([["NGN", 5]]);
  });
});

describe("createStaleGuard", () => {
  it("accepts only events newer than the last applied one per currency", () => {
    const guard = createStaleGuard();
    const at = (currency: string, changedAt: string) => ({ currency, changedAt });

    expect(guard.accept(at("NGN", "2026-11-04T14:20:00.000Z"))).toBe(true);
    expect(guard.accept(at("NGN", "2026-11-04T14:19:59.000Z"))).toBe(false);
    expect(guard.accept(at("NGN", "2026-11-04T14:20:00.000Z"))).toBe(false);
    expect(guard.accept(at("ngn", "2026-11-04T14:20:01.000Z"))).toBe(true);
    // Other currencies are tracked separately.
    expect(guard.accept(at("BTC", "2026-11-04T10:00:00.000Z"))).toBe(true);
  });

  it("starts over after a snapshot", () => {
    const guard = createStaleGuard();
    guard.accept({ currency: "NGN", changedAt: "2026-11-04T14:20:00.000Z" });
    guard.reset();
    expect(
      guard.accept({ currency: "NGN", changedAt: "2026-11-04T14:00:00.000Z" }),
    ).toBe(true);
  });
});

describe("backoffDelay / streamUrl", () => {
  it("doubles from 1s and caps at 30s", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 20].map(backoffDelay)).toEqual([
      1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000,
    ]);
  });

  it("joins the base URL and encodes the ticket", () => {
    expect(streamUrl("https://api.x.com/", "a+b/c=")).toBe(
      "https://api.x.com/wallets/stream?ticket=a%2Bb%2Fc%3D",
    );
  });
});

// ---- client lifecycle -------------------------------------------------------

class FakeSource {
  static all: FakeSource[] = [];
  listeners: Record<string, ((e: { data?: unknown }) => void)[]> = {};
  onerror: ((e: unknown) => void) | null = null;
  closed = false;
  constructor(public url: string) {
    FakeSource.all.push(this);
  }
  addEventListener(type: string, fn: (e: { data?: unknown }) => void) {
    (this.listeners[type] ??= []).push(fn);
  }
  emit(type: string, data: unknown) {
    this.listeners[type]?.forEach((fn) => fn({ data: JSON.stringify(data) }));
  }
  emitRaw(type: string, data: string) {
    this.listeners[type]?.forEach((fn) => fn({ data }));
  }
  fail() {
    this.onerror?.({});
  }
  close() {
    this.closed = true;
  }
}

const setup = (fetchTicket = vi.fn()) => {
  FakeSource.all = [];
  let clock = 0;
  const timers: { fn: () => void; ms: number; id: number }[] = [];
  let nextId = 1;
  const statuses: WalletStreamStatus[] = [];
  const onSnapshot = vi.fn();
  const onBalance = vi.fn();
  let n = 0;
  if (!fetchTicket.getMockImplementation()) {
    fetchTicket.mockImplementation(async () => `ticket-${++n}`);
  }
  const stop = openWalletStream({
    baseUrl: "https://api.test",
    fetchTicket,
    createEventSource: (url) => new FakeSource(url),
    onSnapshot,
    onBalance,
    onStatus: (s) => statuses.push(s),
    now: () => clock,
    setTimer: (fn, ms) => {
      const id = nextId++;
      timers.push({ fn, ms, id });
      return id;
    },
    clearTimer: (id) => {
      const i = timers.findIndex((t) => t.id === id);
      if (i >= 0) timers.splice(i, 1);
    },
  });
  const flush = () => new Promise((r) => setTimeout(r, 0));
  const runTimer = async () => {
    const t = timers.shift();
    t?.fn();
    await flush();
    return t?.ms;
  };
  return {
    stop,
    fetchTicket,
    onSnapshot,
    onBalance,
    statuses,
    timers,
    flush,
    runTimer,
    advance: (ms: number) => (clock += ms),
    last: () => FakeSource.all[FakeSource.all.length - 1],
  };
};

const SNAPSHOT = { wallets: [{ currency: "NGN", type: "FIAT", balance: 10 }] };
const BALANCE = {
  currency: "NGN",
  type: "FIAT",
  balance: 25,
  previousBalance: 10,
  changedAt: "2026-11-04T14:20:00.000Z",
};

describe("openWalletStream", () => {
  it("opens the stream with the ticket and hands over snapshot and balance events", async () => {
    const s = setup();
    await s.flush();

    expect(s.last().url).toBe("https://api.test/wallets/stream?ticket=ticket-1");
    s.last().emit("snapshot", SNAPSHOT);
    s.last().emit("ping", {});
    s.last().emit("balance", BALANCE);

    expect(s.onSnapshot).toHaveBeenCalledWith(SNAPSHOT.wallets);
    expect(s.onBalance).toHaveBeenCalledWith(BALANCE);
    expect(s.statuses).toEqual(["connecting", "live"]);
  });

  it("ignores malformed events instead of throwing", async () => {
    const s = setup();
    await s.flush();
    s.last().emitRaw("snapshot", "not json");
    s.last().emit("snapshot", { wallets: "nope" });
    s.last().emit("balance", { currency: "NGN" });
    s.last().emitRaw("balance", "{");

    expect(s.onSnapshot).not.toHaveBeenCalled();
    expect(s.onBalance).not.toHaveBeenCalled();
  });

  it("on error closes the source and reconnects with a NEW ticket", async () => {
    const s = setup();
    await s.flush();
    const first = s.last();
    first.emit("snapshot", SNAPSHOT);
    first.fail();

    expect(first.closed).toBe(true);
    expect(s.statuses.at(-1)).toBe("down");
    expect(await s.runTimer()).toBe(1000);
    expect(s.fetchTicket).toHaveBeenCalledTimes(2);
    expect(s.last()).not.toBe(first);
    expect(s.last().url).toContain("ticket=ticket-2");
  });

  it("backs off on repeated failures and resets after a healthy connection", async () => {
    const s = setup();
    await s.flush();
    const delays: (number | undefined)[] = [];

    // Evicted straight after each snapshot: keeps backing off.
    for (let i = 0; i < 4; i++) {
      s.last().emit("snapshot", SNAPSHOT);
      s.last().fail();
      delays.push(await s.runTimer());
    }
    expect(delays).toEqual([1000, 2000, 4000, 8000]);

    // A connection that stayed up a while starts the backoff over.
    s.last().emit("snapshot", SNAPSHOT);
    s.advance(HEALTHY_CONNECTION_MS);
    s.last().fail();
    expect(await s.runTimer()).toBe(1000);
  });

  it("retries when the ticket request fails", async () => {
    const fetchTicket = vi
      .fn()
      .mockRejectedValueOnce({ status: 503 })
      .mockResolvedValue("t-ok");
    const s = setup(fetchTicket);
    await s.flush();

    expect(FakeSource.all).toHaveLength(0);
    expect(s.statuses).toEqual(["connecting", "down"]);
    await s.runTimer();
    expect(s.last().url).toContain("ticket=t-ok");
  });

  it("gives up on the stream when the backend has no endpoint (404)", async () => {
    const s = setup(vi.fn().mockRejectedValue({ status: 404 }));
    await s.flush();

    expect(s.statuses).toEqual(["connecting", "unsupported"]);
    expect(s.timers).toHaveLength(0);
  });

  it("stop() closes the source and cancels any pending reconnect", async () => {
    const s = setup();
    await s.flush();
    const source = s.last();
    source.fail();
    expect(s.timers).toHaveLength(1);

    s.stop();
    expect(source.closed).toBe(true);
    expect(s.timers).toHaveLength(0);
  });

  it("stop() during the ticket request never opens a source", async () => {
    let resolve!: (t: string) => void;
    const s = setup(vi.fn(() => new Promise<string>((r) => (resolve = r))));
    s.stop();
    resolve("late");
    await s.flush();

    expect(FakeSource.all).toHaveLength(0);
    expect(s.statuses).toEqual(["connecting"]);
  });
});
