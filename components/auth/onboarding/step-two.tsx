import { IdCard, Smartphone } from "lucide-react";
import { FormField } from "../../ui/FormField";
import { useForm } from "react-hook-form";
import { useSkipStep, useVerifyBvn } from "@/lib/services/onboarding.service";
import { Button } from "../../ui/button";
import {
  step2FormValues,
  step2Schema,
} from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserIdStore } from "@/store/verify-id.store";
import { ErrorField } from "@/components/ui/field-error";

interface Step2Props {
  setStep: (n: number) => void;
  step: number;
}

/** A taller field with wider letter spacing, so the 11 digits are easy to check. */
const BVN_FIELD =
  "[&_input]:h-13 [&_input]:pl-10 [&_input]:text-[17px] [&_input]:tracking-[0.12em] max-sm:[&_input]:h-14";

function Step2({ setStep }: Step2Props) {
  const { mutate: verifyBvn, isPending, error } = useVerifyBvn();
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();

  const userId = useUserIdStore((s) => s.userId);

  const {
    register,
    reset,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step2FormValues>({
    resolver: zodResolver(step2Schema),
    mode: "onTouched",
  });

  const onSubmit = (data: step2FormValues) => {
    const payload = { userId, bvn: data.bvn };
    verifyBvn(payload, {
      onSuccess: () => {
        reset();
        setStep(1);
      },
    });
  };

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        setStep(1);
      },
    });
  };

  const digits = (watch("bvn") ?? "").replace(/\D/g, "").length;

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.03em] text-card-text sm:text-[30px]">
          Verify your BVN
        </h1>
        <p className="text-[15px] leading-6 text-text">
          Your Bank Verification Number confirms your name and date of birth.
          We&apos;ll never share it with anyone.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 max-sm:min-h-0 max-sm:flex-1"
      >
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor="bvn" className="text-[13px] font-medium text-card-text">
              BVN
            </label>
            <span className="text-xs tabular-nums text-text">{digits} of 11 digits</span>
          </div>
          <FormField
            id="bvn"
            icon={IdCard}
            placeholder="11-digit BVN"
            error={errors.bvn}
            register={register}
            className={BVN_FIELD}
          />
          <ErrorField message={error?.message || skipError?.message} />
        </div>

        <div className="flex gap-3 rounded-lg border border-border bg-input-background px-4 py-3.5">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-Green" />
          <p className="text-[13px] leading-5 text-text">
            <span className="font-semibold text-card-text">Don&apos;t know your BVN?</span>{" "}
            Dial <span className="font-semibold text-Green">*565*0#</span> from the phone number
            linked to your bank account.
          </p>
        </div>

        <div className="space-y-2 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
          <Button
            className="h-12 w-full text-[15px] font-semibold max-sm:h-13"
            disabled={!isValid || isPending}
            variant={isPending || !isValid ? "disabled" : "default"}
            type="submit"
          >
            {isPending ? "Verifying…" : "Verify BVN"}
          </Button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={skipPending}
            className="h-11 w-full text-sm font-medium text-card-text hover:text-Green disabled:opacity-60"
          >
            {skipPending ? "Skipping…" : "Skip for now"}
          </button>
          <p className="text-center text-xs text-text">Your limits stay low until you verify.</p>
        </div>
      </form>
    </div>
  );
}

export default Step2;
