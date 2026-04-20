import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/select";
import { BANK_OPTIONS, BankForm, bankSchema } from "@/lib/schema/bank-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

export function BankDetailsStep({
  onBack,
  onClose,
  onContinue,
}: {
  onBack: () => void;
  onClose: () => void;
  onContinue: (data: BankForm) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    mode: "onTouched",
  });
 
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
 
      <form onSubmit={handleSubmit(onContinue)} className="space-y-4">
        <SelectField
          id="bankName"
          label="Bank Name"
          placeholder="Select bank"
          options={BANK_OPTIONS}
          register={register}
          error={errors.bankName}
        />
 
        <FormField
          id="accountNumber"
          label="Account Number"
          placeholder="0123456789"
          register={register}
          error={errors.accountNumber}
        />
 
        {/* Deduction note */}
        <p className="text-xs text-text">
          <span className="text-Green font-semibold">₦50.00</span> will be
          deducted from your account for verification
        </p>
 
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
            type="submit"
            size="lg"
            className="flex-1"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}