"use client";

import { BankLogo } from "@/components/ui/bank-logo";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * A linked bank account, presented as account details rather than a payment
 * card. A NUBAN is not a card number, so it is shown unbroken and without card
 * furniture — grouping the digits or adding a chip graphic would suggest this
 * is something the user can pay with.
 */
export function WithdrawalAccountCard({
  bankName,
  accountName,
  accountNumber,
  bankCode,
  currency = "NGN",
}: {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode?: string;
  currency?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    toast.success("Account number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-input bg-border overflow-hidden">
      {/* Bank header */}
      <div className="flex items-center gap-3 border-b border-input px-5 py-4 max-sm:px-4 max-sm:py-3.5">
        <BankLogo bankName={bankName} bankCode={bankCode} size={36} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-5 text-card-text max-sm:text-[13px]">
            {bankName}
          </p>
          <p className="mt-0.5 text-xs font-normal leading-5 text-text">
            Withdrawal account
          </p>
        </div>

        <span className="shrink-0 rounded-md border border-input bg-card-background px-2 py-0.5 text-[11px] font-medium text-text">
          {currency}
        </span>
      </div>

      {/* Account details */}
      <dl className="divide-y divide-input">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 max-sm:px-4 max-sm:py-3">
          <dt className="shrink-0 text-xs font-normal leading-5 text-text">
            Account number
          </dt>
          <dd className="flex min-w-0 items-center gap-2">
            <span className="truncate font-mono text-sm font-semibold tracking-wide text-card-text">
              {accountNumber}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy account number"
              className="shrink-0 rounded p-1 text-text transition-colors hover:bg-card-background hover:text-card-text"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-Green" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </dd>
        </div>

        <div className="flex items-start justify-between gap-3 px-5 py-3.5 max-sm:px-4 max-sm:py-3">
          <dt className="shrink-0 text-xs font-normal leading-5 text-text">
            Account name
          </dt>
          <dd className="min-w-0 wrap-break-word text-right text-sm font-medium leading-5 text-card-text">
            {accountName}
          </dd>
        </div>
      </dl>
    </div>
  );
}
