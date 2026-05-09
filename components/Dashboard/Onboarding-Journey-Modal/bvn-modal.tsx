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
import { UseProfileUser } from "@/lib/services/profile.service";

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
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;
  // const {
  //   isPending: skipPending,
  //   error: skipError,
  //   mutate: skipMutate,
  // } = useSkipStep();

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
    <Modal className="p-0" onClose={onClose}>
      {step === "form" && (
        <div>
          <ModalHeader
            className="px-8"
            title="Verify Your BVN"
            subtitle="Your BVN helps us confirm your name and date of birth."
            onClose={onClose}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 px-8 pb-8 pt-6 space-y-6"
          >
            <div>
              <FormField
                id="bvn"
                icon={IdCard}
                placeholder="Enter BVN"
                error={errors.bvn}
                register={register}
              />
              <ErrorField message={error?.message} />
            </div>
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
        </div>
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
