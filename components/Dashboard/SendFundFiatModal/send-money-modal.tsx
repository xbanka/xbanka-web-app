import { Modal } from "@/components/ui/Modal";
import { BankAccountStep } from "./bank-account-step";
import { EnterAmountStep } from "./enter-amount-step";
import { ModalHeader } from "@/components/ui/modal-header";
import {
  Recipient,
  RecipientXbankaUsersTypes,
  SendMoneyModalProps,
  Step,
  Tab,
} from "./types";
import { useState } from "react";
import { SelectRecipientStep } from "./selectRecepient";
import { TabToggle } from "./tab-toggle";
import { ConfirmStep } from "./confirm-step";
import { EnterPinStep } from "./enter-pin-step";
import { ProcessingStep } from "./processing-step";
import { SuccessStep } from "./success-step";

export function SendMoneyModal({ onClose, onBack }: SendMoneyModalProps) {
  const [step, setStep] = useState<Step>("select-recipient");
  const [tab, setTab] = useState<Tab>("select-recipient"); // rename this
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  // accountNumber: "0123456789",
  //      bankCode: "058",
  //      bankName:"United Bank For Africa",
  //      accountName: "JOHN DOE",
  //      amount: 5000,
  //      narration: "One-off payment to John"
  const [XbankaRecipient, setXbankaRecipient] =
    useState<RecipientXbankaUsersTypes | null>(null);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setStep("select-recipient");
    setRecipient(null);
  };

  const handleSelectXbanka = (r: RecipientXbankaUsersTypes) => {
    setXbankaRecipient(r);
    setStep("enter-amount");
  };

  const handleBankFound = (r: Recipient) => {
    setRecipient(r);
    setStep("enter-amount");
  };

  const handleGoToBank = () => {
    setTab("bank-form");
    setStep("bank-form");
  };

  const handleContinue = (updatedRecipient: Recipient) => {
    setRecipient(updatedRecipient);
    setStep("confirm_bank");

    console.log("Final Data for Backend:", updatedRecipient);
  };

  const reset = () => {
    setStep("select-recipient");
    setTab("select-recipient");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const startProcessing = async () => {
    setStep("processing");
    // await new Promise((r) => setTimeout(r, 2500)); // replace with real mutate()
    // setStep("success");
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        title="Send Money"
        subtitle="Send money to your friends and family quickly and securely"
        onBack={
          step === "bank-form"
            ? () => setStep("select-recipient")
            : step === "enter-amount"
              ? () =>
                  setStep(
                    tab === "bank-form" ? "bank-form" : "select-recipient",
                  )
              : onBack
        }
        onClose={onClose}
        className="px-8 py-6"
      />
      {/* <div className="px-8 pb-3">
        <ProgressBar
          stepMap={SEND_STEPS}
          totalSteps={TOTAL_SEND_STEPS}
          labels={SEND_STEP_LABELS}
          step={step}
        />
      </div> */}
      {step === "select-recipient" && (
        <div className="px-8 pb-3">
          <TabToggle active={tab} onChange={handleTabChange} />
        </div>
      )}
      <div className="px-0">
        {/* STEP 1 */}
        {step === "select-recipient" && tab === "select-recipient" && (
          <SelectRecipientStep
            onSelectXbanka={handleSelectXbanka}
            onSelectBank={() => handleTabChange("bank-form")}
          />
        )}
        {step === "select-recipient" && tab === "bank-form" && (
          <BankAccountStep
            setStep={setStep}
            setRecipient={setRecipient}
            recipient={recipient}
            onBack={() => handleTabChange("xbanka")}
            onFound={handleBankFound}
            onNotFound={() => {}}
          />
        )}
        {/* STEP 2 */}
        {step === "enter-amount" && recipient && (
          <EnterAmountStep
            recipient={recipient}
            onBack={() =>
              setStep(
                tab === "select-recipient" ? "select-recipient" : "bank-form",
              )
            }
            onContinue={handleContinue} // This now receives the full object
          />
        )}
        {step === "confirm_bank" && recipient && (
          <ConfirmStep
            amount={
              recipient?.amount.toString() ? recipient?.amount.toString() : "0"
            }
            sourceLabel={recipient.bankName + " " + recipient.accountNumber}
            accountName={recipient.accountName}
            fee="0.00"
            onBack={() => setStep("enter-amount")}
            onClose={handleClose}
            onConfirm={() => setStep("enter_pin")}
          />
        )}
        {step === "enter_pin" && recipient && (
          <EnterPinStep
            onBack={() => setStep("confirm_bank")}
            onClose={handleClose}
            onConfirm={startProcessing}
          />
        )}
        {step === "processing" && recipient && (
          <ProcessingStep
            recipient={recipient}
            amount={
              recipient?.amount.toString() ? recipient?.amount.toString() : "0"
            }
            mandateId={recipient.accountNumber}
            accountName={recipient.accountName}
            handleStep={setStep}
          />
        )}
        {step === "success" && recipient && (
          <SuccessStep
            amount={recipient.amount.toString() ?? "0"}
            // recipient={recipient}
            onDone={() => {
              // onSuccess?.();
              handleClose();
            }}
            onAddMore={reset}
          />
        )}
      </div>
    </Modal>
  );
}
