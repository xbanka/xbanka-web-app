"use client";

import { IdCard } from "lucide-react";
import { SelectField } from "../../ui/select";
import { FormField } from "../../ui/FormField";
import { AttachmentFile, AttachmentUpload } from "../../ui/UploadAttachment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3FormValues, step3Schema } from "@/lib/schema/onboarding-schema";
import { Button } from "../../ui/button";
import { useIdentity, useSkipStep } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";
import { ErrorField } from "@/components/ui/field-error";
import { loadFaceLandmarker } from "@/components/ui/LivenessDetector";

interface Step3Props {
  setStep: (n: number) => void;
}

const mobileFieldClass =
  "max-sm:[&_input]:h-[50px] max-sm:[&_input]:rounded-lg max-sm:[&_input]:pl-14 max-sm:[&_input]:text-[18px] max-sm:[&_input]:leading-7 max-sm:[&_input]:shadow-none max-sm:[&_svg]:left-5 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5";

const mobileSelectClass =
  "max-sm:[&_select]:h-[50px] max-sm:[&_select]:rounded-lg max-sm:[&_select]:pl-14 max-sm:[&_select]:text-[18px] max-sm:[&_select]:leading-7 max-sm:[&_select]:shadow-none max-sm:[&_svg]:left-5 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5";

function Step3({ setStep }: Step3Props) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending, error } = useIdentity();
  const userId = useUserIdStore((s) => s.userId);
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();

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
        setStep(3);
        setAttachments([]);
      },
    });
  };

  useEffect(() => {
    loadFaceLandmarker();
  }, []);

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        setStep(3);
      },
    });
  };

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <div className="text-center space-y-2 max-sm:mb-6 max-sm:text-left">
        <h1 className="text-[26px] font-bold text-card-text max-sm:text-[34px] max-sm:leading-10">
          Select your preferred ID
        </h1>
        <p className="text-sm text-text max-sm:text-[18px] max-sm:leading-7">
          Verify your identity to unlock your wallet
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 max-sm:min-h-0 max-sm:flex-1 max-sm:gap-0"
      >
        <div className="space-y-4 max-sm:space-y-5">
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
            className={mobileSelectClass}
          />
          <FormField
            icon={IdCard}
            placeholder="Enter ID number"
            error={errors.idNumber}
            register={register}
            id="idNumber"
            className={mobileFieldClass}
          />
          <div className="space-y-2">
            <div className="space-y-1 text-left">
              <h1 className="font-medium text-sm leading-5 text-card-text max-sm:text-[16px] max-sm:leading-6">
                Upload ID
              </h1>
              <p className="font-normal text-sm leading-6 text-text max-sm:text-[16px]">
                Include receipt of transaction
              </p>
            </div>
            <AttachmentUpload value={attachments} onChange={setAttachments} />
          </div>
          <ErrorField message={error?.message || skipError?.message} />
        </div>
        <div className="space-y-3.25 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
          <div className="flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:grid max-sm:grid-cols-[126px_1fr] max-sm:gap-3.5">
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="outline"
              size="lg"
              className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
            >
              Back
            </Button>
            <Button
              size="lg"
              className="hidden flex-3 sm:inline-flex"
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

export default Step3;
