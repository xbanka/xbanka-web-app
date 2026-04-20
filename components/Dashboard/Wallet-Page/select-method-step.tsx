import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { Building2, CreditCard, Lock } from "lucide-react";
import { FundMethod } from "../Account-Page/types";

export function SelectMethodStep({
  selected, onSelect, onClose, onContinue,
}: {
  selected: FundMethod;
  onSelect: (m: FundMethod) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const methods = [
    { id: "bank" as FundMethod, label: "Bank Account", desc: "Pay directly from your bank account. Takes 1-3 business days.", Icon: Building2 },
    { id: "card" as FundMethod, label: "Debit Card", desc: "Use your debit card for instant funding. 1.5% fee applies.", Icon: CreditCard },
  ];
 
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Add Funds" onClose={onClose} />
      <p className="text-sm text-text mb-5">Select a funding method to add money to your wallet.</p>
 
      <div className="space-y-3">
        {methods.map(({ id, label, desc, Icon }) => {
          const active = selected === id;
          return (
            <button key={id} onClick={() => onSelect(id)}
              className={cn(
                "w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-colors",
                active ? "border-Green bg-Green/5" : "border-border hover:border-border-active"
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", active ? "bg-Green text-white" : "bg-border text-card-text")}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-text">{label}</p>
                <p className="text-xs text-text mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <div className={cn("w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center", active ? "border-Green" : "border-text")}>
                {active && <div className="w-2 h-2 rounded-full bg-Green" />}
              </div>
            </button>
          );
        })}
      </div>
 
      <div className="flex items-center gap-2 text-xs text-text mt-4">
        <Lock className="w-3.5 h-3.5 text-Green shrink-0" />
        <span>Secure, 256-bit encrypted connection</span>
      </div>
 
      <Button size="lg" className="w-full mt-6" disabled={!selected}
        variant={selected ? "default" : "disabled"} onClick={onContinue}>
        Continue
      </Button>
    </Modal>
  );
}