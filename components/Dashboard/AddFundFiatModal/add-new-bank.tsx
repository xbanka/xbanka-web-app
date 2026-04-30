import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectField } from "@/components/ui/select";
import { bankOptions } from "@/lib/schema/bank-schema";
import { UseFundFiatWalletBank } from "@/lib/services/wallet.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const addBankSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
});
type AddBankForm = z.infer<typeof addBankSchema>;

export function AddNewBankStep({
  onBack,
  onClose,
  onSaved,
}: {
  onBack: () => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { mutate, error, isPending } = UseFundFiatWalletBank();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddBankForm>({
    resolver: zodResolver(addBankSchema),
    mode: "onTouched",
  });

  const onSubmit = (data: AddBankForm) => {
    const payload = {
      accountNumber: data.accountNumber,
      bankCode: data.bankName,
    };
    console.log("payload", payload);

    mutate(payload);
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add Funds"
        onBack={onBack}
        onClose={onClose}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="px-10 pb-10 pt-6 space-y-8"
      >
        <div className="space-y-4">
          <SelectField
            id="bankName"
            // label="Bank Name"
            placeholder="Select bank"
            options={bankOptions}
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
          <p className="text-xs text-text">
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
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-3"
            disabled={!isValid || isPending}
            variant={!isValid || isPending ? "disabled" : "default"}
          >
            {isPending ? "Verifying..." : "Continue"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
