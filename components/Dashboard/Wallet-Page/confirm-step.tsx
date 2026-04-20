import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

export function ConfirmStep({
  amount, sourceLabel, accountName, fee, onBack, onClose, onConfirm,
}: {
  amount: string;
  sourceLabel: string;
  accountName: string;
  fee: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const feeNum = parseFloat(fee) || 0;
  const total = (numeric + feeNum).toLocaleString();
 
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Confirm Transaction" onBack={onBack} onClose={onClose} />
 
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-Green/10 border-2 border-Green/30 flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-Green" />
        </div>
      </div>
 
      {/* Amount */}
      <p className="text-xs text-text text-center mb-1">Amount to Fund</p>
      <p className="text-2xl font-bold text-card-text text-center mb-5">₦{amount}</p>
 
      {/* Breakdown */}
      <div className="bg-background border border-border rounded-xl p-4 space-y-3 mb-4">
        {[
          { label: "From", value: sourceLabel, isAccount: true },
          { label: "Account name", value: accountName },
          { label: "Fee", value: `₦${feeNum.toFixed(2)}` },
          { label: "Total Debit", value: `₦${total}`, bold: true, green: true },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-xs">
            <span className="text-text">{row.label}</span>
            {row.isAccount ? (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
                  {sourceLabel[0]}
                </div>
                <span className="font-medium text-card-text">{sourceLabel}</span>
              </div>
            ) : (
              <span className={cn("font-medium", row.green ? "text-Green" : "text-card-text", row.bold && "font-semibold")}>
                {row.value}
              </span>
            )}
          </div>
        ))}
      </div>
 
      <div className="flex items-start gap-2 text-xs text-text bg-Green/5 border border-Green/15 rounded-lg px-3 py-2.5 mb-6">
        <span className="text-Green mt-0.5">ℹ</span>
        <span>Funds will be debited directly from your selected bank account.</span>
      </div>
 
      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button size="lg" className="flex-1" onClick={onConfirm}>Confirm Funding</Button>
      </div>
    </Modal>
  );
}