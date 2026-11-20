"use client";

import { AlertTriangle, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import {
  BankDeposit,
  CREDIT_SLA_MINUTES,
  formatDepositTime,
  formatNaira,
  formatWaiting,
  minutesSince,
  pendingVariant,
} from "@/lib/bank-deposit";
import { DepositModal, DetailRows, FooterButtons, Notice, StatusPill } from "./deposit-ui";
import { useDepositSourceLabel, useDepositSupport } from "./use-deposit-data";

/**
 * Frames P1 / P1b / P1c: "Add Fund" tapped while a deposit is pending.
 * Past 24 hours it shows the delayed wording from 4d.
 */
export function DepositInProgress({
  deposit,
  onClose,
  onAnother,
  onViewStatus,
}: {
  deposit: BankDeposit;
  onClose: () => void;
  onAnother: () => void;
  onViewStatus: () => void;
}) {
  const now = useNow();
  const variant = pendingVariant(deposit, now);
  const from = useDepositSourceLabel(deposit);
  const contactSupport = useDepositSupport();

  return (
    <DepositModal
      title="You have a deposit in progress"
      subtitle="We're still waiting to credit your last deposit."
      onClose={onClose}
      testId="deposit-in-progress"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onAnother}>
              Make another deposit
            </Button>
          }
          primary={
            <Button type="button" size="lg" onClick={onViewStatus}>
              View status
            </Button>
          }
        />
      }
    >
      <div className="rounded-xl border border-border bg-background/40 px-5 pt-4 pb-2">
        <div className="flex items-center justify-between gap-4 pb-2">
          <p className="text-3xl font-bold text-card-text max-sm:text-2xl">
            {formatNaira(deposit.amount)}
          </p>
          <StatusPill label={variant === "delayed" ? "Delayed" : "Waiting"} />
        </div>
        <DetailRows
          className="border-0 bg-transparent px-0 py-0"
          rows={[
            { label: "From", value: from },
            { label: "Submitted", value: formatDepositTime(deposit.createdAt, now) },
            {
              label: "Waiting",
              value: formatWaiting(minutesSince(deposit.createdAt, now)),
              testId: "waiting-duration",
            },
          ]}
        />
      </div>

      {variant === "waiting" && (
        <p className="text-sm leading-6 text-text">
          Deposits are usually credited within {CREDIT_SLA_MINUTES} minutes, 8am to 10pm. You can
          check its progress any time.
        </p>
      )}

      {variant === "after_hours" && (
        <Notice tone="info" icon={Moon} title="It'll be credited from 8am" role="status">
          Deposits made after 10pm are checked when approvals open in the morning.
        </Notice>
      )}

      {(variant === "taking_longer" || variant === "delayed") && (
        <>
          <Notice
            tone="warning"
            icon={AlertTriangle}
            title={variant === "delayed" ? "Our support team has been alerted" : "This is taking longer than usual"}
            role="status"
          >
            {variant === "delayed"
              ? "They'll reach out to you. If you have your transfer receipt, send it to support to speed things up."
              : "We're still checking for your payment. If you've sent it, there's nothing more you need to do."}
          </Notice>
          <p className="text-center text-sm text-text">
            Need help with this deposit?{" "}
            <button
              type="button"
              onClick={() => contactSupport(deposit, from)}
              className="font-medium text-Green hover:underline"
            >
              Contact support
            </button>
          </p>
        </>
      )}
    </DepositModal>
  );
}
