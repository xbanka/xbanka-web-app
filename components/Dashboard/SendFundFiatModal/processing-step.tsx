import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { UseFundBankAcounts, UseSendFiatWallet } from "@/lib/services/wallet.service";
import { LucideArrowLeftRight } from "lucide-react";
import { useEffect } from "react";
import { FundStep } from "../Wallet-Page/types";
import { Recipient, Step } from "./types";

export function ProcessingStep({
  amount,
  mandateId,
  handleStep,
  recipient
}: {
  amount: string;
  savedCardId?: string;
  mandateId?: string;
  accountName: string;
  handleStep: (value: Step) => void;
  recipient: Recipient
}) {
  const { mutate, isPending, error } = UseSendFiatWallet();

  useEffect(() => {
    console.log("selectedCard", amount)
    if (!mandateId || !amount) return
    const mainAmount = Number(amount.replace(/,/g, ""));
    if(!recipient) return
    console.log("payload", recipient)
    mutate(recipient, {
      onSuccess: () => {
        handleStep("success");
      },
      onError: () => {
        handleStep("enter_pin");
      },
    });
  }, [mandateId, amount]);
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
