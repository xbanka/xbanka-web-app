import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import {
  BANK_OPTIONS,
  BankForm,
  MOCK_RESOLVED,
} from "@/lib/schema/bank-schema";
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
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add funds"
        onClose={onClose}
        onBack={onBack}
      />

      <div className="space-y-8 px-10 pb-10 pt-6">
        <div className="space-y-4">
          {/* Account summary card */}
          <div className="bg-background border border-border rounded-xl p-4 space-y-3 mb-4">
            {/* Bank + account number */}
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <div className="w-9 h-9 rounded-xl bg-Green/10 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-Green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-text">
                  {bankLabel}
                </p>
                <p className="text-xs font-normal text-text">{formData.accountNumber}</p>
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
        </div>

        <div className="flex gap-4">
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
            className="flex-3"
            onClick={onConfirm}
            disabled={isPending}
            variant={isPending ? "disabled" : "default"}
          >
            {isPending ? "Confirming…" : "Confirm & Add"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
