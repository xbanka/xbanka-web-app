import { Modal } from "@/components/ui/Modal";
import { BankAccountStep } from "./bank-account-step";
import { EnterAmountStep } from "./enter-amount-step";
import { ModalHeader } from "@/components/ui/modal-header";
import {
  Recipient,
  SendMoneyModalProps,
  Step,
  Tab,
  XbankaTransferRecipient,
} from "./types";
import { useState } from "react";
import { SelectRecipientStep } from "./selectRecepient";
import { TabToggle } from "./tab-toggle";
import { ConfirmStep } from "./confirm-step";
import { EnterPinStep } from "./enter-pin-step";
import { ProcessingStep } from "./processing-step";
import { SuccessStep } from "./success-step";
import { EnterAmountXbankaStep } from "./enter-amount-xbanka-users";
import { ConfirmXbankaUserStep } from "./confirm-step-xbanka-users";
import { EnterPinXbankaStep } from "./enter-pin-xbanka-users";
import { ProcessingXbankaStep } from "./processing-xbanka-users-step";

export function SendMoneyModal({ onClose, onBack }: SendMoneyModalProps) {
  const [step, setStep] = useState<Step>("select-recipient");
  const [tab, setTab] = useState<Tab>("select-recipient"); // rename this
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [xbankaRecipient, setXbankaRecipient] =
    useState<XbankaTransferRecipient | null>(null);

  const showTabs = step === "select-recipient";

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setStep("select-recipient");
    setRecipient(null);
  };

  const handleSelectXbanka = (r: XbankaTransferRecipient) => {
    setXbankaRecipient(r);
    setStep("enter-amount-xbanka");
  };

  const handleBankFound = (r: Recipient) => {
    setRecipient(r);
    setStep("enter-amount");
  };

  const handleGoToBank = () => {
    setTab("bank-form");
    setStep("select-recipient");
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
  const startXbankaUsersProcessing = async () => {
    setStep("processing-xbanka-users");
    // await new Promise((r) => setTimeout(r, 2500)); // replace with real mutate()
    // setStep("success");
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        title="Send Money"
        subtitle="Send money to your friends and family quickly and securely"
        onBack={() => {
          if (tab === "bank-form") {
            setStep("select-recipient");
          } else {
            setStep("select-recipient");
          }
        }}
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
      {showTabs && (
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
            onBack={() => handleTabChange("select-recipient")}
            onFound={handleBankFound}
            onNotFound={() => {}}
          />
        )}
        {/* STEP 2 */}
        {step === "enter-amount" && recipient && (
          <EnterAmountStep
            recipient={recipient}
            onBack={() => {
              if (tab === "bank-form") {
                setStep("select-recipient");
              } else {
                setStep("select-recipient");
              }
            }}
            onContinue={handleContinue} // This now receives the full object
          />
        )}
        {step === "enter-amount-xbanka" && xbankaRecipient && (
          <EnterAmountXbankaStep
            recipient={xbankaRecipient}
            onBack={() => setStep("select-recipient")}
            onContinue={(updatedRecipient) => {
              setXbankaRecipient(updatedRecipient);
              setStep("confirm-xbanka");
            }}
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
        {step === "confirm-xbanka" && xbankaRecipient && (
          <ConfirmXbankaUserStep
            amount={xbankaRecipient.amount?.toString() || "0"}
            sourceLabel={xbankaRecipient.uid}
            accountName={xbankaRecipient.name}
            fee="0.00"
            onBack={() => setStep("enter-amount-xbanka")}
            onClose={handleClose}
            onConfirm={() => setStep("enter_pin_xbanka")}
          />
        )}
        {step === "enter_pin" && recipient && (
          <EnterPinStep
            onBack={() => setStep("confirm_bank")}
            onClose={handleClose}
            onConfirm={startProcessing}
          />
        )}
        {step === "enter_pin_xbanka" && xbankaRecipient && (
          <EnterPinXbankaStep
            onBack={() => setStep("confirm-xbanka")}
            onClose={handleClose}
            onConfirm={startXbankaUsersProcessing}
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
        {step === "processing-xbanka-users" && xbankaRecipient && (
          <ProcessingXbankaStep
            recipient={xbankaRecipient}
            amount={
              xbankaRecipient?.name.toString()
                ? xbankaRecipient?.id.toString()
                : "0"
            }
            mandateId={xbankaRecipient.uid}
            accountName={xbankaRecipient.name}
            handleStep={setStep}
          />
        )}
        {step === "success" && (recipient || xbankaRecipient) && (
          <SuccessStep
            amount={
              recipient?.amount.toString() ??
              xbankaRecipient?.amount?.toString() ??
              "0"
            }
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
