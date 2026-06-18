import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { SendCryptoConfirmList } from "./send-crypto-confirm-list";
import { UserWallet } from "../Wallet-Page/types";
import { RecipientXbankaUsersTypes } from "./types";
import { TRANSACTION_FEE } from "./crypto-modal-types";

export function ConfirmStep({
  amount,
  asset,
  network,
  recipientAddress,
  recipientName,
  onBack,
  onClose,
  onNext,
  recipientType,
  xbankaRecipient,
}: {
  amount: string;
  asset?: UserWallet | null;
  network: string | null;
  recipientAddress: string;
  recipientName?: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
  recipientType?: "wallet" | "xbanka-user";
  xbankaRecipient?: RecipientXbankaUsersTypes | null;
}) {
  const parsedAmount = parseFloat(amount || "0");

  const rate = asset?.fiatEquivalent?.rate ?? 0;

  const nairaEquivalent = (parsedAmount * rate).toLocaleString();

  const shortAddr =
    recipientAddress.length > 12
      ? `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`
      : recipientAddress;

  const xbankaName = xbankaRecipient?.name || "XBanka User";

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8 "
        title="Send Crypto"
        subtitle="Transfer assets to external wallets or XBanka users."
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-8 pb-3">
        <ProgressBar step="confirm" />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-8">
        <div className="space-y-4">

          {/* Amount summary */}
          <div className="border border-input bg-border rounded-[20px] p-5 text-center space-y-2">
            <p className="text-sm font-normal leading-6 text-text">
              You are sending
            </p>

            <p className="text-4xl font-bold text-card-text flex items-center justify-center gap-3">
              {amount}

              <span className="text-[24px] font-semibold text-text">
                {asset?.currency}
              </span>
            </p>

            <p className="text-xs font-normal leading-4.5 text-text px-2 py-2.5 bg-input-background rounded-lg w-fit mx-auto">
              ≈ ₦{nairaEquivalent}
            </p>
          </div>

          {/* Breakdown */}
          <div className="border border-input bg-border rounded-[20px] p-5 divide-y divide-input">

            <SendCryptoConfirmList
              title="Asset"
              value={asset?.currency ?? ""}
            />

            {recipientType === "wallet" ? (
              <SendCryptoConfirmList
                title="Recipient"
                value={recipientName || shortAddr}
                subValue={recipientName ? shortAddr : undefined}
              />
            ) : (
              <SendCryptoConfirmList
                title="XBanka User"
                value={xbankaName}
                subValue={xbankaRecipient?.uid || ""}
              />
            )}

            <SendCryptoConfirmList
              title="Network"
              value={network || "-"}
            />

            <SendCryptoConfirmList
              title="Transaction fee"
              value={`${TRANSACTION_FEE} ${asset?.currency ?? ""}`}
            />

            <SendCryptoConfirmList
              title="Total Deducted"
              value={`${(parsedAmount + TRANSACTION_FEE).toLocaleString()} ${asset?.currency ?? ""}`}
              subValue={`≈ ₦${((parsedAmount + TRANSACTION_FEE) * rate).toLocaleString()}`}
            />
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2.5 bg-[#012E03] border border-[#037508] rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-[#A6F4C5] shrink-0 mt-0.5" />

            <p className="text-xs font-normal leading-4.5 text-[#A6F4C5]">
              Please verify the recipient address and network carefully.
              Transactions cannot be reversed once confirmed on the blockchain.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
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
            onClick={onNext}
          >
            Confirm & Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
