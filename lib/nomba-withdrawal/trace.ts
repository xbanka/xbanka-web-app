import type { NombaWithdrawalStatus } from "@/lib/types/wallet-types";
import type { WithdrawalErrorKind } from "./errors";

// One structured log line per step of a bank withdrawal, so we can measure
// how withdrawals end: share reaching COMPLETED / FAILED vs left in an unknown
// state, retries needed, and time to a final status.
//
// The field list is closed on purpose: the withdrawalToken and PIN can never
// be passed in, so they can never be logged.
export type WithdrawalTraceEvent =
  | { event: "initiate_succeeded" }
  | { event: "initiate_failed"; kind: WithdrawalErrorKind }
  | { event: "confirm_retry"; attempt: number }
  | { event: "confirm_succeeded"; reference: string; status: NombaWithdrawalStatus }
  | { event: "confirm_failed"; kind: WithdrawalErrorKind }
  | {
      event: "status_final";
      reference: string;
      status: NombaWithdrawalStatus;
      elapsedMs: number;
    }
  | { event: "poll_window_ended"; reference: string };

export const TRACE_PREFIX = "[nomba-withdrawal]";

export const traceWithdrawal = (entry: WithdrawalTraceEvent) => {
  console.info(TRACE_PREFIX, JSON.stringify({ ...entry, at: Date.now() }));
};
