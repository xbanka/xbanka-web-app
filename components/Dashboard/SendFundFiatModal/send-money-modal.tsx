import { Modal } from "@/components/ui/Modal";
import { BankAccountStep } from "./bank-account-step";
import { EnterAmountStep } from "./enter-amount-step";
import { ModalHeader } from "@/components/ui/modal-header";
import { Recipient, SendMoneyModalProps, Step, Tab } from "./types";
import { useState } from "react";
import { SelectRecipientStep } from "./selectRecepient";
import { TabToggle } from "./tab-toggle";
import { SEND_STEP_LABELS, SEND_STEPS, TOTAL_SEND_STEPS } from "./mockData";
import { ProgressBar } from "./progress-bar";

export function SendMoneyModal({ onClose, onBack }: SendMoneyModalProps) {
  const [step, setStep] = useState<Step>("select-recipient");
  const [tab, setTab] = useState<Tab>("select-recipient");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  console.log(step, tab);

  const handleSelectXbanka = (r: Recipient) => {
    setRecipient(r);
    setStep("enter-amount");
  };

  const handleGoToBank = () => {
    setTab("bank-form");
    setStep("bank-form");
  };

  const handleBankFound = (r: Recipient) => {
    setRecipient(r);
    setStep("enter-amount");
  };

  const handleContinue = (amount: number, narration: string) => {
    // Hook into your payment submission logic here
    console.log("Send money", { recipient, amount, narration });
    onClose();
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
      { step === "select-recipient" || step === "bank-form" && <div className="px-8 pb-3">
        <TabToggle
          active={tab}
          onChange={(t) => {
            setTab(t);
            setStep(t === "bank-form" ? "bank-form" : "select-recipient");
          }}
        />
      </div>}
      <div className="px-0">
        {/* STEP 1 */}
        {step === "select-recipient" && tab === "select-recipient" && (
          <SelectRecipientStep
            onSelectXbanka={handleSelectXbanka}
            onSelectBank={handleGoToBank}
          />
        )}

        {step === "bank-form" && (
          <BankAccountStep
            onBack={() => {
              setStep("select-recipient");
              setTab("select-recipient");
            }}
            onFound={handleBankFound}
            onNotFound={() => {}}
          />
        )}

        {/* STEP 2 */}
        {step === "enter-amount" && recipient && (
          <EnterAmountStep
            recipient={recipient}
            onBack={() =>
              setStep(tab === "bank-form" ? "bank-form" : "select-recipient")
            }
            onContinue={handleContinue}
          />
        )}
      </div>
    </Modal>
  );
}
