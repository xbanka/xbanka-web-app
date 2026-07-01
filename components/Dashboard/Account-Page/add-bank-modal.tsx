import { BankForm, bankOptions } from "@/lib/schema/bank-schema";
import { ConfirmStep } from "./confirm-step";
import { BankDetailsStep } from "./fund-bank-details-step";
import { LinkingStep } from "./linking-step";
import { SelectMethodStep } from "./select-method-step";
import { SuccessStep } from "./success-step";
import { useState } from "react";
import { AddBankModalProps, BankStep, FundMethod } from "./types";
import { UseAddBankAcounts, UseGetAllBanks } from "@/lib/services/wallet.service";

export function AddBankModal({ open, onClose, onSuccess }: AddBankModalProps) {
  const [step, setStep] = useState<BankStep>("select");
  const [method, setMethod] = useState<FundMethod>(null);
  const [formData, setFormData] = useState<BankForm | null>(null);
  const {
    mutateAsync: addBankAccountsMutate,
    error: addBankError,
    isPending: isAddingBank,
  } = UseAddBankAcounts();
  const { data: banksResponse } = UseGetAllBanks();
  const rawBanks = banksResponse?.data?.data || [];

  if (!open) return null;

  const reset = () => {
    setStep("select");
    setMethod(null);
    setFormData(null);
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
    console.log("Bank details submitted", data);
    setFormData(data);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setStep("linking");
    
    // formData.bankName actually contains the bank.code now!
    const selectedBankCode = formData?.bankName || "";
    // find the real bank name from rawBanks
    const realBankName = rawBanks.find((b: any) => b.code === selectedBankCode)?.name || "";

    const payload = {
      bankName: realBankName,
      accountNumber: formData?.accountNumber || "",
      accountName: formData?.accountName || "",
      bankCode: selectedBankCode,
    };
    await addBankAccountsMutate(payload, {
      onSuccess: () => {
        setStep("success");
      },
      onError: (err) => {
        setStep("confirm");
      },
    });
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
        isPending={isAddingBank}
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
