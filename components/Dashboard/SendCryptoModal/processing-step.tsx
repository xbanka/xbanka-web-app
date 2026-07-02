import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeftRight } from "lucide-react";
import { UseWithdrawCrypto } from "@/lib/services/wallet.service";
import { useEffect } from "react";
import { UserWallet } from "../Wallet-Page/types";
import { WalletSuccessState } from "./crypto-modal-types";

export function ProcessingStep({
  amount,
  asset,
  network,
  recipientName,
  recipientAddress,
  onConfirm,
  setSuccessDetails,
  onError
}: {
  amount: string;
  asset?: UserWallet | null;
  network: string | null;
  recipientAddress: string;
  recipientName?: string;
  onConfirm: () => void;
  setSuccessDetails: (value: WalletSuccessState) => void;
  onError: (error: Error) => void;
}) {
  const shortAddr = `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`;
  const { mutate, isPending, error } = UseWithdrawCrypto();

  useEffect(() => {
    if (!asset?.currency || !amount || !recipientAddress || !network) return;
    const mainAmount = Number(amount.replace(/,/g, ""));
    const payload = {
      currency: asset?.currency,
      network,
      address: recipientAddress,
      amount: mainAmount,
      memo: "none",
      narration: "none",
    };
    mutate(payload, {
      onSuccess: (response) => {
        setSuccessDetails(response.data)
        onConfirm();
      },
      onError: (error) => {
          onError(error);
        },
    });
  }, [asset?.currency, amount, recipientAddress, network]);
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
