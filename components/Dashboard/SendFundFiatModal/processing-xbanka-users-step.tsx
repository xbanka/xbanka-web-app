import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { LucideArrowLeftRight } from "lucide-react";
import { useEffect } from "react";
import { Step, XbankaTransferRecipient } from "./types";
import { useTransferFiatToXbankaUsers } from "@/lib/services/send-fiat.service";

export function ProcessingXbankaStep({
  handleStep,
  recipient,
  setReference,
  setMessage,
}: {
  amount: string;
  savedCardId?: string;
  setReference: (data: string) => void;
  setMessage: (data: string) => void;
  mandateId?: string;
  accountName: string;
  handleStep: (value: Step) => void;
  recipient: XbankaTransferRecipient;
}) {
  const { mutate } = useTransferFiatToXbankaUsers();

  useEffect(() => {
    if (!recipient) return;

    mutate(
      {
        targetUserId: recipient.id,
        amount: recipient.amount || 0,
      },
      {
        onSuccess: (result) => {
          setReference(result.data.transactions[0].reference);
          setMessage(result.data.message);
          handleStep("success");
        },
        onError: () => {
          handleStep("enter_pin_xbanka");
        },
      },
    );
  }, []);
  return (
    <Modal
      className="pt-10 pb-10 space-y-6 max-sm:px-5 max-sm:pt-8 max-sm:pb-8"
      onClose={() => {}}
    >
      <div className="flex flex-col items-center gap-6 text-center max-sm:gap-4">
        <Spinner icon={LucideArrowLeftRight} size={52} />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[20px] max-sm:leading-7">
            Processing your request...
          </h3>
          <p className="text-base font-normal leading-6 text-text max-sm:text-sm max-sm:leading-5">
            This usually takes a few seconds. Please don't close this window
          </p>
        </div>
      </div>
    </Modal>
  );
}
