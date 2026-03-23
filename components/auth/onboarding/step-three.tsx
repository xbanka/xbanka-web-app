"use client";

import { IdCard } from "lucide-react";
import { SelectField } from "../../ui/select";
import { FormField } from "../../ui/FormField";
import { AttachmentFile, AttachmentUpload } from "../../ui/UploadAttachment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3FormValues, step3Schema } from "@/lib/schema/onboarding-schema";
import { Button } from "../../ui/button";
import { useIdentity, useSkipStep } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";
import { ErrorField } from "@/components/ui/field-error";
import { useRouter } from "next/navigation";

interface Step3Props {
  setStep: (n: number) => void;
}

function Step3({ setStep }: Step3Props) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending, error } = useIdentity();
  const userId = useUserIdStore((s) => s.userId);
  const router = useRouter();
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

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        setStep(3);
      },
    });
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">
          Select your preferred ID
        </h1>
        <p className="text-sm text-text">
          Verify your identity to unlock your wallet
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
        <ErrorField message={error?.message || skipError?.message} />
        <div className="space-y-3.25">
          <div className="flex flex-col md:flex-row gap-4 mt-1">
            <Button onClick={()=> setStep(1)} variant="outline" size="lg" className="flex-1">
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

export default Step3;
