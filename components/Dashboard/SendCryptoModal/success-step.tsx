import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, CheckCircle, Copy, Info } from "lucide-react";
import { useState } from "react";
import { CloseBtn } from "@/components/ui/close-btn";
import Image from "next/image";
import { WalletSuccessState, TRANSACTION_FEE } from "./crypto-modal-types";
import { UserWallet } from "../Wallet-Page/types";
import { formatDate } from "@/lib/formatDate";
import { formatTo12Hour } from "@/lib/formatTime";

export function SuccessStep({
  amount,
  asset,
  network,
  txHash,
  onDone,
  onViewHistory,
  successDetails
}: {
  amount: string;
  asset?: UserWallet | null;
  network: string | null;
  txHash: string;
  onDone: () => void;
  onViewHistory: () => void;
  successDetails: WalletSuccessState | null
}) {
  const [copied, setCopied] = useState(false);
  const amountNum = parseFloat(amount) || 0;
  const total = amountNum + TRANSACTION_FEE;
  const rate = asset?.fiatEquivalent?.rate ?? 0;
  const nairaTotal = (total * rate).toLocaleString();

  const copy = () => {
    navigator.clipboard.writeText(txHash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal className="pb-10 px-10 pt-6" onClose={onDone}>
      {/* Close button */}
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>

        
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Success icon */}

        <Image alt="check" src="/badge 2.svg" width={60} height={60} unoptimized />

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {amount} {asset?.currency} Sent Successfully
          </h3>
          <p className="text-base font-normal leading-6 text-text">
            Your wallet has been credited
          </p>
        </div>

        {/* Transaction receipt */}
        <div className="w-full bg-border border border-input rounded-[20px] p-5 space-y-1 text-left">
          {/* Amount */}
          <div className="flex items-center justify-between px-1 py-3 text-xs">
            <span className="text-text">Amount</span>
            <span className="text-sm font-semibold text-card-text">
              {amountNum.toFixed(2)} {asset?.currency}
            </span>
          </div>
          {/* Network fee */}
          <div className="flex items-center justify-between px-1 py-3 text-xs">
            <span className="text-text">Network fee</span>
            <span className="text-sm font-medium text-card-text">
              {TRANSACTION_FEE.toFixed(2)} {asset?.currency}
            </span>
          </div>
          {/* Network */}
          <div className="flex items-center justify-between px-1 py-3 text-xs">
            <div className="flex items-center gap-1.5 text-text">
              <span>Network</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-input-background border border-input text-card-text">
              {network || "-"}
            </span>
          </div>
          {/* Date & Time */}
          <div className="flex items-center justify-between px-1 py-3 text-xs">
            <span className="text-text">Date &amp; Time</span>
            <span className="text-sm font-medium text-card-text">
              {formatDate(successDetails?.createdAt ?? "")} •{" "}
              {formatTo12Hour(successDetails?.createdAt || "")}
            </span>
          </div>
          {/* Transaction ID */}
          <div className="flex items-center justify-between px-1 py-3 text-xs">
            <span className="text-text">Transaction ID</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-sm font-medium text-card-text hover:text-Green transition-colors"
            >
              <span>{successDetails?.reference}</span>
              {copied ? (
                <CheckCircle className="w-3.5 h-3.5 text-Green" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-Green" />
              )}
            </button>
          </div>
          {/* Total Deducted — highlighted row */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-background rounded-xl mt-1">
            <span className="font-normal text-xs leading-5.5 text-text">
              Total Deducted
            </span>
            <div className="text-right">
              <p className="font-semibold text-sm leading-5 text-Green">
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {asset?.currency}
              </p>
              <p className="font-normal text-xs leading-5 text-text mt-0.5">
                ≈ ₦{nairaTotal}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onDone}>
            Done
          </Button>
          <button
            onClick={onViewHistory}
            className="w-full text-sm text-Green hover:underline transition-colors py-1"
          >
            View Transaction History
          </button>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-1.5 text-xs text-text">
          <AlertTriangle className="w-3 h-3 text-text shrink-0" />
          <span>Secured by Xbanka</span>
        </div>
      </div>
    </Modal>
  );
}
