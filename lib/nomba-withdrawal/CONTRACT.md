# NGN Bank Withdrawal: Frontend Integration Guide

Lets a user withdraw Naira from their Xbanka wallet to any Nigerian bank account. It is a three-step flow: **verify the account, confirm with PIN, track status**.

All endpoints require the user's JWT: `Authorization: Bearer <token>`.

---

## Flow at a glance

```
1. POST /wallets/withdraw/nomba/initiate   -> shows account name, returns withdrawalToken
        (user reviews name + amount, enters PIN)
2. POST /wallets/withdraw/nomba/confirm    -> debits wallet, sends transfer, returns reference + status
3. GET  /wallets/withdraw/nomba/status/:reference   -> poll until COMPLETED or FAILED
```

Money only leaves the wallet at step 2. Step 1 is safe to call repeatedly.

---

## Response envelope

Every response uses the standard gateway shape. The payload is in `data`.

```json
{ "message": "Request successful", "details": "", "errorGroup": "", "data": { } }
```

Errors:

```json
{ "message": "Insufficient NGN balance", "details": "", "errorGroup": "MICROSERVICE_ERROR", "data": null }
```

Show `message` to the user. `POST` endpoints return HTTP **201** on success.

---

## Before step 1: bank list

Use the existing `GET /accounts/banks` to populate the bank picker. Send the selected bank's code as `bankCode`.

> Backend note: confirm that these codes match what Nomba expects before release. Both use CBN codes, but verify with a test withdrawal.

---

## Step 1: Verify the account

`POST /wallets/withdraw/nomba/initiate`

```json
{
  "bankCode": "058",
  "accountNumber": "0123456789",
  "amount": 5000,
  "narration": "Rent"
}
```

| Field | Rules |
|---|---|
| `bankCode` | required, string |
| `accountNumber` | required, exactly 10 digits |
| `amount` | required, number, minimum 100 (NGN) |
| `narration` | optional, max 100 characters |

**Success `data`:**

```json
{
  "withdrawalToken": "eyJ1Ijoi...<opaque>",
  "accountName": "JOHN DOE",
  "accountNumber": "0123456789",
  "bankCode": "058",
  "amount": 5000,
  "currency": "NGN",
  "expiresAt": "2026-10-05T10:40:00.000Z"
}
```

**What to do:**
- Show a confirmation screen with **`accountName`**, bank, account number and amount. Let the user check the name before continuing.
- Keep `withdrawalToken` in memory. Don't parse it or edit it. It expires at `expiresAt` (10 minutes). If it expires, call initiate again.
- Then collect the 4-digit transaction PIN.

---

## Step 2: Confirm

`POST /wallets/withdraw/nomba/confirm`

```json
{ "withdrawalToken": "eyJ1Ijoi...", "pin": "1234" }
```

| Field | Rules |
|---|---|
| `withdrawalToken` | the token from step 1 |
| `pin` | exactly 4 characters |

**Success `data`:**

```json
{
  "reference": "NWD-3f1c9a52-...",
  "status": "PENDING",
  "amount": 5000,
  "currency": "NGN",
  "accountName": "JOHN DOE",
  "accountNumber": "0123456789",
  "bankCode": "058",
  "note": "Rent",
  "createdAt": "2026-10-05T10:31:02.000Z",
  "updatedAt": "2026-10-05T10:31:02.000Z"
}
```

`status` can be any of `PENDING`, `COMPLETED` or `FAILED`. **Treat every one of them as a valid response**, even though the request succeeded:

- `COMPLETED`: show success.
- `PENDING`: show "Processing your withdrawal" and go to step 3. This is normal and common.
- `FAILED`: show failure. The money has already been returned to the wallet.

**Safe to retry:** if the user double-taps or the request is retried with the same `withdrawalToken`, the backend returns the original withdrawal and does **not** pay twice. Disable the button after the first tap anyway.

---

## Step 3: Check status

`GET /wallets/withdraw/nomba/status/:reference`

Returns the same object as step 2.

| `status` | Meaning | UI |
|---|---|---|
| `PENDING` | Sent, awaiting bank confirmation. Wallet is already debited. | "Processing" |
| `COMPLETED` | Delivered to the bank. | Success |
| `FAILED` | Failed. Funds were refunded to the wallet automatically. | Failure and "refunded" |

**Polling:** call every 3 to 5 seconds for about 1 minute while `PENDING`. After that, stop polling and show "We'll notify you when it completes". The user also gets an in-app notification when the status changes. Keep the `reference` so the user can look it up later.

A reference that doesn't belong to the user returns 404.

---

## Errors

| HTTP | `message` | Cause | UI suggestion |
|---|---|---|---|
| 400 | `Insufficient NGN balance` | Wallet balance below amount | Show balance and amount, offer top-up |
| 400 | `Could not verify bank account...` | Bad account number or bank | Let the user correct it |
| 400 | `Invalid amount` / validation messages | Amount under 100 or bad fields | Inline field errors |
| 400 | `Withdrawal request expired...` | Token older than 10 minutes | Restart from step 1 |
| 400 | `Invalid withdrawal token` | Token missing or altered | Restart from step 1 |
| 400 | `Transaction PIN not set` | User has no PIN | Send them to PIN setup |
| 403 | `Invalid transaction PIN` | Wrong PIN | Let them retry |
| 403 | `Withdrawal blocked: TIER_REQUIRED` | BVN not verified | Send to KYC |
| 403 | `Withdrawal blocked: PIN_SETUP_REQUIRED` | No PIN set | Send to PIN setup |
| 403 | `Withdrawal blocked: LIMIT_EXCEEDED` | Daily withdrawal limit reached | Say the limit is reached for today |
| 404 | `Withdrawal not found` | Wrong reference or another user's | |
| 429 | `Too many incorrect PIN attempts...` | 5 wrong PINs, locked for 15 minutes | Disable PIN entry, show the message |
| 401 | (auth error) | Token expired | Refresh login |

**Important:** a network error or timeout on step 2 does **not** mean it failed. The withdrawal may have been created. Do not tell the user it failed. Call the status endpoint instead, or show "Checking your withdrawal" and reload their transaction history.

---

## Suggested UI states

1. **Form:** bank picker, account number, amount, optional narration. Button: "Continue".
2. **Review:** account name, bank, amount, then PIN input. Button: "Withdraw".
3. **Result:** `COMPLETED`, `PENDING` (with polling) or `FAILED`.

Show the `reference` on the result screen so users can quote it to support.

---

## Notes for testing

- Amounts are in NGN as plain numbers (5000 means 5,000 naira), not kobo.
- A test user needs: a BVN-verified KYC tier, a transaction PIN, and an NGN wallet balance.
- Withdrawals appear in the user's transaction history with type `WITHDRAWAL`.
