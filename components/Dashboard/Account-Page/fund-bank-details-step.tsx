import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
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
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add funds"
        onClose={onClose}
        onBack={onBack}
      />

      <form
        onSubmit={handleSubmit(onContinue)}
        className="space-y-8 px-10 pb-10 pt-6"
      >
        <div className="space-y-4">
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

          <FormField
            id="accountName"
            label="Account Name"
            placeholder="John Doe"
            register={register}
            error={errors.accountName}
          />

          {/* Deduction note */}
          <p className="text-xs text-text">
            <span className="text-Green font-semibold">₦50.00</span> will be
            deducted from your account for verification
          </p>
        </div>

        <div className="flex gap-4 pt-1">
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
            className="flex-3"
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
