import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { OtpInput } from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { useValidatePin } from "@/lib/services/security.service";
import { ErrorField } from "@/components/ui/field-error";

export function EnterPinStep({
  onBack,
  onClose,
  onConfirm,
}: {
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [pin, setPin] = useState("");
    const {mutate, isPending, error} = useValidatePin()
  
    const handleConfirm = () => {
      // call API here with pin
      const payload = {
        pin
      }
      mutate(payload, {
        onSuccess: () => {
          onConfirm();
        }
      })
    };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10"
        title="Enter PIN"
        subtitle="Enter your 6-digit transaction PIN to confirm this send."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-6 space-y-8">
        <div className="space-y-2">
          <OtpInput length={4} onChange={setPin} />
          <div className="text-left">
            <button className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors">
              Forgot PIN?
            </button>
          </div>
          <ErrorField message={error?.message} />
        </div>

        <div className="flex gap-4">
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
            variant={pin.length >= 4 ? "default" : isPending ? "disabled" : "disabled"}
            onClick={handleConfirm}
          >
            Confirm Transaction
          </Button>
        </div>
      </div>
    </Modal>
  );
}
