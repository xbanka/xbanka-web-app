import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "./success-state";
import { ModalHeader } from "@/components/ui/modal-header";
import { IdCard, Shield } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useVerifyBvn } from "@/lib/services/onboarding.service";
import { step2FormValues, step2Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserIdStore } from "@/store/verify-id.store";
import { useForm } from "react-hook-form";
import { ErrorField } from "@/components/ui/field-error";

export function BvnModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [bvn, setBvn] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [successType, setSuccessType] = useState<"verified" | "review">(
    "verified",
  );

  const { mutate: verifyBvn, isPending, error } = useVerifyBvn();
    // const {
    //   isPending: skipPending,
    //   error: skipError,
    //   mutate: skipMutate,
    // } = useSkipStep();
  
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
          setStep("success");
        },
      });
    };
  
    // const handleSkip = () => {
    //   skipMutate(userId, {
    //     onSuccess: () => {
    //       reset();
    //       setStep(2);
    //     },
    //   });
    // };

  return (
    <Modal onClose={onClose}>
      {step === "form" && (
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              id="bvn"
              icon={IdCard}
              placeholder="Enter BVN"
              error={errors.bvn}
              register={register}
            />
            <ErrorField message={error?.message} />
            <div className="space-y-3.25">
              <div className="flex flex-col md:flex-row gap-4 mt-1">
                <Button
                  onClick={() => {}}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
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
              {/* <h1
                onClick={handleSkip}
                className="font-medium text-[14px] leading-5.5 text-Green cursor-pointer"
              >
                {skipPending ? "Skipping..." : "Skip for later"}
              </h1> */}
            </div>
          </form>
        </>
      )}

      {step === "success" && (
        <SuccessState
          title={
            successType === "verified" ? "BVN Verified! ✅" : "BVN Under Review"
          }
          subtitle={
            successType === "verified"
              ? "Your BVN has been successfully verified. You can now proceed to the next step."
              : "We're reviewing your BVN. This usually takes a few minutes. You'll be notified once done."
          }
          badge={successType}
          ctaLabel="Move to ID & Selfie"
          onCta={() => {
            onClose();
            onCompleted();
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
