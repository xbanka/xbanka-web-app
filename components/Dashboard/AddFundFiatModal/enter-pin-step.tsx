import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { useValidatePin } from "@/lib/services/security.service";
import { useState } from "react";
import { FundStep } from "../Wallet-Page/types";
import { ErrorField } from "@/components/ui/field-error";

const PIN_LENGTH = 4;

export function EnterPinStep({
  onBack,
  onClose,
  onConfirm,
}: {
  onBack: () => void;
  onClose: () => void;
  onConfirm: (value: FundStep) => void;
}) {
  const [pin, setPin] = useState("");
  const { mutate, isPending, error } = useValidatePin();

  const handleConfirm = () => {
    const payload = { pin };
    mutate(payload, {
      onSuccess: () => {
        onConfirm("processing");
      },
    });
  };

  const isComplete = pin.length >= PIN_LENGTH;

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Enter PIN"
        subtitle="Enter your 6-digit transaction PIN to confirm this send."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="pt-6 px-10 pb-10 max-sm:px-5 max-sm:pb-6 max-sm:pt-2">
        <div className="py-4 space-y-5 max-sm:py-2 max-sm:space-y-4">
          <OtpInput length={PIN_LENGTH} onChange={setPin} />
          <div className="text-center flex justify-center">
            <ErrorField message={error?.message} />
          </div>
          <div>
            <button className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors">
              Forgot PIN?
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-4 max-sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-3"
            disabled={!isComplete || isPending}
            variant={isComplete && !isPending ? "default" : "disabled"}
            onClick={handleConfirm}
          >
            Confirm Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
