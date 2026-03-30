"use client"
import { useState } from "react";
import { BankAccountForm } from "./bank-account-form";
import { DebitCardForm } from "./debit-card-modal";
import { SelectMethod } from "./select-method";

export interface AddFundsModalProps {
    open: boolean, 
    onClose: () => void, 
    onSuccess: () => void
}

export function AddFundsModal({ open, onClose, onSuccess }: AddFundsModalProps) {
  const [step, setStep] = useState<FundStep>("select");
  const [method, setMethod] = useState<FundMethod>(null);
 
  if (!open) return null;
 
  const handleClose = () => {
    setStep("select");
    setMethod(null);
    onClose();
  };
 
  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };
 
  const handleContinue = () => {
    if (method === "bank") setStep("bank");
    if (method === "card") setStep("card");
  };
 
  if (step === "select") {
    return (
      <SelectMethod
        selected={method}
        onSelect={setMethod}
        onClose={handleClose}
        onContinue={handleContinue}
      />
    );
  }
 
  if (step === "bank") {
    return (
      <BankAccountForm
        onBack={() => setStep("select")}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );
  }
 
  if (step === "card") {
    return (
      <DebitCardForm
        onBack={() => setStep("select")}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );
  }
 
  return null;
}