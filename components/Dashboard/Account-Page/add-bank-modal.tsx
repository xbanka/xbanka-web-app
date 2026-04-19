import { BankForm } from "@/lib/schema/bank-schema";
import { ConfirmStep } from "./confirm-step";
import { BankDetailsStep } from "./fund-bank-details-step";
import { LinkingStep } from "./linking-step";
import { SelectMethodStep } from "./select-method-step";
import { SuccessStep } from "./success-step";
import { useState } from "react";
import { AddBankModalProps, BankStep, FundMethod } from "./types";
import { UseAddBankAcounts } from "@/lib/services/wallet.service";

export function AddBankModal({ open, onClose, onSuccess }: AddBankModalProps) {
  const [step, setStep] = useState<BankStep>("select");
  const [method, setMethod] = useState<FundMethod>(null);
  const [formData, setFormData] = useState<BankForm | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    mutateAsync: addBankAccountsMutate,
    error: addBankError,
    isPending: isAddingBank,
  } = UseAddBankAcounts();

  if (!open) return null;

  const reset = () => {
    setStep("select");
    setMethod(null);
    setFormData(null);
    setIsPending(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleContinueFromSelect = () => {
    if (method === "bank") setStep("details");
    // extend here for card flow
  };

  const handleDetailsSubmit = (data: BankForm) => {
    setFormData(data);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setIsPending(true);
    setStep("linking");
    // Replace with your real API call
    await new Promise((r) => setTimeout(r, 2000));
    const payload = {
      bankName: formData?.bankName || "",
      accountNumber: formData?.accountNumber || "",
      accountName: formData?.accountName || "",
    };
    await addBankAccountsMutate(payload, {
      onSuccess: (res) => {
        console.log("Bank account added successfully", res);
      },
      onError: (err) => {
        console.error("Failed to add bank account", err);
        setIsPending(false);
        setStep("confirm");
      },
    });
    setIsPending(false);
    setStep("success");
  };

  const handleAddAnother = () => {
    reset();
  };

  const handleDone = () => {
    onSuccess?.();
    handleClose();
  };

  if (step === "select") {
    return (
      <SelectMethodStep
        selected={method}
        onSelect={setMethod}
        onClose={handleClose}
        onContinue={handleContinueFromSelect}
      />
    );
  }

  if (step === "details") {
    return (
      <BankDetailsStep
        onBack={() => setStep("select")}
        onClose={handleClose}
        onContinue={handleDetailsSubmit}
      />
    );
  }

  if (step === "confirm" && formData) {
    return (
      <ConfirmStep
        formData={formData}
        onBack={() => setStep("details")}
        onClose={handleClose}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    );
  }

  if (step === "linking") {
    return <LinkingStep onClose={handleClose} />;
  }

  if (step === "success") {
    return <SuccessStep onDone={handleDone} onAddAnother={handleAddAnother} />;
  }

  return null;
}
