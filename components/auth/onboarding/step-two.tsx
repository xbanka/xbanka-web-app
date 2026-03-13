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
import { useRouter } from "next/navigation";

interface Step2Props {
  setStep: (n: number) => void;
  step: number;
}

function Step2({ step, setStep }: Step2Props) {
  const router = useRouter();
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
        router.push("/sign-in");
      },
    });
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">
          Verify Your BVN
        </h1>
        <p className="text-sm text-text leading-relaxed">
          Your BVN helps us confirm your name and date of birth. We'll never
          share it with anyone.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          id="bvn"
          icon={IdCard}
          placeholder="Enter BVN"
          error={errors.bvn}
          register={register}
        />
        <ErrorField message={error?.message || skipError?.message} />
        <div className="space-y-3.25">
          <div className="flex flex-col md:flex-row gap-4 mt-1">
            <Button onClick={()=> setStep(0)} variant="outline" size="lg" className="flex-1">
              Back
            </Button>
            <Button
              size="lg"
              className="flex-3"
              disabled={!isValid || isPending}
              variant={isPending || !isValid ? "disabled" : "default"}
              type="submit"
            >
              {isPending ? "Verifying..." : "Continue"}
            </Button>
          </div>
          <h1
            onClick={handleSkip}
            className="font-medium text-[14px] leading-5.5 text-Green cursor-pointer"
          >
            {skipPending ? "Skipping..." : "Skip for later"}
          </h1>
        </div>
      </form>
    </>
  );
}

export default Step2;
