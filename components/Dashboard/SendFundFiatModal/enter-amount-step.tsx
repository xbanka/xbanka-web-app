import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Recipient, Step } from "./types";
import { AvatarCircle } from "./avatarCircle";
import { QUICK_AMOUNTS } from "./mockData";
import { cn } from "@/lib/utils";

export function EnterAmountStep({
  recipient,
  onBack,
  onContinue,
}: {
  recipient: Recipient;
  onBack: () => void;
  onContinue: (Recipient: Recipient) => void;
}) {
  const [amount, setAmount] = useState("20,000");
  const [narration, setNarration] = useState("");

  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const balance = 4250890.5;
  const minTransfer = 5000;

  const formatAmount = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString() : "";
  };

  const isValid = numericAmount >= minTransfer && numericAmount <= balance;

  const handleContinue = () => {
    // We spread the existing recipient and add the new amount/narration
    const updatedRecipient: Recipient = {
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
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-background">
          <AvatarCircle name={recipient.bankName} color="bg-orange-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-text truncate">
              {recipient.accountName}
            </p>
            <p className="text-xs text-text truncate">
              {recipient.accountNumber}
              {recipient.bankName ? ` · ${recipient.bankName}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-4 space-y-8">
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
              onChange={(e) => setAmount(formatAmount(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="flex justify-between text-xs text-text">
            <span>Minimum transfer: ₦{minTransfer.toLocaleString()}</span>
            <span>
              Balance: ₦
              {balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 flex-wrap">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(q.toLocaleString())}
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
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={onBack}>
            Back
          </Button>
          <Button
            className="flex-1"
            disabled={!isValid}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
