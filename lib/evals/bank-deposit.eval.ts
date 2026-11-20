import { describe, expect, it } from "vitest";
import {
  APPROVAL_CLOSE_HOUR,
  APPROVAL_OPEN_HOUR,
  BankDeposit,
  bankDepositsFrom,
  CREDIT_SLA_MINUTES,
  DELAYED_AFTER_MINUTES,
  pendingVariant,
  planResultPopup,
} from "@/lib/bank-deposit";

// Property eval: thousands of seeded deposit lifetimes, replayed through the
// same functions the app uses, checked against a plain model of what the user
// must see.
//
//  1. Results: every deposit this browser saw pending, that later settles, pops
//     up exactly once, and only after it settled. Deposits never seen pending
//     never pop up. Holds with reads at random times, flows that block the
//     pop-up, and deposits pushed off the first page of the history.
//  2. Pending copy: the variant always matches the rule written out longhand
//     (24h → delayed; approvals closed → after hours; > 15 min → taking longer).
//
// Pass threshold: every history. A missed or doubled result screen, or the
// wrong "waiting" message, is a bug.

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const MIN = 60_000;
const T0 = Date.parse("2026-11-19T00:00:00Z");
const PAGE = 20;

type Life = {
  id: string;
  createdAt: number;
  settledAt: number | null;
  outcome: "COMPLETED" | "FAILED";
};

/** The transaction rows GET /wallet/transactions returns at time `t`. */
const rowsAt = (lives: Life[], t: number, otherRows: number) => {
  const visible = lives
    .filter((l) => l.createdAt <= t)
    .map((l) => ({
      id: l.id,
      type: "DEPOSIT",
      status: l.settledAt !== null && l.settledAt <= t ? l.outcome : "PENDING",
      amount: 2000,
      reference: `REF-${l.id}`,
      createdAt: new Date(l.createdAt).toISOString(),
      updatedAt: new Date(l.createdAt).toISOString(),
      metadata: JSON.stringify({ source: "BANK_TRANSFER_INTENT" }),
    }));
  // Other fiat activity shares the page and can push deposits off it.
  const noise = Array.from({ length: otherRows }, (_, i) => ({
    id: `x${i}`,
    type: "TRANSFER_IN",
    status: "COMPLETED",
    amount: 1,
    createdAt: new Date(t - i * MIN).toISOString(),
    metadata: null,
  }));
  return [...visible, ...noise]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, PAGE);
};

describe("bank deposit result pop-ups", () => {
  it("over 3,000 seeded histories", () => {
    for (let seed = 1; seed <= 3_000; seed++) {
      const r = rng(seed);
      const lives: Life[] = Array.from({ length: 1 + Math.floor(r() * 6) }, (_, i) => {
        const createdAt = T0 + Math.floor(r() * 2 * 24 * 60) * MIN;
        const settles = r() < 0.85;
        return {
          id: `d${i}`,
          createdAt,
          settledAt: settles ? createdAt + Math.floor(r() * 26 * 60) * MIN : null,
          outcome: r() < 0.7 ? "COMPLETED" : "FAILED",
        };
      });

      let watched: string[] = [];
      const shownAt = new Map<string, number>();
      const seenPending = new Set<string>();
      const reads = Array.from({ length: 10 + Math.floor(r() * 60) }, () =>
        T0 + Math.floor(r() * 4 * 24 * 60) * MIN,
      ).sort((a, b) => a - b);
      // A final quiet read after everything settled, with nothing on screen.
      reads.push(T0 + 6 * 24 * 60 * MIN);

      for (const [i, t] of reads.entries()) {
        const last = i === reads.length - 1;
        const otherRows = last ? 0 : Math.floor(r() * 25);
        const deposits: BankDeposit[] = bankDepositsFrom(rowsAt(lives, t, otherRows));
        deposits.filter((d) => d.status === "PENDING").forEach((d) => seenPending.add(d.id));
        const busy = !last && r() < 0.3;

        const plan = planResultPopup(watched, deposits, () => !busy);
        watched = plan.watch;
        if (plan.show) {
          const life = lives.find((l) => l.id === plan.show)!;
          const ctx = `seed ${seed}, deposit ${plan.show}`;
          expect(shownAt.has(plan.show), `${ctx}: shown twice`).toBe(false);
          expect(seenPending.has(plan.show), `${ctx}: never seen pending`).toBe(true);
          expect(life.settledAt !== null && life.settledAt <= t, `${ctx}: shown before settling`).toBe(true);
          shownAt.set(plan.show, t);
        }
        // Several may settle at once; the quiet read drains them one per read.
        if (last && watched.some((id) => lives.find((l) => l.id === id)?.settledAt != null)) {
          reads.push(t + MIN);
        }
      }

      for (const life of lives) {
        const due = seenPending.has(life.id) && life.settledAt !== null;
        expect(shownAt.has(life.id), `seed ${seed}, deposit ${life.id}: due ${due}`).toBe(due);
      }
    }
  });
});

describe("pending copy", () => {
  it("matches the written rule over 20,000 seeded instants", () => {
    const r = rng(42);
    for (let i = 0; i < 20_000; i++) {
      const created = T0 + Math.floor(r() * 3 * 24 * 60) * MIN;
      const now = created + Math.floor(r() * 30 * 60) * MIN;
      const waited = (now - created) / MIN;
      const lagosHour = new Date(now + 60 * MIN).getUTCHours();
      const open = lagosHour >= APPROVAL_OPEN_HOUR && lagosHour < APPROVAL_CLOSE_HOUR;
      const expected =
        waited >= DELAYED_AFTER_MINUTES
          ? "delayed"
          : !open
            ? "after_hours"
            : waited > CREDIT_SLA_MINUTES
              ? "taking_longer"
              : "waiting";
      expect(
        pendingVariant({ createdAt: new Date(created).toISOString() }, new Date(now)),
        `created ${new Date(created).toISOString()} now ${new Date(now).toISOString()}`,
      ).toBe(expected);
    }
  });
});
