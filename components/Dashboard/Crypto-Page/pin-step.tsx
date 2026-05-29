import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { useValidatePin } from "@/lib/services/security.service";
import { useState } from "react";

export function PinStep({
  mode,
  onBack,
  onClose,
  onConfirmed,
}: {
  mode: "BUY" | "SELL";
  onBack: () => void;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const [pin, setPin] = useState("");
  const { mutate, isPending, error } = useValidatePin();
 
  const handleConfirm = () => {
    mutate(
      { pin },
      {
        onSuccess: () => {
          onConfirmed();
        },
      }
    );
  };
 
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Enter PIN"
        subtitle={`Enter your 4-digit transaction PIN to confirm this ${mode === "BUY" ? "purchase" : "sale"}.`}
        onBack={onBack}
        onClose={onClose}
      />
 
      <div className="pt-6 px-10 pb-10">
        <div className="py-4 space-y-5">
          <OtpInput length={4} onChange={setPin} />
          <div className="text-center flex justify-center">
            <ErrorField message={error?.message} />
          </div>
          <div>
            <button className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors">
              Forgot PIN?
            </button>
          </div>
        </div>
 
        <div className="flex gap-4 mt-4">
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
            disabled={pin.length < 4 || isPending}
            variant={pin.length >= 4 && !isPending ? "default" : "disabled"}
            onClick={handleConfirm}
          >
            {isPending ? "Verifying..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}