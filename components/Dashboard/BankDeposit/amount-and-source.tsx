"use client";

import { useEffect } from "react";
import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankLogo } from "@/components/ui/bank-logo";
import { LimitNotice } from "@/components/ui/limit-notice";
import { useTransactionLimit } from "@/hooks/use-transaction-limit";
import { QUICK_AMOUNTS } from "@/lib/wallet-page";
import { accountLabel, MIN_DEPOSIT_NGN, parseAmountInput } from "@/lib/bank-deposit";
import { FundingAccount } from "@/lib/types/wallet-types";
import { cn } from "@/lib/utils";
import { DepositModal, FooterButtons } from "./deposit-ui";

/** Frame 1: how much, and which registered account the money comes from. */
export function AmountAndSource({
  amount,
  setAmount,
  accounts,
  sourceId,
  setSourceId,
  onAddAccount,
  onClose,
  onContinue,
}: {
  amount: string;
  setAmount: (v: string) => void;
  accounts: FundingAccount[];
  sourceId: string | null;
  setSourceId: (id: string) => void;
  onAddAccount: () => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const numeric = parseAmountInput(amount);
  // Tier balance cap (KYC architecture v4.0 s.9): block a deposit that would
  // take the wallet above the tier limit before the user declares it.
  const { checkDeposit } = useTransactionLimit();
  const capCheck = checkDeposit(numeric);
  const selected = accounts.find((a) => a.id === sourceId) ?? null;
  const canContinue = numeric >= MIN_DEPOSIT_NGN && capCheck.allowed && !!selected;

  // Pre-select the first account, or recover when the chosen one is gone.
  useEffect(() => {
    if (!selected && accounts[0]) setSourceId(accounts[0].id);
  }, [selected, accounts, setSourceId]);

  return (
    <DepositModal
      title="Add funds by bank transfer"
      subtitle="Enter an amount and choose the account you'll pay from."
      onClose={onClose}
      testId="amount-and-source"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onClose}>
              Cancel
            </Button>
          }
          primary={
            <Button
              type="button"
              size="lg"
              disabled={!canContinue}
              variant={canContinue ? "default" : "disabled"}
              onClick={onContinue}
            >
              Continue
            </Button>
          }
        />
      }
    >
      <div className="space-y-3">
        <label htmlFor="deposit-amount" className="text-sm font-medium text-card-text">
          Amount to fund
        </label>
        <div className="flex h-15 items-center gap-2 rounded-xl border border-input bg-background px-4 focus-within:border-Green">
          <span className="text-xl font-semibold text-card-text">₦</span>
          <input
            id="deposit-amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setAmount(raw ? Number(raw).toLocaleString() : "");
            }}
            placeholder="0"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-xl font-semibold text-card-text outline-none placeholder:text-text/30"
          />
        </div>
        <p className="text-sm text-text">Minimum ₦{MIN_DEPOSIT_NGN.toLocaleString()}</p>
        <LimitNotice check={capCheck} />

        <div className="grid grid-cols-5 gap-2 max-sm:grid-cols-3">
          {QUICK_AMOUNTS.map((q) => {
            const active = amount === q.toLocaleString();
            return (
              <button
                type="button"
                key={q}
                aria-pressed={active}
                onClick={() => setAmount(q.toLocaleString())}
                className={cn(
                  "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-Green bg-Green/10 text-Green"
                    : "border-input text-card-text hover:border-border-active",
                )}
              >
                ₦{q.toLocaleString()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-card-text" id="paying-from">
            Paying from
          </span>
          <button
            type="button"
            onClick={onAddAccount}
            className="inline-flex items-center gap-1 text-sm font-medium text-Green hover:underline"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add another
          </button>
        </div>

        <div role="radiogroup" aria-labelledby="paying-from" className="space-y-2">
          {accounts.map((account) => {
            const checked = account.id === selected?.id;
            return (
              <button
                type="button"
                role="radio"
                aria-checked={checked}
                key={account.id}
                onClick={() => setSourceId(account.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  checked
                    ? "border-Green bg-teal-light"
                    : "border-border bg-background/40 hover:border-border-active",
                )}
              >
                <BankLogo bankName={account.bankName} bankCode={account.bankCode} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-card-text">
                    {accountLabel(account)}
                  </span>
                  <span className="block truncate text-xs text-text">{account.accountName}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    checked ? "border-Green" : "border-input",
                  )}
                >
                  {checked && <span className="h-2.5 w-2.5 rounded-full bg-Green" />}
                </span>
              </button>
            );
          })}
        </div>

        <p className="flex items-start gap-2 text-sm text-text">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Send only from the account you pick. We use it to match your payment.
        </p>
      </div>
    </DepositModal>
  );
}
