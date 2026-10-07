# nomba-withdrawal

Logic for NGN bank withdrawals through Nomba, with no UI. The Send Money modal
(`components/Dashboard/SendFundFiatModal/`) renders the steps. This module decides what
each backend answer means.

The backend contract lives in [CONTRACT.md](./CONTRACT.md), the backend team's
integration guide. Treat it as the source of truth.

## Flow

```
initiate (amount step) -> review (confirm step) -> confirm (PIN step) -> status polling (result step)
```

| File | What it owns |
|---|---|
| `errors.ts` | `classifyWithdrawalError`: maps a backend error to the UI action |
| `flow.ts` | token expiry (10 min from receipt), poll interval, `confirmWithRetry` |
| `trace.ts` | one structured log line per withdrawal step |

## Error kinds

| Kind | Backend says | UI does |
|---|---|---|
| `expired` | `Withdrawal request expired`, `Invalid withdrawal token` | back to amount step, inputs kept |
| `tier-required` | `Withdrawal blocked: TIER_REQUIRED` | close modal, open BVN |
| `pin-setup-required` | `Transaction PIN not set`, `PIN_SETUP_REQUIRED` | open Create PIN |
| `limit-exceeded` | `Withdrawal blocked: LIMIT_EXCEEDED` | readable "daily limit" text |
| `wrong-pin` | `Invalid transaction PIN` | clear PIN boxes, retry |
| `pin-locked` | HTTP 429 | disable PIN entry |
| `unknown-outcome` | timeout (408), network (503), any 5xx | "check your transaction history", never "failed" |
| `other` | anything else | show the backend message |

The backend only sends a message string, so most of these match on wording.
`__tests__/contract.test.ts` reads the errors table in CONTRACT.md and fails
when a row is added, removed or reworded without a matching update here.

## Retry policy (the money-safety rule)

Confirm is idempotent per `withdrawalToken`, so `confirmWithRetry` retries an
unknown outcome twice, waiting 1s and then 2s.

Once any attempt has an unknown outcome, **every later error is reported as
unknown too**. If attempt 1 timed out after Nomba was paid and attempt 2 says
"expired", showing "expired" would send the user back to start a *second*
withdrawal. The price is that a wrong PIN right after a timeout shows "check
your transaction history" instead of "wrong PIN". That trade is deliberate.

## Tracing: the measurable outcome

Each step logs `[nomba-withdrawal] {"event": ...}` to the browser console:

| Event | Fields |
|---|---|
| `initiate_succeeded` / `initiate_failed` | `kind` on failure |
| `confirm_retry` | `attempt` |
| `confirm_succeeded` / `confirm_failed` | `reference`, `status` / `kind` |
| `status_final` | `reference`, `status`, `elapsedMs` since the result screen opened |
| `poll_window_ended` | `reference` (still PENDING after 60s) |

The two numbers worth watching:

- **Unknown-outcome rate:** `confirm_failed{kind: unknown-outcome}` / all confirms. These users were left unsure whether they got paid. Target: near 0.
- **Final status within the poll window:** `status_final` / `confirm_succeeded{status: PENDING}`. The rest fall back to the push notification.

The event types have no field that could hold the token or the PIN, so
neither can be logged.

## Tests and evals

```sh
npm test       # gate: offline, deterministic, ~1-2s, runs in the pre-commit hook
npm run eval   # periodic: live staging backend, run before shipping
```

The eval only calls initiate and status. It never calls confirm, so it can't
move money or count toward the PIN lockout. Set these in the shell or in
`.env.local`:

| Variable | Required | Notes |
|---|---|---|
| `XBANKA_EVAL_API_URL` | yes | **staging** base URL; never falls back to `NEXT_PUBLIC_API_URL` |
| `XBANKA_EVAL_ACCESS_TOKEN` | yes | JWT of a test user with BVN-verified KYC |
| `XBANKA_EVAL_BANK_CODE` | no | with the account number, enables the happy-path case |
| `XBANKA_EVAL_ACCOUNT_NUMBER` | no | a real 10-digit account at that bank |

If the required variables are missing, the eval fails instead of skipping. A
run that never happened shouldn't look like a pass.

## Where it can break

- **Backend rewords an error.** The classification falls back to `other`, so the user sees the raw message and no redirect. The gate catches it if CONTRACT.md is updated, and the eval catches it if only the backend changed.
- **Client clock is wrong.** Not a problem: `isWithdrawalExpired` measures 10 minutes minus a 15s margin from when the client received the token, not from the server's `expiresAt`, so device clock skew cancels out. The eval checks that the server's real TTL still matches `WITHDRAWAL_TOKEN_TTL_MS`.
- **Backend shortens the TTL without telling us.** The client then lets a dead token through to the PIN step. The backend returns `expired`, the user goes back to the amount step with inputs kept, and the eval fails on the next run.
- **The user closes the modal while a result is PENDING.** Polling stops. The backend's in-app notification is the fallback.
- **Offline before sending.** The interceptor rejects with 503 before any request leaves, which classifies as unknown-outcome. That's safe (the user is told to check history) but stricter than needed.
