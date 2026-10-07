import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { OtpInput } from "@/components/ui/otp-input";
import { UseConfirmNombaWithdrawal } from "@/lib/services/wallet.service";
import { useState } from "react";
import { ErrorField } from "@/components/ui/field-error";
import { ResetPinModal } from "@/components/Layout/ResetPinModal";
import { NombaWithdrawal } from "@/lib/types/wallet-types";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { CreatePinModal } from "@/components/Dashboard/Account-Page/create-pin-modal";
import {
  classifyWithdrawalError,
  confirmWithRetry,
  traceWithdrawal,
} from "@/lib/nomba-withdrawal";

const PIN_LENGTH = 4;

export const UNKNOWN_OUTCOME_MESSAGE =
  "We couldn't confirm your withdrawal. Check your transaction history before trying again.";

export function EnterPinStep({
  withdrawalToken,
  onBack,
  onClose,
  onExpired,
  onConfirmed,
}: {
  withdrawalToken: string;
  onBack: () => void;
  onClose: () => void;
  /** The withdrawal token is no longer valid; restart from initiate. */
  onExpired: (message: string) => void;
  onConfirmed: (withdrawal: NombaWithdrawal) => void;
}) {
  const [pin, setPin] = useState("");
  const [pinInputKey, setPinInputKey] = useState(0);
  const [openResetPin, setOpenResetPin] = useState(false);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: confirm } = UseConfirmNombaWithdrawal();
  const openBvn = useOnboardingModalStore((state) => state.openBvn);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage("");

    try {
      const withdrawal = await confirmWithRetry(
        () => confirm({ withdrawalToken, pin }),
        {
          onRetry: (attempt) => {
            traceWithdrawal({ event: "confirm_retry", attempt });
            setErrorMessage("Checking your withdrawal...");
          },
        },
      );
      traceWithdrawal({
        event: "confirm_succeeded",
        reference: withdrawal.reference,
        status: withdrawal.status,
      });
      onConfirmed(withdrawal);
    } catch (err) {
      const { kind, message } = classifyWithdrawalError(err);
      traceWithdrawal({ event: "confirm_failed", kind });
      setSubmitting(false);
      switch (kind) {
        case "expired":
          onExpired(message);
          return;
        case "tier-required":
          onClose();
          openBvn();
          return;
        case "pin-setup-required":
          // The digits typed were not a real PIN; start fresh once it's set.
          setErrorMessage(message);
          setPin("");
          setPinInputKey((k) => k + 1);
          setOpenCreatePin(true);
          return;
        case "pin-locked":
          setLocked(true);
          setErrorMessage(message);
          return;
        case "unknown-outcome":
          // Never report this as failed: the money may already have left.
          setErrorMessage(UNKNOWN_OUTCOME_MESSAGE);
          return;
        default:
          // Wrong PIN and other errors: clear the input and let them retry.
          setErrorMessage(message);
          setPin("");
          setPinInputKey((k) => k + 1);
          return;
      }
    }
  };

  const isComplete = pin.length >= PIN_LENGTH;
  const canSubmit = isComplete && !submitting && !locked;

  return (
    <Modal className="p-0" onClose={submitting ? () => {} : onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Enter PIN"
        subtitle="Enter your 4-digit transaction PIN to confirm this send."
        onBack={submitting ? undefined : onBack}
        onClose={submitting ? () => {} : onClose}
      />

      <div className="pt-6 px-10 pb-10 max-sm:px-5 max-sm:pb-6 max-sm:pt-2">
        <div className="py-4 space-y-5 max-sm:py-2 max-sm:space-y-4">
          <OtpInput
            key={pinInputKey}
            length={PIN_LENGTH}
            onChange={setPin}
            disabled={submitting || locked}
          />
          <div className="text-center flex justify-center">
            <ErrorField message={errorMessage} />
          </div>
          <div>
            <button
              onClick={() => setOpenResetPin(true)}
              className="text-xs font-normal leading-4.5 text-Green hover:underline transition-colors"
            >
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
            disabled={submitting}
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-3"
            disabled={!canSubmit}
            variant={canSubmit ? "default" : "disabled"}
            onClick={handleConfirm}
          >
            {submitting ? "Processing..." : "Withdraw"}
          </Button>
        </div>
        <ResetPinModal
          open={openResetPin}
          handleClose={() => setOpenResetPin(false)}
        />
        {openCreatePin && (
          <CreatePinModal
            open={openCreatePin}
            handleClose={() => setOpenCreatePin(false)}
          />
        )}
      </div>
    </Modal>
  );
}
