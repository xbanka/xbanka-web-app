"use client";

import { UseGetVirtualAccount } from "@/lib/services/wallet.service";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { Modal } from "@/components/ui/Modal";

interface VirtualAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function VirtualAccountModal({ open, onClose }: VirtualAccountModalProps) {
  const { data: virtualAccountData, isPending, error } = UseGetVirtualAccount();
  const account = virtualAccountData?.data?.data?.[0] || virtualAccountData?.data?.data || virtualAccountData?.data;

  if (!open) return null;

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const bankName = account?.bankName || account?.bank_name || "N/A";
  const accountNumber = account?.accountNumber || account?.account_number || account?.address || "N/A";
  const accountName = account?.accountName || account?.account_name || "N/A";

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Add Funds"
        subtitle="Transfer money from any Nigerian bank to your dedicated Xbanka account."
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-6 space-y-8 max-sm:px-5 max-sm:pb-6 max-sm:pt-2 max-sm:space-y-6">
        {isPending ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error-text py-10 flex flex-col items-center justify-center space-y-4">
            <p>{(error as any)?.message || "Failed to load virtual account details. Please try again."}</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : !account ? (
          <div className="text-center text-text py-10">
            No account found. Please contact support.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account details */}
            <div className="bg-border rounded-2xl p-5 space-y-1">
              {/* Bank Name */}
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">Bank Name</span>
                <span className="text-sm font-semibold text-card-text text-right">
                  {bankName}
                </span>
              </div>

              {/* Account Number — highlighted */}
              <div className="flex items-center justify-between gap-3 bg-background rounded-xl px-4 py-3.5">
                <span className="text-xs font-normal text-text">
                  Account Number
                </span>
                <button
                  onClick={() => handleCopy(accountNumber, "Account Number")}
                  className="flex items-center gap-2 text-Green hover:opacity-80 transition-opacity"
                  title="Copy Account Number"
                >
                  <span className="text-base font-semibold">
                    {accountNumber}
                  </span>
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">
                  Account Name
                </span>
                <span className="text-sm font-semibold text-card-text text-right">
                  {accountName}
                </span>
              </div>

              {/* Account Type */}
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">
                  Account Type
                </span>
                <span className="text-sm font-semibold text-card-text text-right">
                  Virtual Account
                </span>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between gap-3 px-1 py-3">
                <span className="text-xs font-normal text-text">Currency</span>
                <span className="text-sm font-semibold text-card-text text-right">
                  NGN
                </span>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-center gap-2.5 bg-Green/5 border border-Green/40 rounded-lg px-4 py-3">
              <Info className="w-4 h-4 text-Green shrink-0" />
              <p className="text-xs font-normal leading-5 text-Green">
                Your Xbanka wallet will be credited automatically once the
                transfer is confirmed.
              </p>
            </div>

            {/* Helper text */}
            <p className="text-xs font-normal leading-5 text-text text-center px-4">
              You can transfer from your own bank account or share these details
              with someone sending money to you.
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                size="lg"
                className="flex-2 gap-2"
                onClick={() => handleCopy(accountNumber, "Account Number")}
              >
                <Copy className="w-4 h-4" />
                Copy Account Number
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
