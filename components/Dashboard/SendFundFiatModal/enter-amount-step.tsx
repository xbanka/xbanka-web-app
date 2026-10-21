import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MIN_SEND_AMOUNT } from "@/lib/wallet-page";
import {
  UseGetFiatWallet,
  UseInitiateNombaWithdrawal,
} from "@/lib/services/wallet.service";
import { ErrorField } from "@/components/ui/field-error";
import { NombaInitiateResponse } from "@/lib/types/wallet-types";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { CreatePinModal } from "@/components/Dashboard/Account-Page/create-pin-modal";
import {
  classifyWithdrawalError,
  traceWithdrawal,
} from "@/lib/nomba-withdrawal";
import { Recipient } from "./types";
import { BankLogo } from "@/components/ui/bank-logo";
import { QUICK_AMOUNTS } from "./mockData";
import { cn } from "@/lib/utils";
import { sumFiatBalances } from "@/lib/sumBalances";

const NARRATION_MAX_LENGTH = 100;

export function EnterAmountStep({
  recipient,
  notice,
  onBack,
  onClose,
  onContinue,
}: {
  recipient: Recipient;
  /** Shown above the form, e.g. when an expired request sent the user back. */
  notice?: string;
  onBack: () => void;
  onClose: () => void;
  onContinue: (recipient: Recipient, withdrawal: NombaInitiateResponse) => void;
}) {
  const [amount, setAmount] = useState(
    recipient.amount ? recipient.amount.toLocaleString() : "",
  );
  const [narration, setNarration] = useState(recipient.narration);
  const { data } = UseGetFiatWallet();
  const wallets = data?.data?.data || [];
  const { mutate: initiate, isPending, error, reset } = UseInitiateNombaWithdrawal();
  const openBvn = useOnboardingModalStore((state) => state.openBvn);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const errorMessage = error ? classifyWithdrawalError(error).message : "";

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const minTransfer = MIN_SEND_AMOUNT;

  const formatAmount = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString() : "";
  };

  const isValid = numericAmount >= minTransfer && numericAmount <= sumFiatBalances(wallets);

  const handleContinue = () => {
    const trimmedNarration = narration.trim();
    initiate(
      {
        bankCode: recipient.bankCode,
        accountNumber: recipient.accountNumber,
        amount: numericAmount,
        ...(trimmedNarration && { narration: trimmedNarration }),
      },
      {
        onSuccess: (withdrawal) => {
          traceWithdrawal({ event: "initiate_succeeded" });
          onContinue(
            {
              ...recipient,
              accountName: withdrawal.accountName,
              amount: numericAmount,
              narration: trimmedNarration,
            },
            withdrawal,
          );
        },
        onError: (err) => {
          const { kind } = classifyWithdrawalError(err);
          traceWithdrawal({ event: "initiate_failed", kind });
          if (kind === "tier-required") {
            onClose();
            openBvn();
          } else if (kind === "pin-setup-required") {
            setOpenCreatePin(true);
          }
        },
      },
    );
  };

  return (
    <div className="">
      <div className="px-8 pb-3">
        {/* Recipient pill */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-background">
          <BankLogo
            bankName={recipient.bankName}
            bankCode={recipient.bankCode}
            size={36}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-text truncate">
              {recipient.accountName || recipient.bankName}
            </p>
            <p className="text-xs text-text truncate">
              {recipient.accountNumber}
              {recipient.accountName && recipient.bankName
                ? ` · ${recipient.bankName}`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-4 space-y-8">
        <ErrorField message={notice} />

        {/* Amount input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-text">Amount</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-card-text font-semibold text-xl">
              ₦
            </span>
            <input
              className="flex h-14 w-full rounded-lg border border-border-active bg-input-background pl-8 pr-4 text-2xl font-bold text-card-text focus:outline-none focus-visible:ring-2 focus-visible:ring-Green/30 focus-visible:border-Green transition-all"
              value={amount}
              onChange={(e) => {
                setAmount(formatAmount(e.target.value));
                reset();
              }}
              placeholder="0"
            />
          </div>
          <div className="flex justify-between text-xs text-text">
            <span>Minimum transfer: ₦{minTransfer.toLocaleString()}</span>
            <span>
              Balance: ₦
              {/* {balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })} */}
              {data?.data
                ? `${sumFiatBalances(wallets).toLocaleString()}`
                : "₦0.00"}
            </span>
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 flex-wrap">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => {
                setAmount(q.toLocaleString());
                reset();
              }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                numericAmount === q
                  ? "bg-Green/10 border-Green text-Green"
                  : "bg-background border-border text-text hover:border-Green/50",
              )}
            >
              ₦{q.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Narration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-card-text">
            Narration <span className="text-text font-normal">(Optional)</span>
          </label>
          <Input
            placeholder="What's this for?"
            value={narration}
            maxLength={NARRATION_MAX_LENGTH}
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>

        {/* Bank verification / balance errors from the initiate call */}
        <ErrorField message={errorMessage} />

        <div className="flex gap-4 pt-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Back
          </Button>
          <Button
            className="flex-3"
            disabled={!isValid || isPending}
            variant={isValid && !isPending ? "default" : "disabled"}
            onClick={handleContinue}
          >
            {isPending ? "Verifying account..." : "Continue"}
          </Button>
        </div>
        {openCreatePin && (
          <CreatePinModal
            open={openCreatePin}
            handleClose={() => setOpenCreatePin(false)}
          />
        )}
      </div>
    </div>
  );
}
