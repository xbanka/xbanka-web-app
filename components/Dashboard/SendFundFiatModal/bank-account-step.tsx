import { Button } from "@/components/ui/button";
import { Recipient, Step } from "./types";
import { bankOptions } from "@/lib/schema/bank-schema";
import { FormField } from "@/components/ui/FormField";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchSelectField } from "@/components/ui/search-select-field";

const addBankSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
});
type AddBankForm = z.infer<typeof addBankSchema>;

export function BankAccountStep({
  onBack,
  onFound,
  onNotFound,
  setStep,
  setRecipient,
  recipient
}: {
  onBack: () => void;
  onFound: (r: Recipient) => void;
  onNotFound: () => void;
  setStep: (value: Step) => void;
  setRecipient: (Recipient: Recipient) => void;
  recipient: Recipient | null
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddBankForm>({
    resolver: zodResolver(addBankSchema),
    mode: "onTouched",
  });

  const onSubmit = (data: AddBankForm) => {
    // Find the selected bank object using the value from the form
    const selectedBank = bankOptions.find((b) => b.value === data.bankName);
    if (!selectedBank) return;
    if (selectedBank) {
      const newRecipient: Recipient = {
        accountNumber: data.accountNumber,
        bankCode: data.bankName,
        bankName: selectedBank.label,
        accountName: "John Doe", // Usually this comes from your "Resolve" API
        amount: 0,
        narration: "",
      };

      setRecipient(newRecipient);
      setStep("enter-amount");
    }
  };

  // const selectedBankLabel =
  //   NIGERIAN_BANKS.find((b) => b.value === bank)?.label ?? "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-8 pb-8 pt-4 space-y-8"
    >
      <div className="space-y-4">
        <FormField
          id="accountNumber"
          label="Account Number"
          placeholder="0123456789"
          register={register}
          error={errors.accountNumber}
        />

        <SearchSelectField
          id="bankName"
          label="Bank Name"
          placeholder="Select bank"
          options={bankOptions}
          register={register}
          error={errors.bankName}
        />
      </div>

      {/* Loading state */}
      {/* {loading && (
        <div className="flex items-center gap-2 text-sm text-text animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-Green border-t-transparent animate-spin" />
          Resolving account...
        </div>
      )} */}

      {/* Resolved name */}
      {/* {resolvedName && !loading && (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-Green/30 bg-Green/5">
          <AvatarCircle name={resolvedName} color="bg-orange-500" size="sm" />
          <div>
            <p className="text-sm font-medium text-card-text">{resolvedName}</p>
            <p className="text-xs text-text">{selectedBankLabel}</p>
          </div>
        </div>
      )} */}

      {/* Error state */}
      {/* {error && !loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-destructive/40 bg-destructive/10">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">
            Account not found. Please check the account number and selected
            bank.
          </p>
        </div>
      )} */}
      {/* <ErrorField message={errors} /> */}

      <div className="flex gap-4 pt-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-3"
          disabled={!isValid}
          variant={!isValid ? "disabled" : "default"}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
