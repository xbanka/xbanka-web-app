import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { BANK_OPTIONS, BankForm, MOCK_RESOLVED } from "@/lib/schema/bank-schema";
import { Building2, X } from "lucide-react";

export function ConfirmStep({
  formData,
  onBack,
  onClose,
  onConfirm,
  isPending,
}: {
  formData: BankForm;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const bankLabel =
    BANK_OPTIONS.find((b) => b.value === formData.bankName)?.label ??
    formData.bankName;
 
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-2 pt-8 pb-4">
        <button
          onClick={onBack}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-card-text flex-1">Add Funds</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
 
      {/* Account summary card */}
      <div className="bg-background border border-border rounded-xl p-4 space-y-3 mb-4">
        {/* Bank + account number */}
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-Green/10 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-Green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-card-text">{bankLabel}</p>
            <p className="text-xs text-text">{formData.accountNumber}</p>
          </div>
        </div>
 
        {/* Resolved details */}
        <div className="gap-3 text-xs">
          <div className="flex justify-between">
            <p className="text-text">Account Name</p>
            <p className="font-medium text-card-text mt-0.5">
              {formData.accountName}
            </p>
          </div>
          {/* <div>
            <p className="text-text">Account Type</p>
            <p className="font-medium text-card-text mt-0.5">
              {MOCK_RESOLVED.accountType}
            </p>
          </div> */}
        </div>
      </div>
 
      {/* Info note */}
      <p className="text-xs text-text mb-6">
        <span className="text-Green font-semibold">₦50.00</span> will be
        deducted from your account for verification
      </p>
 
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={onConfirm}
          disabled={isPending}
          variant={isPending ? "disabled" : "default"}
        >
          {isPending ? "Confirming…" : "Confirm & Add"}
        </Button>
      </div>
    </Modal>
  );
}