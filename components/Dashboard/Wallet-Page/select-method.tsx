import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { Building2, CreditCard, Lock } from "lucide-react";
import { CloseBtn } from "./verify-bvn-modal";

export function SelectMethod({
  selected,
  onSelect,
  onClose,
  onContinue,
}: {
  selected: FundMethod;
  onSelect: (m: FundMethod) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const methods = [
    {
      id: "bank" as FundMethod,
      label: "Bank Account",
      desc: "Pay directly from your bank account. Takes 1-3 business days.",
      icon: Building2,
    },
    {
      id: "card" as FundMethod,
      label: "Debit Card",
      desc: "Use your debit card for instant funding. 1.5% fee applies.",
      icon: CreditCard,
    },
  ];
 
  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <div className="py-6">
          <div>
            <h1 className="font-semibold leading-8 text-2xl text-card-text">Add Funds</h1>
            <p className="text-[16px] font-normal text-text">
              Select a funding method to add money to your wallet.
            </p>
          </div>
          <CloseBtn onClose={onClose} />
        </div>
 
        <div className="space-y-2.5">
          {methods.map((m) => {
            const Icon = m.icon;
            const active = selected === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-colors",
                  active
                    ? "border-Green bg-Green/5"
                    : "border-border hover:border-border-active"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    active
                      ? "bg-Green text-white"
                      : "bg-border text-card-text"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-text">
                    {m.label}
                  </p>
                  <p className="text-xs text-text mt-0.5 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                {/* Radio dot */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                    active
                      ? "border-Green"
                      : "border-text"
                  )}
                >
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-Green" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
 
        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-text">
          <Lock className="w-3.5 h-3.5 shrink-0 text-Green" />
          <span>Secure, 256-bit encrypted connection</span>
        </div>
 
        <div className="flex gap-3 pt-1">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-1"
            disabled={!selected}
            variant={selected ? "default" : "disabled"}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}