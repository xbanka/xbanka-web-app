import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { TransactionDescriptionField } from "@/components/ui/transaction-description-field";
import { UseProfileUser } from "@/lib/services/profile.service";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

export function ConfirmXbankaUserStep({
  amount,
  sourceLabel,
  accountName,
  fee,
  onBack,
  onClose,
  onConfirm,
}: {
  amount: string;
  sourceLabel: string;
  accountName: string;
  fee: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { data, isPending, error } = UseProfileUser()
  const firstName = data?.data?.firstName;
  const lastName = data?.data?.lastName;
  const userId = data?.data?.userId;
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const feeNum = parseFloat(fee) || 0;
  const total = (numeric + feeNum).toLocaleString();

  console.log("ConfirmXbankaUserStep props:", firstName)

  return (
    <Modal className="pt-6 space-y-8" onClose={onClose}>
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-15 h-15 rounded-[36px] border p-2 bg-[#042F2E] border-[#0F766E] flex items-center justify-center">
            <ArrowLeftRight className="w-8 h-8 text-Green" />
          </div>
        </div>
        <div className="font-semibold text-center text-2xl leading-8 text-card-text">
          Review & Confirm<br /> Transaction
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[20px] bg-border p-4 space-y-3">
          <div className="pb-3 space-y-2">
            {/* Amount */}
            <p className="text-base font-normal leading-6 text-text text-center">
              Amount to Fund
            </p>
            <p className="text-2xl font-semibold leading-8 text-card-text text-center">
              ₦{amount}
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <TransactionDescriptionField label="From" value={firstName + " " + lastName} isAccount />
            <TransactionDescriptionField label="Account name" value={accountName} />
            <TransactionDescriptionField label="Fee" value={`₦${feeNum.toFixed(2)}`} />
            <TransactionDescriptionField className="pt-3 border-t border-input" label="Total Debit" value={`₦${total}`} amount={true} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-text">
          <AlertTriangle className="w-3 h-3 text-Green" />
          <span className="font-normal leading-4.6">
            Funds will be debited directly from your selected bank account.
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button size="lg" className="flex-3" onClick={onConfirm}>
          Confirm Funding
        </Button>
      </div>
    </Modal>
  );
}
