"use client"
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { BankForm, BANKS, bankSchema } from "@/lib/schema/bank-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function BankAccountForm({
  onBack,
  onClose,
  onSuccess,
}: {
  onBack: () => void;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BankForm>({
    resolver: zodResolver(bankSchema),
    mode: "onTouched",
  });
 
  const [isPending, setIsPending] = useState(false);
 
  const onSubmit = async (data: BankForm) => {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsPending(false);
    onSuccess();
  };
 
  return (
    <Modal onClose={onClose} >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Bank name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-card-text">Bank Name</label>
          <div className="relative">
            <select
              className={cn(
                "w-full h-10 pl-3 pr-8 text-sm border rounded-lg bg-card-background text-card-text appearance-none outline-none transition-colors",
                errors.bankName
                  ? "border-[var(--input-border-error)]"
                  : "border-input focus:border-border-active"
              )}
              {...register("bankName")}
              defaultValue=""
            >
              <option value="" disabled>Select bank</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {errors.bankName && (
            <p className="text-xs text-[var(--input-border-error)]">{errors.bankName.message}</p>
          )}
        </div>
 
        {/* Account number */}
        <FormField
          id="accountNumber"
          placeholder="0123456789"
          register={register}
          error={errors.accountNumber}
          label="Account Number"
        />
 
        {/* Info note */}
        <p className="text-xs text-text bg-Green/10 border border-Green/20 rounded-lg px-3 py-2.5">
          <span className="text-Green font-semibold">₦100.00</span> will be deducted from your account for verification.
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