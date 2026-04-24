import { SAVED_BANKS, SAVED_CARDS } from "@/lib/wallet-page";
import { AddNewBankStep } from "./add-new-bank";
import { AddNewCardStep } from "./add-new-card";
import { ConfirmStep } from "../Wallet-Page/confirm-step";
import { EnterAmountStep } from "../Wallet-Page/enter-amount";
import { EnterPinStep } from "../Wallet-Page/enter-pin-step";
import { ProcessingStep } from "../Wallet-Page/processing-step";
import { SelectBankStep } from "../Wallet-Page/select-bank-step";
import { SelectCardStep } from "./select-card-step";
import { SelectMethodStep } from "./select-method-step";
import { SuccessStep } from "../Wallet-Page/success-step";
import { useState } from "react";
import { BankAccount, FundMethod } from "../Account-Page/types";
import { AddFundsModalProps, FundStep } from "../Wallet-Page/types";
import { UseGetBankAcounts } from "@/lib/services/wallet.service";

export function AddFundsModal({
  open,
  onClose,
  onSuccess,
}: AddFundsModalProps) {
  const [step, setStep] = useState<FundStep>("select_method");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    SAVED_CARDS[0].id,
  );

  if (!open) return null;
  const {
    data: bankAccountData,
    isPending: bankAccountPending,
    error: bankAccountError,
  } = UseGetBankAcounts();
  const linkedBanks = bankAccountData?.data?.data;

  const selectedBank: BankAccount =
    linkedBanks?.find((b: BankAccount) => b.id === selectedBankId);
  const selectedCard =
    SAVED_CARDS.find((c) => c.id === selectedCardId) ?? SAVED_CARDS[0];
  const source = method === "card" ? selectedCard : selectedBank;

  const reset = () => {
    setStep("select_method");
    setMethod("");
    setSelectedBankId(SAVED_BANKS[0].id);
    setSelectedCardId(SAVED_CARDS[0].id);
    setAmount("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleMethodContinue = () => {
    if (method === "bank") setStep("select_bank");
    if (method === "card") setStep("select_card");
  };

  const startProcessing = async () => {
    setStep("processing");
    // await new Promise((r) => setTimeout(r, 2500)); // replace with real mutate()
    // setStep("success");
  };

  // ── Bank flow ──
  if (step === "select_method")
    return (
      <SelectMethodStep
        selected={method}
        onSelect={setMethod}
        onClose={handleClose}
        onContinue={handleMethodContinue}
      />
    );
  if (step === "select_bank")
    return (
      <SelectBankStep
      loading={bankAccountPending}
      error={bankAccountError}
        linkedBanks={linkedBanks}
        selectedId={selectedBankId}
        onSelect={setSelectedBankId}
        onBack={() => setStep("select_method")}
        onClose={handleClose}
        onContinue={() => setStep("enter_amount_bank")}
        onAddNew={() => setStep("add_new_bank")}
      />
    );
  if (step === "add_new_bank")
    return (
      <AddNewBankStep
        onBack={() => setStep("select_bank")}
        onClose={handleClose}
        onSaved={() => setStep("select_bank")}
      />
    );
  if (step === "enter_amount_bank")
    return (
      <EnterAmountStep
        amount={amount}
        setAmount={setAmount}
        sourceLabel={selectedBank.bankName + " " + selectedBank.accountNumber}
        sourceName={selectedBank.accountName}
        onBack={() => setStep("select_bank")}
        onClose={handleClose}
        onContinue={() => setStep("confirm_bank")}
      />
    );
  if (step === "confirm_bank")
    return (
      <ConfirmStep
        amount={amount}
        sourceLabel={selectedBank.bankName + " " + selectedBank.accountNumber}
        accountName={selectedBank.accountName}
        fee="0.00"
        onBack={() => setStep("enter_amount_bank")}
        onClose={handleClose}
        onConfirm={() => setStep("enter_pin")}
      />
    );

  // ── Card flow ──
  if (step === "select_card")
    return (
      <SelectCardStep
        selectedId={selectedCardId}
        onSelect={setSelectedCardId}
        onBack={() => setStep("select_method")}
        onClose={handleClose}
        onContinue={() => setStep("enter_amount_card")}
        onAddNew={() => setStep("add_new_card")}
      />
    );
  if (step === "add_new_card")
    return (
      <AddNewCardStep
        onBack={() => setStep("select_card")}
        onClose={handleClose}
        onSaved={() => setStep("select_card")}
      />
    );
  if (step === "enter_amount_card")
    return (
      <EnterAmountStep
        amount={amount}
        setAmount={setAmount}
        sourceLabel={selectedCard.masked}
        sourceName={selectedCard.name}
        onBack={() => setStep("select_card")}
        onClose={handleClose}
        onContinue={() => setStep("confirm_card")}
      />
    );
  if (step === "confirm_card")
    return (
      <ConfirmStep
        amount={amount}
        sourceLabel={selectedCard.masked}
        accountName={selectedCard.name}
        fee="0.00"
        onBack={() => setStep("enter_amount_card")}
        onClose={handleClose}
        onConfirm={() => setStep("enter_pin")}
      />
    );

  // ── Shared final steps ──
  if (step === "enter_pin")
    return (
      <EnterPinStep
        onBack={() =>
          method === "card" ? setStep("confirm_card") : setStep("confirm_bank")
        }
        onClose={handleClose}
        onConfirm={startProcessing}
      />
    );
  if (step === "processing")
    return (
      <ProcessingStep
        amount={amount}
        mandateId={selectedBank.accountNumber}
        accountName={selectedBank.accountName}
        selectedCard={selectedCard}
        handleStep={setStep}
        sourceLabel={selectedCard.masked}
      />
    );
  // if (step === "processing")
  //   return (
  //     <ProcessingStep
  //       amount={amount}
  //       mandateId={selectedCard.id}
  //       accountName={selectedCard.name}
  //       selectedCard={selectedCard}
  //       handleStep={setStep}
  //       sourceLabel={selectedCard.masked}
  //     />
  //   );
  if (step === "success")
    return (
      <SuccessStep
        amount={amount}
        onDone={() => {
          onSuccess?.();
          handleClose();
        }}
        onAddMore={reset}
      />
    );

  return null;
}
