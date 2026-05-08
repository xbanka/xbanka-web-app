import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { RevokeSessionModalProps } from "./types";
import { SuccessState } from "../Onboarding-Journey-Modal/success-state";
import { useState } from "react";
import { useRevokeSessions } from "@/lib/services/security.service";

export const RemoveSessionModal = ({
  open,
  onClose,
  deviceId,
}: RevokeSessionModalProps) => {
  const [success, setSuccess] = useState(false);
    const {
    mutate: revokeSessionsMutate,
    isPending: revokeLoading,
    error: revokeError,
  } = useRevokeSessions();

  if (!open) return null;

  const handleRevoke = async () => {
    if (!deviceId) return;

    revokeSessionsMutate(deviceId, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (e) => {
        setSuccess(false);
      },
    });
  };

  if (success) {
    return (
      <Modal onClose={onClose}>
        <SuccessState
          title="Session Revoked"
          subtitle="This session has been successfully revoked."
          badge="verified"
          ctaLabel="Done"
          onCta={onClose}
          onClose={onClose}
        />
      </Modal>
    );
  }
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title="Remove Session"
        subtitle="Remove this session from your account."
        onClose={onClose}
      />
      <div className="space-y-6 px-8 pb-8 pt-6">
        <div className="text-center space-y-2">
          <h1 className="font-semibold text-2xl leading-8 text-card-text">
            Are you sure you want to remove this session?
          </h1>
          <p className="font-normal text-base leading-6 text-text">
            Remove this session from your account. You will need to log in again
            on this device to regain access.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-1">
          <Button
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Back
          </Button>
          <Button onClick={handleRevoke} size="lg" className="flex-3" type="submit">
            Revoke
          </Button>
        </div>
      </div>
    </Modal>
  );
};
