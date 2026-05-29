import { IdCard } from "lucide-react";
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

const mobileFieldClass =
  "max-sm:[&_input]:h-[50px] max-sm:[&_input]:rounded-lg max-sm:[&_input]:pl-14 max-sm:[&_input]:text-[18px] max-sm:[&_input]:leading-7 max-sm:[&_input]:shadow-none max-sm:[&_svg]:left-5 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5";

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
        setStep(2);
      },
    });
  };

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        setStep(2);
      },
    });
  };

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <div className="text-center space-y-2 max-sm:mb-6 max-sm:text-left">
        <h1 className="text-[26px] font-bold text-card-text max-sm:text-[34px] max-sm:leading-10">
          Verify Your BVN
        </h1>
        <p className="text-sm text-text leading-relaxed max-sm:text-[18px] max-sm:leading-7">
          Your BVN helps us confirm your name and date of birth. We&apos;ll never
          share it with anyone.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 max-sm:min-h-0 max-sm:flex-1 max-sm:gap-0"
      >
        <div className="space-y-4 max-sm:space-y-5">
          <FormField
            id="bvn"
            icon={IdCard}
            placeholder="Enter BVN"
            error={errors.bvn}
            register={register}
            className={mobileFieldClass}
          />
          <ErrorField message={error?.message || skipError?.message} />
        </div>
        <div className="space-y-3.25 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
          <div className="flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:grid max-sm:grid-cols-[126px_1fr] max-sm:gap-3.5">
            <Button
              type="button"
              onClick={() => setStep(0)}
              variant="outline"
              size="lg"
              className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
            >
              Back
            </Button>
            <Button
              size="lg"
              className="hidden flex-3 sm:inline-flex"
              disabled={!isValid || isPending}
              variant={isPending || !isValid ? "disabled" : "default"}
              type="submit"
            >
              {isPending ? "Verifying..." : "Continue"}
            </Button>
            <Button
              size="lg"
              className="h-[50px] text-[16px] sm:hidden"
              disabled={isPending}
              variant={isPending ? "disabled" : "default"}
              type="submit"
            >
              {isPending ? "Verifying..." : "Continue"}
            </Button>
          </div>
          <h1
            onClick={handleSkip}
            className="font-medium text-[14px] leading-5.5 text-Green cursor-pointer max-sm:text-center max-sm:text-[18px] max-sm:leading-7"
          >
            {skipPending ? "Skipping..." : "Skip for later"}
          </h1>
        </div>
      </form>
    </div>
  );
}

export default Step2;
