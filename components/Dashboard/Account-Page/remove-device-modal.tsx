import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { RemoveDeviceModalProps } from "./types";
import { useState } from "react";
import { useRemoveDevice } from "@/lib/services/security.service";
import { ErrorField } from "@/components/ui/field-error";

export const RemoveDeviceModal = ({
  open,
  onClose,
  deviceId,
}: RemoveDeviceModalProps) => {
  const [success, setSuccess] = useState(false);

   const {
    mutate: removeDeviceMutate,
    isPending: removeLoading,
    error: removeError,
  } = useRemoveDevice();

  if (!open) return null;

  const handleRemove = async () => {
    if (!deviceId) return;

    removeDeviceMutate(deviceId, {
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (e) => {
        setSuccess(false);
      },
    });
  };
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title="Remove Device"
        subtitle="Remove this device from your account."
        onClose={onClose}
      />
      <div className="space-y-6 px-8 pb-8 pt-6">
        <div className="text-center space-y-2">
          <h1 className="font-semibold text-2xl leading-8 text-card-text">
            Are you sure you want to remove this device?
          </h1>
          <p className="font-normal text-base leading-6 text-text">
            Remove this device from your account. You will need to log in again
            on this device to regain access.
          </p>
        </div>
        <ErrorField message={removeError?.message} />
        <div className="flex flex-col md:flex-row gap-4 mt-1">
          <Button
            onClick={() => {}}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleRemove}
            size="lg"
            className="flex-3"
            disabled={removeLoading}
          >
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
};
