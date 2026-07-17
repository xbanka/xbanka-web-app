import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { useValidatePin } from "@/lib/services/security.service";
import { useState } from "react";
import { FundStep } from "../Wallet-Page/types";
import { ErrorLayout } from "@/components/ui/error-layout";
import { ResetPinModal } from "@/components/Layout/ResetPinModal";

export function EnterPinXbankaStep({
  onBack,
  onClose,
  onConfirm,
}: {
  onBack: () => void;
  onClose: () => void;
  onConfirm: (value: FundStep) => void;
}) {
  const [pin, setPin] = useState("");
  const [openResetPin, setOpenResetPin] = useState(false);
  const { mutate, isPending, error } = useValidatePin();

  const handleConfirm = () => {
    // call API here with pin
    const payload = {
      pin,
    };
    mutate(payload, {
      onSuccess: () => {
        onConfirm("processing");
      },
    });
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Enter PIN"
        subtitle="Enter your 4-digit transaction PIN to confirm this send."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="pt-6 px-10 pb-10">
        <div className="py-4 space-y-5">
          <OtpInput length={4} onChange={setPin} />
          <div className="text-center flex justify-center">
            <ErrorLayout message={error?.message} />
          </div>
          <div className="">
            <button onClick={() => setOpenResetPin(true)} className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors">
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
            // variant={pin.length >= 4 ? "default" : isPending ? "disabled" : "disabled"}
            variant={
              isPending ? "disabled" : pin.length >= 4 ? "default" : "disabled"
            }
            onClick={handleConfirm}
          >
            {isPending ? "Validating..." : "Confirm"}
          </Button>
        </div>
        <ResetPinModal
          open={openResetPin}
          handleClose={() => setOpenResetPin(false)}
        />
      </div>
    </Modal>
  );
}
