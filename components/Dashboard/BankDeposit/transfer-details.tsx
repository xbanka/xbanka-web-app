"use client";

import { Clock, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import {
  accountLabel,
  CREDIT_SLA_MINUTES,
  formatNaira,
  isApprovalOpen,
  isBeforeApprovalOpen,
  transferDetailsText,
  UNKNOWN_SOURCE_LABEL,
} from "@/lib/bank-deposit";
import { FundingAccount } from "@/lib/types/wallet-types";
import { copyToClipboard, DepositModal, FooterButtons, Notice } from "./deposit-ui";
import { useXbankaAccount } from "./use-deposit-data";

/** Frames 2 / 2b: where to send the money, and from which account only. */
export function TransferDetails({
  amount,
  source,
  onBack,
  onClose,
  onSent,
}: {
  amount: number;
  source: FundingAccount | null;
  onBack: () => void;
  onClose: () => void;
  onSent: () => void;
}) {
  const now = useNow();
  const { account: xbanka, isPending } = useXbankaAccount();
  const open = isApprovalOpen(now);

  return (
    <DepositModal
      title="Make the transfer"
      subtitle="Send the exact amount to the account below."
      onBack={onBack}
      onClose={onClose}
      testId="transfer-details"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              Back
            </Button>
          }
          primary={
            <Button
              type="button"
              size="lg"
              disabled={!xbanka}
              variant={xbanka ? "default" : "disabled"}
              onClick={onSent}
            >
              I have sent the money
            </Button>
          }
        />
      }
    >
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/40 p-5">
        <div>
          <p className="text-sm text-text">Amount to send</p>
          <p className="mt-1 text-3xl font-bold text-card-text max-sm:text-2xl">
            {formatNaira(amount)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => copyToClipboard(String(amount), "Amount")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-Green/50 bg-Green/10 px-3 py-2 text-sm font-medium text-Green hover:bg-Green/15"
        >
          <Copy className="h-4 w-4" aria-hidden />
          Copy
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-card-text">Send money to</p>
        {isPending ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-Green border-t-transparent" />
          </div>
        ) : !xbanka ? (
          <p className="rounded-xl bg-border p-5 text-sm text-text">
            Bank transfer funding isn&apos;t available right now. Please try again later.
          </p>
        ) : (
          <div className="rounded-xl border border-border bg-background/40 px-5 py-2">
            <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="text-text">Bank name</span>
              <span className="text-right font-medium text-card-text">{xbanka.bankName}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="text-text">Account number</span>
              <button
                type="button"
                onClick={() => copyToClipboard(xbanka.accountNumber, "Account number")}
                className="inline-flex items-center gap-2 font-medium text-Green hover:opacity-80"
                aria-label="Copy account number"
              >
                {xbanka.accountNumber}
                <Copy className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="text-text">Account name</span>
              <span className="text-right font-medium text-card-text">{xbanka.accountName}</span>
            </div>
            <div className="mt-1 border-t border-border py-3 text-center">
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(transferDetailsText({ amount, ...xbanka }), "Transfer details")
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-Green hover:underline"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Copy all details
              </button>
            </div>
          </div>
        )}
      </div>

      <Notice
        tone="teal"
        icon={Info}
        title={source ? `Send from ${accountLabel(source)} only` : `Send from ${UNKNOWN_SOURCE_LABEL.toLowerCase()} only`}
      >
        This is the account you chose. Money from any other account can&apos;t be matched to you.
      </Notice>

      {open ? (
        <p className="flex items-center gap-2 text-sm text-text">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          Usually credited within {CREDIT_SLA_MINUTES} minutes · 8am to 10pm daily
        </p>
      ) : (
        <Notice
          tone="warning"
          icon={Clock}
          title={isBeforeApprovalOpen(now) ? "Approvals open at 8am" : "It's past 10pm"}
          role="status"
        >
          {isBeforeApprovalOpen(now)
            ? "You can still send now. Deposits sent before 8am are credited from 8am."
            : "You can still send now. Deposits sent after 10pm are credited from 8am."}
        </Notice>
      )}
    </DepositModal>
  );
}
