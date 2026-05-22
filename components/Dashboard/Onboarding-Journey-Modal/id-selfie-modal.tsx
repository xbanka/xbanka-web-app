import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "./success-state";
import { ModalHeader } from "@/components/ui/modal-header";
import { FormField } from "@/components/ui/FormField";
import { Camera, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select";
import {
  AttachmentFile,
  AttachmentUpload,
} from "@/components/ui/UploadAttachment";
import { useEffect, useState } from "react";
import { useIdentity, useSkipStep } from "@/lib/services/onboarding.service";
import { step3FormValues, step3Schema } from "@/lib/schema/onboarding-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LivenessDetector, {
  loadFaceLandmarker,
} from "@/components/ui/LivenessDetector";
import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { ErrorLayout } from "@/components/ui/error-layout";

export type IdSelfieStep =
  | "id-form"
  | "id-success"
  | "selfie"
  | "selfie-success";

export function IdSelfieModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: () => void;
}) {
  const { data: verificationStatus } = UseVerificationStatus();

  const [step, setStep] = useState<IdSelfieStep>("id-form");

  const verification = verificationStatus?.data;

  const identityCompleted = verification?.progress?.find(
    (s: any) => s.id === "IDENTITY",
  )?.isCompleted;

  const selfieCompleted = verification?.progress?.find(
    (s: any) => s.id === "SELFIE",
  )?.isCompleted;

  useEffect(() => {
    if (identityCompleted && !selfieCompleted) {
      setStep("selfie");
    }

    if (identityCompleted && selfieCompleted) {
      setStep("selfie-success");
    }
  }, [identityCompleted, selfieCompleted]);

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending, error } = useIdentity();
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;

  const {
    register,
    reset,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step3FormValues>({
    resolver: zodResolver(step3Schema),
    mode: "onTouched",
  });

  const onSubmit = (data: step3FormValues) => {
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("idNumber", data.idNumber);
    formData.append("idType", data.idType);
    formData.append("idImage", attachments[0].file);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    mutate(formData, {
      onSuccess: () => {
        reset();
        setStep("id-success");
        setAttachments([]);
      },
    });
  };

  const handleIdSuccess = () => {
    setStep("selfie");
    loadFaceLandmarker();
  };

  const stepTitles: Record<IdSelfieStep, string> = {
    "id-form": "Select Your Preferred ID",
    "id-success": "ID Submitted",
    selfie: "Take a Selfie",
    "selfie-success": "Selfie Captured",
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      {/* ── ID FORM ─────────────────────────────────────── */}
      {step === "id-form" && (
        <div>
          <ModalHeader
            className="px-8"
            title="Select your preferred ID"
            subtitle="Verify your identity to unlock your wallet"
            onClose={onClose}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 px-8 pb-8 pt-6 space-y-6"
          >
            <div className="space-y-4">
              <SelectField
                id="idType"
                icon={IdCard}
                placeholder="Select ID type"
                error={errors.idType}
                options={[
                  { value: "nin", label: "NIN" },
                  {
                    value: "international_passport",
                    label: "International Passport",
                  },
                  { value: "drivers_license", label: "Driver's License" },
                  { value: "voters_card", label: "Voter's Card" },
                ]}
                register={register}
              />
              <FormField
                icon={IdCard}
                placeholder="Enter ID number"
                error={errors.idNumber}
                register={register}
                id="idNumber"
              />
              <AttachmentUpload value={attachments} onChange={setAttachments} />
              <ErrorLayout message={error?.message || skipError?.message} />
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
                  disabled={!isValid || isPending || attachments.length === 0}
                  variant={
                    isPending || !isValid || attachments.length === 0
                      ? "disabled"
                      : "default"
                  }
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

      {/* ── ID SUCCESS ──────────────────────────────────── */}
      {step === "id-success" && (
        <SuccessState
          title="ID Submitted"
          subtitle="Your document has been submitted successfully. Next, take a quick selfie so we can match it with your ID."
          badge="review"
          ctaLabel="Continue to Selfie"
          onCta={handleIdSuccess}
          onClose={onClose}
        />
      )}

      {/* ── SELFIE ──────────────────────────────────────── */}
      {step === "selfie" && (
        <div className="pb-8">
          <ModalHeader
            className="px-8"
            title="Almost Done!, Let's take a Selfie"
            subtitle="We'll match your photo with your ID to confirm it's really you."
            onClose={onClose}
          />
          <div className="text-center pt-6">
            <LivenessDetector
              onBack={() => setStep("id-success")}
              onSuccess={() => setStep("selfie-success")}
              brandColor="#36b6ab"
            />
          </div>
        </div>
      )}

      {/* ── SELFIE SUCCESS ──────────────────────────────── */}
      {step === "selfie-success" && (
        <SuccessState
          title="Selfie Captured"
          subtitle="Great shot! Your selfie has been matched with your ID. You can now proceed to verify your address."
          badge="verified"
          ctaLabel="Move to Proof of Address"
          onCta={() => {
            onCompleted();
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
