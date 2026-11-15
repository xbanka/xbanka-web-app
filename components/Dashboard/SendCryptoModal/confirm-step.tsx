import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { UserWallet, getCurrencyHeader } from "../Wallet-Page/types";
import { CoinAvatar } from "../Wallet-Page/coin-avatar";
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
          <div className="border border-input bg-border rounded-[20px] p-5 space-y-4">
            {/* Asset */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-normal leading-5.5 text-text">
                Asset
              </span>
              <div className="flex items-center gap-2">
                <CoinAvatar currency={asset?.currency ?? ""} size={24} />
                <span className="text-sm font-medium leading-5 text-card-text">
                  {getCurrencyHeader(asset?.currency ?? "")} ({asset?.currency})
                </span>
              </div>
            </div>

            {/* Recipient */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-normal leading-5.5 text-text shrink-0">
                {recipientType === "wallet" ? "Recipient" : "XBanka User"}
              </span>
              <div className="text-right min-w-0">
                <p className="text-sm font-medium leading-5 text-card-text truncate">
                  {recipientType === "wallet"
                    ? recipientName || shortAddr
                    : xbankaName}
                </p>
                <p className="text-xs font-normal leading-5 text-text mt-0.5 truncate">
                  {recipientType === "wallet"
                    ? recipientName
                      ? shortAddr
                      : ""
                    : xbankaRecipient?.uid || ""}
                </p>
              </div>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-normal leading-5.5 text-text">
                Network
              </span>
              <span className="text-xs font-medium leading-5 text-card-text px-2.5 py-1 rounded-md bg-input-background border border-input">
                {network || "-"}
              </span>
            </div>

            {/* Total deducted — highlighted */}
            <div className="flex items-center justify-between gap-3 bg-background rounded-xl px-4 py-3">
              <span className="text-xs font-normal leading-5.5 text-text">
                Total Deducted
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold leading-5 text-Green">
                  {(parsedAmount + TRANSACTION_FEE).toLocaleString()}{" "}
                  {asset?.currency ?? ""}
                </p>
                <p className="text-xs font-normal leading-5 text-text mt-0.5">
                  ≈ ₦{((parsedAmount + TRANSACTION_FEE) * rate).toLocaleString()}
                </p>
              </div>
            </div>
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
