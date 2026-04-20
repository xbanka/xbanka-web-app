import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Building2, Lock, X } from "lucide-react";
import { FundMethod } from "./types";

export function SelectMethodStep({
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
      // card icon inline svg to avoid extra dep
      icon: null,
    },
  ];
 
  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-4">
        <h3 className="text-lg font-semibold text-card-text">Add Funds</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
 
      <p className="text-sm text-text mb-5">
        Select a funding method to add money to your wallet.
      </p>
 
      <div className="space-y-3">
        {methods.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${
                active
                  ? "border-Green bg-Green/5"
                  : "border-border hover:border-border-active"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  active ? "bg-Green text-white" : "bg-border text-card-text"
                }`}
              >
                {m.icon ? (
                  <m.icon className="w-4 h-4" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-text">{m.label}</p>
                <p className="text-xs text-text mt-0.5 leading-relaxed">{m.desc}</p>
              </div>
              {/* Radio */}
              <div
                className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                  active ? "border-Green" : "border-text"
                }`}
              >
                {active && <div className="w-2 h-2 rounded-full bg-Green" />}
              </div>
            </button>
          );
        })}
      </div>
 
      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-text mt-4">
        <Lock className="w-3.5 h-3.5 shrink-0 text-Green" />
        <span>Secure, 256-bit encrypted connection</span>
      </div>
 
      <Button
        size="lg"
        className="w-full mt-6"
        disabled={!selected}
        variant={selected ? "default" : "disabled"}
        onClick={onContinue}
      >
        Continue
      </Button>
    </Modal>
  );
}