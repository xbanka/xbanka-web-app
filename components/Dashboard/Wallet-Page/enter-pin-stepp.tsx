import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { OtpInput } from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "./progress-bar";

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
    <Modal onClose={onClose}>
      <ModalHeader title="Enter PIN" subtitle="Enter your 6-digit transaction PIN to confirm this send." onBack={onBack} onClose={onClose} />
      <ProgressBar step="confirm" />

      <div className="py-6 space-y-5">
        <OtpInput length={6} onChange={setPin} onComplete={onConfirm} />
        <div className="text-center">
          <button className="text-xs text-Green hover:underline transition-colors">
            Forgot PIN?
          </button>
        </div>
      </div>

      <div className="flex gap-3">
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
          className="flex-1"
          disabled={pin.length < 6}
          variant={pin.length >= 6 ? "default" : "disabled"}
          onClick={onConfirm}
        >
          Confirm Transaction
        </Button>
      </div>
    </Modal>
  );
}
