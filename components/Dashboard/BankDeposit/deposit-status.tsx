"use client";

import { AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import {
  BankDeposit,
  CREDIT_SLA_MINUTES,
  formatDepositTime,
  formatNaira,
  pendingVariant,
} from "@/lib/bank-deposit";
import { cn } from "@/lib/utils";
import { CopyValue, DepositModal, DetailRows, FooterButtons, Notice, StatusPill } from "./deposit-ui";
import { useDepositSourceLabel, useDepositSupport, useXbankaLabel } from "./use-deposit-data";

type StepState = "done" | "active" | "warning" | "todo";

function TimelineStep({
  state,
  title,
  detail,
  last,
}: {
  state: StepState;
  title: string;
  detail?: string;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-5 last:pb-0" data-state={state}>
      {!last && (
        <span
          aria-hidden
          className={cn(
            "absolute left-3.5 top-8 bottom-0 w-px",
            state === "done" ? "bg-Green" : "bg-input",
          )}
        />
      )}
      <span
        aria-hidden
        className={cn(
          "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
          state === "done" && "border-Green bg-Green text-white",
          state === "active" && "border-Green",
          state === "warning" && "border-yellow-warning-dark",
          state === "todo" && "border-input",
        )}
      >
        {state === "done" && <Check className="h-4 w-4" />}
        {state === "active" && <span className="h-2.5 w-2.5 rounded-full bg-Green" />}
        {state === "warning" && <span className="h-2.5 w-2.5 rounded-full bg-yellow-warning-dark" />}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className={cn("text-sm font-medium", state === "todo" ? "text-text" : "text-card-text")}>
          {title}
        </p>
        {detail && (
          <p
            className={cn(
              "mt-0.5 text-sm",
              state === "warning" ? "text-yellow-warning-text" : "text-text",
            )}
          >
            {detail}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * Frames 4a / 4d: where a pending deposit is. Past 24 hours it switches to
 * the delayed copy (4d). Once the deposit settles the host swaps this for the
 * result screen.
 */
export function DepositStatus({
  deposit,
  onClose,
}: {
  deposit: BankDeposit;
  onClose: () => void;
}) {
  const now = useNow();
  const delayed = pendingVariant(deposit, now) === "delayed";
  const from = useDepositSourceLabel(deposit);
  const to = useXbankaLabel();
  const contactSupport = useDepositSupport();
  const support = () => contactSupport(deposit, from);

  return (
    <DepositModal
      title={delayed ? "This is taking longer than usual" : "Deposit request received"}
      subtitle={
        delayed
          ? "We haven't been able to confirm your payment yet."
          : "We'll check for your payment and credit your wallet."
      }
      onClose={onClose}
      testId="deposit-status"
      footer={
        delayed ? (
          <FooterButtons
            secondary={
              <Button type="button" variant="outline" size="lg" onClick={onClose}>
                Done
              </Button>
            }
            primary={
              <Button type="button" size="lg" onClick={support}>
                Contact support
              </Button>
            }
          />
        ) : (
          <Button type="button" size="lg" className="w-full" onClick={onClose}>
            Done
          </Button>
        )
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text">Deposit amount</p>
          <p className="mt-1 text-4xl font-bold text-card-text max-sm:text-3xl">
            {formatNaira(deposit.amount)}
          </p>
        </div>
        <StatusPill label={delayed ? "Delayed" : "Waiting"} />
      </div>

      <ol aria-label="Deposit progress">
        <TimelineStep
          state="done"
          title="Request received"
          detail={formatDepositTime(deposit.createdAt, now)}
        />
        {delayed ? (
          <TimelineStep state="warning" title="Still checking" detail="Pending for over 24 hours" />
        ) : (
          <TimelineStep
            state="active"
            title="Waiting to be checked"
            detail={`Usually within ${CREDIT_SLA_MINUTES} minutes · 8am to 10pm`}
          />
        )}
        <TimelineStep
          state="todo"
          title="Credited to your wallet"
          detail={delayed ? undefined : "We'll notify you"}
          last
        />
      </ol>

      {delayed && (
        <Notice tone="warning" icon={AlertTriangle} title="Our support team has been alerted" role="status">
          They&apos;ll reach out to you. If you have your transfer receipt, send it to support to
          speed things up.
        </Notice>
      )}

      <DetailRows
        rows={[
          { label: "From", value: from },
          { label: "To", value: to },
          { label: "Request ID", value: <CopyValue value={deposit.reference} label="Request ID" /> },
        ]}
      />

      {!delayed && (
        <p className="text-center text-sm text-text">
          Need help with this deposit?{" "}
          <button type="button" onClick={support} className="font-medium text-Green hover:underline">
            Contact support
          </button>
        </p>
      )}
    </DepositModal>
  );
}
