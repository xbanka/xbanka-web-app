import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { useState } from "react";

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

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Enter PIN"
        subtitle="Enter your 6-digit transaction PIN to confirm this send."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="pt-6 px-10 pb-10">
        <div className="py-4 space-y-5">
          <OtpInput length={6} onChange={setPin} onComplete={onConfirm} />
          <div className="">
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
            disabled={pin.length < 6}
            variant={pin.length >= 6 ? "default" : "disabled"}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
