import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, CheckCircle, Copy, Info } from "lucide-react";
import { useState } from "react";
import { ASSETS } from "../Wallet-Page/wallet-mock-data";
import { CloseBtn } from "@/components/ui/close-btn";
import Image from "next/image";
import { WalletSuccessState } from "./crypto-modal-types";
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
  // const fee = parseFloat(network.fee);
  const total = (parseFloat(amount)).toFixed(2);
  const nairaTotal = (parseFloat(total) * 1600).toLocaleString();

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

        <Image alt="check" src="/badge 2.svg" width={60} height={60} />

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {amount} {asset?.currency} Sent Successfully
          </h3>
          <p className="text-base font-normal leading-6 text-text">
            Your wallet has been credited
          </p>
        </div>

        {/* Transaction receipt */}
        <div className="w-full bg-border border border-input rounded-[20px] p-5 divide-y divide-input text-left">
          {/* Amount */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Amount</span>
            <span className="font-semibold text-card-text">
              {amount}.00 {successDetails?.provider}
            </span>
          </div>
          {/* Network fee */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Network</span>
            <span className="font-medium text-card-text">
              {successDetails?.network}
            </span>
          </div>
          {/* Network label with info */}
          {/* <div className="flex items-center justify-between px-4 py-3 text-xs">
            <div className="flex items-center gap-1.5 text-text">
              <span>Network</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-border text-card-text">
              {network.name}
            </span>
          </div> */}
          {/* Date & Time */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Date & Time</span>
            <span className="font-medium text-card-text">
              {formatDate(successDetails?.createdAt ?? "")} • {formatTo12Hour(successDetails?.createdAt || "")}
            </span>
          </div>
          {/* Transaction ID */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Transaction ID</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
            >
              <span>{successDetails?.providerRef}</span>
              {copied ? (
                <CheckCircle className="w-3.5 h-3.5 text-Green" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-text" />
              )}
            </button>
          </div>
          {/* Total Deducted — highlighted row */}
          <div className="px-2 py-2.5 bg-background flex justify-between rounded-lg">
              <h1 className="font-normal text-xs leading-5.5 text-text">Total Deducted</h1>
              <div className="space-y-1">
                <p className="font-medium text-[14px] leading-5 text-Green"></p>
                <h2 className="font-normal text-xs leading-4.5 text-text">₦32,400.00</h2>
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
