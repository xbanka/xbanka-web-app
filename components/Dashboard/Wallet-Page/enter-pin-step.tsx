import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { useState } from "react";

export function EnterPinStep({
  onBack, onClose, onConfirm,
}: {
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [pin, setPin] = useState("");
 
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Enter PIN" onBack={onBack} onClose={onClose} />
 
      <div className="py-4 space-y-5">
        <p className="text-sm text-text text-center">Enter your 6-digit transaction PIN to complete this funding.</p>
        <OtpInput length={6} onChange={setPin} onComplete={onConfirm} />
        <div className="text-center">
          <button className="text-xs text-Green hover:underline transition-colors">Forgot PIN?</button>
        </div>
      </div>
 
      <div className="flex gap-3 mt-4">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button size="lg" className="flex-1" disabled={pin.length < 6}
          variant={pin.length >= 6 ? "default" : "disabled"} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}