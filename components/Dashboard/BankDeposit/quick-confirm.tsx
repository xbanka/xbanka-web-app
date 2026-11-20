"use client";

import { Button } from "@/components/ui/button";
import { UseDeclareBankTransferIntent } from "@/lib/services/wallet.service";
import {
  BankDeposit,
  depositFromDeclareResponse,
  formatNaira,
  sourceLabel,
} from "@/lib/bank-deposit";
import { rememberDepositSource, watchDeposit } from "@/lib/deposit-memory";
import { FundingAccount } from "@/lib/types/wallet-types";
import { DepositModal, DetailRows, FooterButtons } from "./deposit-ui";
import { useXbankaLabel } from "./use-deposit-data";

/**
 * Frame 3: a last check before the deposit is declared. Declaring is what
 * puts the request in front of the approvers, so it happens here, on "Yes",
 * and never from the transfer details screen.
 */
export function QuickConfirm({
  amount,
  source,
  onNotYet,
  onClose,
  onDeclared,
}: {
  amount: number;
  source: FundingAccount | null;
  onNotYet: () => void;
  onClose: () => void;
  onDeclared: (deposit: BankDeposit | null) => void;
}) {
  const to = useXbankaLabel();
  const { mutate: declareIntent, isPending } = UseDeclareBankTransferIntent();

  const confirm = () =>
    declareIntent(amount, {
      onSuccess: (res) => {
        const deposit = depositFromDeclareResponse(res?.data?.data, amount, source?.id ?? null);
        if (deposit) {
          if (source) rememberDepositSource(deposit.id, source.id);
          watchDeposit(deposit.id);
        }
        // null: the request went through but the response had no id. The
        // host closes the flow; the banner picks the deposit up on refetch.
        onDeclared(deposit);
      },
    });

  return (
    <DepositModal
      title={`Have you sent ${formatNaira(amount)}?`}
      onClose={onClose}
      testId="quick-confirm"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onNotYet} disabled={isPending}>
              Not yet
            </Button>
          }
          primary={
            <Button type="button" size="lg" onClick={confirm} disabled={isPending}>
              {isPending ? "Submitting..." : "Yes, I've sent it"}
            </Button>
          }
        />
      }
    >
      <DetailRows
        rows={[
          { label: "Amount", value: formatNaira(amount) },
          { label: "From", value: sourceLabel(source) },
          { label: "To", value: to },
        ]}
      />
      <p className="text-sm leading-6 text-text">
        Only confirm once the transfer has gone through. We&apos;ll start checking for your
        payment right away.
      </p>
    </DepositModal>
  );
}
