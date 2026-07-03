import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Check, IdCard } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useVerifyBvn } from "@/lib/services/onboarding.service";
import { step2FormValues, step2Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UseProfileUser } from "@/lib/services/profile.service";
import { ErrorLayout } from "@/components/ui/error-layout";
import { UNLOCKED_FEATURES } from "@/lib/MockData";
import { CreatePinModal } from "../Account-Page/create-pin-modal";

export function BvnModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [showPin, setShowPin] = useState(false);

  const { mutate: verifyBvn, isPending, error } = useVerifyBvn();
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;

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

  // Set PIN flow (functional OTP + PIN modal) takes over when requested.
  if (showPin) {
    return (
      <CreatePinModal
        open={showPin}
        handleClose={() => {
          setShowPin(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Modal className="p-0" onClose={onClose}>
      {step === "form" && (
        <div>
          <ModalHeader
            className="px-8"
            title="Verify Your BVN"
            subtitle="Your BVN helps us confirm your name and date of birth. We'll never share it with anyone."
            onClose={onClose}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 px-8 pb-8 pt-6 space-y-6"
          >
            <div className="space-y-2">
              <FormField
                id="bvn"
                icon={IdCard}
                placeholder="Enter BVN"
                error={errors.bvn}
                register={register}
              />
              {error && (
                <p className="text-xs font-normal text-error-text">
                  {error.message || "We couldn't verify your BVN"}
                </p>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-1">
              <Button
                type="button"
                onClick={onClose}
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
          </form>
        </div>
      )}

      {step === "success" && (
        <div className="text-center">
          <ModalHeader className="px-8" onClose={onClose} />
          <div className="px-8 pb-8 space-y-6">
            {/* Badge */}
            <Image
              src="/badge 2.svg"
              alt="verified"
              width={60}
              height={60}
              className="mx-auto"
              unoptimized
            />

            {/* Text */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-card-text">
                BVN Verified Successfully
              </h3>
              <p className="text-sm font-normal leading-6 text-text">
                Your wallet is now unlocked
              </p>
            </div>

            {/* Unlocked features */}
            <div className="bg-border border border-input rounded-2xl p-5 grid grid-cols-2 gap-x-6 gap-y-4 text-left">
              {UNLOCKED_FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium leading-5 text-card-text">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm font-normal leading-6 text-text">
              Set your transaction PIN to secure your account &amp; start
              transacting
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => setShowPin(true)}
              >
                Set PIN Now
              </Button>
              <button
                type="button"
                onClick={onCompleted}
                className="w-full text-sm font-medium text-Green hover:underline transition-colors py-1"
              >
                Skip for later
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
