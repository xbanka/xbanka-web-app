import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeftRight } from "lucide-react";
import { UseWithdrawCrypto } from "@/lib/services/wallet.service";
import { useEffect } from "react";
import { UserWallet } from "../Wallet-Page/types";
import { WalletSuccessState } from "./crypto-modal-types";
import { RecipientXbankaUsersTypes } from "./types";
import { useTransferCryptoToXbankaUsers } from "@/lib/services/send-crypto.service";

export function ProcessingXbankaStep({
  amount,
  recipient,
  onConfirm,
  onError,
}: {
  amount: string;
  recipient: RecipientXbankaUsersTypes;
  onConfirm: () => void;
  onError: (error: Error) => void;
}) {
//   const shortAddr = `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`;

  const { mutate } = useTransferCryptoToXbankaUsers();

  useEffect(() => {
    mutate(
      {
        targetUserId: recipient.id,
        amount: Number(amount),
      },
      {
        onSuccess: () => {
          onConfirm();
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  }, []);
  return (
    <Modal onClose={() => {}}>
      <div className="py-10 flex flex-col items-center gap-5 text-center space-y-6">
        <Spinner icon={ArrowLeftRight} size={64} />
        <div className="space-y-2">
          <h3 className="text-[24px] leading-8 font-semibold text-card-text">
            Processing your request...
          </h3>
          <p className="text-base font-normal leading-6 text-text">
            This usually takes a few seconds. Please don't close this <br />
            window
          </p>
        </div>
      </div>
    </Modal>
  );
}
