import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectField } from "@/components/ui/select";
import { BankForm, bankSchema } from "@/lib/schema/bank-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { UseGetAllBanks, UseResolveBankAccount } from "@/lib/services/wallet.service";
import { useEffect } from "react";

export function BankDetailsStep({
  onClose,
  onContinue,
}: {
  onClose: () => void;
  onContinue: (data: BankForm) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    mode: "onTouched",
  });

  const { mutateAsync: resolveAccount, isPending: isResolving } = UseResolveBankAccount();
  const bankCode = watch("bankName"); // Stored as the select value
  const accountNumber = watch("accountNumber");

  useEffect(() => {
    const resolve = async () => {
      if (bankCode && accountNumber?.length === 10) {
        try {
          const res = await resolveAccount({ accountNumber, bankCode });
          if (res?.data?.account_name) {
            setValue("accountName", res.data.account_name, { shouldValidate: true });
          }
        } catch (e) {
          // Keep whatever user typed or empty if resolution fails
        }
      }
    };
    resolve();
  }, [bankCode, accountNumber, resolveAccount, setValue]);

  const { data: banksResponse, isPending: isLoadingBanks } = UseGetAllBanks();
  const rawBanks = banksResponse?.data?.data || [];
  
  // Sort alphabetically and map to SelectField options
  const bankOptions = Array.isArray(rawBanks) 
    ? [...rawBanks]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((bank: any) => ({
          label: bank.name,
          value: bank.code, // Storing code as the value!
        }))
    : [];

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add funds"
        onClose={onClose}
      />

      <form
        onSubmit={handleSubmit(onContinue)}
        className="space-y-8 px-10 pb-10 pt-6"
      >
        <div className="space-y-4">
          <SelectField
            id="bankName"
            label="Bank Name"
            placeholder={isLoadingBanks ? "Loading banks..." : "Select bank"}
            options={bankOptions}
            register={register}
            error={errors.bankName}
            disabled={isLoadingBanks}
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
            placeholder={isResolving ? "Resolving account name..." : "John Doe"}
            register={register}
            error={errors.accountName}
            disabled={isResolving}
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
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-3"
            disabled={!isValid || isResolving}
            variant={isValid && !isResolving ? "default" : "disabled"}
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
