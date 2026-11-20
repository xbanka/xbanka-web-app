/**
 * What this browser remembers about bank deposits. Conveniences only: losing
 * it (private window, cleared storage) degrades the copy, never the flow.
 *
 *  - Which funding account the user picked for a deposit. The backend does not
 *    record it yet (declare-intent takes only the amount), so "From GTBank
 *    ••••1815" comes from here. On another device it reads "Your registered
 *    account" until the backend stores `fundingAccountId` in the metadata.
 *  - Which pending deposits to watch, so a result screen pops up exactly once
 *    (see settleWatch in lib/bank-deposit.ts).
 */

import { MAX_WATCHED } from "./bank-deposit";

export const SOURCE_KEY = "xbanka:deposit-source:v1";
export const WATCH_KEY = "xbanka:deposit-watch:v1";
const MAX_SOURCES = 50;

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: nothing to do, the flow works without it.
  }
};

type SourceMap = Record<string, string>;

export const rememberDepositSource = (depositId: string, fundingAccountId: string) => {
  const map = read<SourceMap>(SOURCE_KEY, {});
  delete map[depositId];
  map[depositId] = fundingAccountId;
  // Keep the newest entries (insertion order).
  const entries = Object.entries(map).slice(-MAX_SOURCES);
  write(SOURCE_KEY, Object.fromEntries(entries));
};

export const recallDepositSource = (depositId: string | null | undefined): string | null => {
  if (!depositId) return null;
  const value = read<SourceMap>(SOURCE_KEY, {})[depositId];
  return typeof value === "string" ? value : null;
};

export const readWatchedDeposits = (): string[] => {
  const value = read<unknown>(WATCH_KEY, []);
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
};

export const writeWatchedDeposits = (ids: string[]) =>
  write(WATCH_KEY, [...new Set(ids)].slice(0, MAX_WATCHED));

export const watchDeposit = (id: string) =>
  writeWatchedDeposits([id, ...readWatchedDeposits()]);
