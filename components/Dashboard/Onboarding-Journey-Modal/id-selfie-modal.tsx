import { Modal } from "@/components/ui/Modal";
import { SuccessState } from "./success-state";
import { ModalHeader } from "@/components/ui/modal-header";
import { FormField } from "@/components/ui/FormField";
import { IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select";
import {
  AttachmentFile,
  AttachmentUpload,
} from "@/components/ui/UploadAttachment";
import { useEffect, useState } from "react";
import { useSavedNinChoice } from "@/hooks/use-saved-nin-choice";
import { SavedNinNotice } from "@/components/ui/saved-nin-notice";
import { useIdentity, useSkipStep } from "@/lib/services/onboarding.service";
import {
  cleanIdNumber,
  step3FormValues,
  step3Schema,
  idTypeOptions,
} from "@/lib/schema/onboarding-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LivenessDetector, {
  loadFaceLandmarker,
} from "@/components/ui/LivenessDetector";
import { LivenessQrPanel } from "@/components/ui/liveness-qr-panel";
import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { ErrorLayout } from "@/components/ui/error-layout";
import { isStepDone } from "@/lib/verificationProgress";

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
  const [isMobileDevice, setIsMobileDevice] = useState(true);
  const { data: verificationStatus } = UseVerificationStatus();

  const [step, setStep] = useState<IdSelfieStep>("id-form");

  const verification = verificationStatus?.data;

  const identityCompleted = isStepDone(verification, "IDENTITY");
  const selfieCompleted = isStepDone(verification, "SELFIE");

  useEffect(() => {
    if (identityCompleted && !selfieCompleted) {
      setStep("selfie");
    }

    if (identityCompleted && selfieCompleted) {
      setStep("selfie-success");
    }
  }, [identityCompleted, selfieCompleted]);

  useEffect(() => {
    const checkMobile = async () => {
      const mobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      const touchDevice = navigator.maxTouchPoints > 1;

      setIsMobileDevice(mobileUA && touchDevice);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending, error } = useIdentity();
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;
  // Passport verification needs the NIN saved at the basic info step.
  const hasNin = !!profileData?.data?.hasNin;

  const {
    register,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step3FormValues>({
    resolver: zodResolver(step3Schema),
    mode: "onTouched",
  });
  // A NIN saved at basic info is reused: no need to type it again.
  const { usingSavedNin, changeNin } = useSavedNinChoice(
    watch("idType"),
    hasNin,
    setValue,
  );

  const onSubmit = (data: step3FormValues) => {
    const formData = new FormData();

    formData.append("userId", userId);
    if (!data.useSavedNin) {
      formData.append("idNumber", cleanIdNumber(data.idNumber));
    }
    formData.append("idType", data.idType);
    formData.append("idImage", attachments[0].file);

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
                options={idTypeOptions(hasNin)}
                register={register}
              />
              {usingSavedNin ? (
                <SavedNinNotice
              ninMasked={profileData?.data?.ninMasked}
              onChange={changeNin}
            />
              ) : (
                <FormField
                  icon={IdCard}
                  placeholder="Enter ID number"
                  error={errors.idNumber}
                  register={register}
                  id="idNumber"
                />
              )}
              <AttachmentUpload
                value={attachments}
                onChange={setAttachments}
                maxSizeMB={5}
                accept="image/jpeg,image/png,application/pdf"
                title="Upload a photo or PDF of your ID"
              />
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
            subtitle={
              isMobileDevice
                ? "We'll match your photo with your ID to confirm it's really you."
                : "Scan the QR code with your phone to continue on a device with a front-facing camera."
            }
            onClose={onClose}
          />
          <div className="text-center px-8 pt-6">
            {isMobileDevice ? (
              <LivenessDetector
                userId={userId ?? ""}
                onBack={() => setStep("id-success")}
                onSuccess={() => setStep("selfie-success")}
                brandColor="#36b6ab"
              />
            ) : (
              <LivenessQrPanel
                userId={userId ?? ""}
                onCompleted={() => setStep("selfie-success")}
              />
            )}
          </div>
        </div>
      )}

      {/* ── SELFIE SUCCESS ──────────────────────────────── */}
      {step === "selfie-success" && (
        <SuccessState
          title="Verification Complete"
          // Proof of Address: at launch, restore "You can now proceed to
          // verify your address." and the "Move to Proof of Address" CTA.
          subtitle="Great shot! Your selfie has been matched with your ID."
          badge="verified"
          ctaLabel="Done"
          onCta={() => {
            onCompleted();
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
