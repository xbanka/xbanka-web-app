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
import { useIdentity } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";

interface Step3Props {
  setStep: (n: number) => void;
}

function Step3({ setStep }: Step3Props) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending } = useIdentity();
  const userId = useUserIdStore((s) => s.userId);

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
    if (!userId) return;
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
        <div className="flex flex-col md:flex-row gap-4 mt-1">
          <Button variant="outline" size="lg" className="flex-1">
            Cancel
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
      </form>
    </>
  );
}

export default Step3;
