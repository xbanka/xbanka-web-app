import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import {
  UseFundBankAcounts,
  UseSendFiatWallet,
} from "@/lib/services/wallet.service";
import { LucideArrowLeftRight } from "lucide-react";
import { useEffect } from "react";
import { FundStep } from "../Wallet-Page/types";
import { Recipient, Step, XbankaTransferRecipient } from "./types";
import { useTransferFiatToXbankaUsers } from "@/lib/services/send-fiat.service";

export function ProcessingXbankaStep({
  amount,
  mandateId,
  handleStep,
  recipient,
  setReference,
  setMessage
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
  const { mutate, isPending, error } = useTransferFiatToXbankaUsers();

  useEffect(() => {
    if (!recipient) return;

    mutate(
      {
        targetUserId: recipient.id,
        amount: recipient.amount || 0,
      },
      {
        onSuccess: (result) => {
          console.log("Transfer successful, reference:", result);
          console.log("Transfer successful, reference:", result.data.transactions[0].reference);
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
    <Modal className="pt-6 space-y-6" onClose={() => {}}>
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner icon={LucideArrowLeftRight} size={52} />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            Processing your request...
          </h3>
          <p className="text-base font-normal leading-6 text-text">
            This usually takes a few seconds. Please don't close this window
          </p>
        </div>
      </div>
    </Modal>
  );
}
