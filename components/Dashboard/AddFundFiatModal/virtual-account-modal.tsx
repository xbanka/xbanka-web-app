"use client";

import { UseGetVirtualAccount } from "@/lib/services/wallet.service";
import { Copy, Landmark } from "lucide-react";
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
        subtitle="Transfer money to your dedicated virtual account to fund your wallet."
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
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-light rounded-full flex items-center justify-center">
                <Landmark className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-blue-border">
                <div className="space-y-1">
                  <p className="text-xs text-text">Bank Name</p>
                  <p className="text-sm font-semibold text-card-text">{bankName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-blue-border">
                <div className="space-y-1">
                  <p className="text-xs text-text">Account Number</p>
                  <p className="text-sm font-semibold text-card-text">{accountNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(accountNumber, "Account Number")}
                  className="p-2 hover:bg-blue-light rounded-md transition-colors"
                  title="Copy Account Number"
                >
                  <Copy className="w-4 h-4 text-primary" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-blue-border">
                <div className="space-y-1">
                  <p className="text-xs text-text">Account Name</p>
                  <p className="text-sm font-semibold text-card-text">{accountName}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
