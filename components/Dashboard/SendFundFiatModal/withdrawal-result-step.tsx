import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { TransactionDescriptionField } from "@/components/ui/transaction-description-field";
import { UseNombaWithdrawalStatus } from "@/lib/services/wallet.service";
import { NombaWithdrawal } from "@/lib/types/wallet-types";
import { formatTransactionDate } from "@/lib/formatDate";
import { LucideArrowLeftRight, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STATUS_POLL_WINDOW_MS, traceWithdrawal } from "@/lib/nomba-withdrawal";
import { SuccessStep } from "./success-step";
import { Recipient } from "./types";

// Poll a PENDING withdrawal for about a minute, then hand off to the
// in-app notification the backend sends when the status changes.

export function WithdrawalResultStep({
  withdrawal,
  recipient,
  onDone,
  onAddMore,
}: {
  withdrawal: NombaWithdrawal;
  recipient: Recipient;
  onDone: () => void;
  onAddMore: () => void;
}) {
  const [shownAt] = useState(() => Date.now());
  const pollUntil = shownAt + STATUS_POLL_WINDOW_MS;
  const tracedFinal = useRef(false);
  const tracedWindowEnd = useRef(false);
  const [pollWindowOver, setPollWindowOver] = useState(false);
  const { data: latest } = UseNombaWithdrawalStatus(
    withdrawal.status === "PENDING" ? withdrawal.reference : undefined,
    pollUntil,
  );
  const current = latest ?? withdrawal;

  useEffect(() => {
    const timer = setTimeout(() => setPollWindowOver(true), STATUS_POLL_WINDOW_MS);
    return () => clearTimeout(timer);
  }, []);

  // Trace the final status once, and once if we stop polling before it.
  useEffect(() => {
    if (current.status !== "PENDING") {
      if (tracedFinal.current) return;
      tracedFinal.current = true;
      traceWithdrawal({
        event: "status_final",
        reference: current.reference,
        status: current.status,
        elapsedMs: Date.now() - shownAt,
      });
    } else if (pollWindowOver && !tracedWindowEnd.current) {
      tracedWindowEnd.current = true;
      traceWithdrawal({ event: "poll_window_ended", reference: current.reference });
    }
  }, [current.status, current.reference, pollWindowOver, shownAt]);

  const amount = current.amount.toLocaleString();
  const date = formatTransactionDate(new Date(current.createdAt));

  if (current.status === "COMPLETED") {
    return (
      <SuccessStep
        amount={current.amount.toString()}
        name={current.accountName}
        bank={recipient.bankName}
        fee={"₦0.00"}
        date={date}
        reference={current.reference}
        message=""
        onDone={onDone}
        onAddMore={onAddMore}
      />
    );
  }

  const failed = current.status === "FAILED";

  return (
    <Modal
      className="pt-6 max-sm:px-5 max-sm:pt-5 max-sm:pb-6"
      onClose={onDone}
    >
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center space-y-6 max-sm:space-y-4 max-sm:gap-4">
        {failed ? (
          <XCircle className="w-15 h-15 text-error-text" />
        ) : (
          <Spinner icon={LucideArrowLeftRight} size={52} />
        )}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
            {failed ? "Withdrawal failed" : "Processing your withdrawal"}
          </h3>
          <p className="text-base font-normal leading-6 text-text max-sm:text-sm max-sm:leading-5">
            {failed
              ? `₦${amount} has been returned to your wallet.`
              : pollWindowOver
                ? "This is taking longer than usual. We'll notify you when it completes."
                : "Waiting for the bank to confirm. This usually takes a few seconds."}
          </p>
        </div>
        <div className="space-y-3 rounded-[20px] bg-border p-4 w-full max-sm:p-3.5">
          <TransactionDescriptionField label="Recipient" value={current.accountName} />
          {recipient.bankName && (
            <TransactionDescriptionField label="Bank" value={recipient.bankName} isAccount />
          )}
          <TransactionDescriptionField label="Amount" value={`₦${amount}`} />
          <TransactionDescriptionField
            className="pt-3 border-t border-input"
            label="Date & Time"
            value={date}
          />
          <TransactionDescriptionField label="Reference" value={current.reference} />
        </div>
        <Button size="lg" className="w-full" onClick={onDone}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
