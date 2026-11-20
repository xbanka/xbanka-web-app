"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { BankDeposit, formatClock, formatDepositTime, formatNaira } from "@/lib/bank-deposit";
import { DepositModal, DetailRows, FooterButtons, Notice } from "./deposit-ui";
import { useDepositSourceLabel } from "./use-deposit-data";

/** Frame P2: a second deposit while one is pending must be a new transfer. */
export function AnotherDepositPrompt({
  deposit,
  onBack,
  onClose,
  onConfirm,
}: {
  deposit: BankDeposit;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const now = useNow();
  const from = useDepositSourceLabel(deposit);
  const amount = formatNaira(deposit.amount);

  return (
    <DepositModal
      title="Make another deposit?"
      onBack={onBack}
      onClose={onClose}
      testId="another-deposit"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              Go back
            </Button>
          }
          primary={
            <Button type="button" size="lg" onClick={onConfirm}>
              Yes, new deposit
            </Button>
          }
        />
      }
    >
      <Notice tone="warning" icon={AlertTriangle} title="Only continue for a new, separate transfer" role="alert">
        Your {amount} deposit from {formatClock(deposit.createdAt)} is still being processed.
        Don&apos;t send the same money again. Each transfer is credited once it&apos;s matched.
      </Notice>
      <DetailRows
        rows={[
          { label: "Still pending", value: `${amount} · ${from}` },
          { label: "Submitted", value: formatDepositTime(deposit.createdAt, now) },
        ]}
      />
    </DepositModal>
  );
}
