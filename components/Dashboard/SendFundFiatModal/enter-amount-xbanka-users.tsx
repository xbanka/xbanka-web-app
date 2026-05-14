import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Recipient, Step, XbankaTransferRecipient } from "./types";
import { AvatarCircle } from "./avatarCircle";
import { QUICK_AMOUNTS } from "./mockData";
import { cn } from "@/lib/utils";
import { UseGetFiatWallet } from "@/lib/services/wallet.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { shortenUid } from "@/lib/shortenuid";
import { Label } from "@/components/ui/label";

export function EnterAmountXbankaStep({
  recipient,
  onBack,
  onContinue,
}: {
  recipient: XbankaTransferRecipient;
  onBack: () => void;
  onContinue: (Recipient: XbankaTransferRecipient) => void;
}) {
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const { data, error, isPending } = UseGetFiatWallet();
  const wallets = data?.data?.data || [];

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const minTransfer = 5000;

  const formatAmount = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString() : "";
  };

  const isValid =
    numericAmount >= minTransfer && numericAmount <= sumFiatBalances(wallets);

  const handleContinue = () => {
    // We spread the existing recipient and add the new amount/narration
    const updatedRecipient: XbankaTransferRecipient = {
      ...recipient,
      amount: numericAmount,
      narration: narration,
    };

    // If your parent's handleContinue only expects (amount, narration),
    // you should change it to accept the whole object or just call a setter.
    onContinue(updatedRecipient);
  };

  return (
    <div className="">
      <div className="px-8 pb-3">
        {/* Recipient pill */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-input bg-border">
          <AvatarCircle name={recipient?.name} color="bg-orange-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5 text-card-text truncate">
              {recipient.name}
            </p>
            <div className="flex items-center">
              <p className="text-xs text-text truncate border-r pr-3 border-input">
                {shortenUid(recipient?.id)}
                {/* {recipient.bankName ? ` · ${recipient.bankName}` : ""} */}
              </p>
              <p className="text-xs text-text truncate border-l pl-3 border-input">
                XBanka User
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-4 space-y-8">
        <div className="space-y-4">
          {/* Amount input */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-text" label="Amount" />
            <div className="relative flex items-center rounded-xl border border-input bg-background py-3 px-4">
              <span className="absolute left-3.5 text-text font-semibold text-[24px] leading-8">
                ₦
              </span>
              <input
                className="flex h-14 w-full rounded-xl pl-6 pr-4 text-[36px] leading-11 font-bold text-text focus:outline-none transition-all"
                value={amount}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-text font-normal leading-4.5">
              <span className="font-normal text-xs leading-4.5">Minimum transfer: ₦{minTransfer.toLocaleString()}</span>
              <span className="bg-input-background py-2.5 px-4 rounded-lg">
                Balance: ₦
                {/* {balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })} */}
                {data?.data
                  ? `${sumFiatBalances(wallets).toLocaleString()}`
                  : "₦0.00"}
              </span>
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-4 flex-wrap">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q.toLocaleString())}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-xs font-medium border transition-colors",
                  numericAmount === q
                    ? "bg-Green/10 border-Green text-Green"
                    : "bg-background border-input text-text hover:border-Green/50",
                )}
              >
                ₦{q.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Narration */}
          <div className="space-y-2">
            <Label label="Narration (Optional)" />
            <Input
              placeholder="What's this for?"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Back
          </Button>
          <Button
            className="flex-3"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
