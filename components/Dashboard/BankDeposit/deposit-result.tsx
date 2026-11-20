"use client";

import { Check, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/use-now";
import { UseGetFiatWallet } from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { BankDeposit, formatDepositTime, formatNaira, resultVariant } from "@/lib/bank-deposit";
import { CopyValue, DepositModal, DetailRows, FooterButtons, Notice, ResultHero } from "./deposit-ui";
import { useDepositSourceLabel, useDepositSupport } from "./use-deposit-data";

/**
 * Frames 5a / 5b / 5c: what happened to a deposit once staff settled it.
 *
 * 5c shows no reason: the admin's reject reason is internal ("the customer
 * sees a neutral message"), and the backend sends no customer-facing one yet.
 */
export function DepositResult({
  deposit,
  onClose,
  onViewTransaction,
  onNewDeposit,
}: {
  deposit: BankDeposit;
  onClose: () => void;
  onViewTransaction: () => void;
  onNewDeposit: () => void;
}) {
  const now = useNow();
  const from = useDepositSourceLabel(deposit);
  const contactSupport = useDepositSupport();
  const support = () => contactSupport(deposit, from);
  const { data: fiat } = UseGetFiatWallet();
  const wallets = fiat?.data?.data;
  const variant = resultVariant(deposit);
  const requestId = { label: "Request ID", value: <CopyValue value={deposit.reference} label="Request ID" /> };

  if (variant === "not_credited") {
    return (
      <DepositModal
        title="Deposit not credited"
        subtitle="We couldn't match this payment."
        onClose={onClose}
        testId="deposit-result"
        footer={
          <FooterButtons
            secondary={
              <Button type="button" variant="outline" size="lg" onClick={support}>
                Contact support
              </Button>
            }
            primary={
              <Button type="button" size="lg" onClick={onNewDeposit}>
                Make a new deposit
              </Button>
            }
          />
        }
      >
        <ResultHero tone="danger" icon={XCircle} amount={formatNaira(deposit.amount)} caption="was not credited" />
        <Notice tone="danger" icon={XCircle} title="We couldn't find this payment" role="alert">
          We didn&apos;t find a {formatNaira(deposit.amount)} transfer from {from}. If you sent it,
          contact support with your receipt and we&apos;ll check again.
        </Notice>
        <DetailRows
          rows={[
            { label: "From", value: from },
            { label: "Requested", value: formatDepositTime(deposit.createdAt, now) },
            requestId,
          ]}
        />
      </DepositModal>
    );
  }

  if (variant === "credited_different" && deposit.declaredAmount !== null) {
    const entered = formatNaira(deposit.declaredAmount);
    const received = formatNaira(deposit.amount);
    return (
      <DepositModal
        title="Deposit credited"
        subtitle="We received a different amount from what you entered."
        onClose={onClose}
        testId="deposit-result"
        footer={
          <FooterButtons
            secondary={
              <Button type="button" variant="outline" size="lg" onClick={support}>
                Contact support
              </Button>
            }
            primary={
              <Button type="button" size="lg" onClick={onClose}>
                Done
              </Button>
            }
          />
        }
      >
        <ResultHero tone="info" icon={Info} amount={received} caption="added to your wallet" />
        <Notice tone="info" icon={Info} title="We credited what we received" role="status">
          You entered {entered}, but {received} arrived from {from}. Your wallet has been
          credited with {received}.
        </Notice>
        <DetailRows
          rows={[
            { label: "You entered", value: entered },
            { label: "We received", value: received },
            { label: "Credited", value: <span className="text-Green">{received}</span> },
          ]}
        />
      </DepositModal>
    );
  }

  return (
    <DepositModal
      title="Deposit credited"
      subtitle="Your wallet has been funded."
      onClose={onClose}
      testId="deposit-result"
      footer={
        <FooterButtons
          secondary={
            <Button type="button" variant="outline" size="lg" onClick={onViewTransaction}>
              View transaction
            </Button>
          }
          primary={
            <Button type="button" size="lg" onClick={onClose}>
              Done
            </Button>
          }
        />
      }
    >
      <ResultHero tone="success" icon={Check} amount={formatNaira(deposit.amount)} caption="added to your wallet" />
      <DetailRows
        rows={[
          { label: "From", value: from },
          { label: "Credited", value: formatDepositTime(deposit.updatedAt, now) },
          ...(Array.isArray(wallets)
            ? [{ label: "New wallet balance", value: formatNaira(sumFiatBalances(wallets), { decimals: true }) }]
            : []),
          requestId,
        ]}
      />
    </DepositModal>
  );
}
