"use client"

import { IdCard } from "lucide-react";
import { SelectField } from "../ui/select";
import { FormField } from "../ui/FormField";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3FormValues, step3Schema } from "@/lib/schema/onboarding-schema";

interface Step3Props {
  setStep: (n: number) => void
}

function Step3({ setStep }: Step3Props) {
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const {
        register,
        reset,
        formState: { errors, isValid },
        handleSubmit,
      } = useForm<step3FormValues>({
        resolver: zodResolver(step3Schema),
        mode: "onTouched",
      });
  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">Select your preferred ID</h1>
        <p className="text-sm text-text">Verify your identity to unlock your wallet</p>
      </div>
      <div className="flex flex-col gap-3">
        <SelectField
        id="idType"
          icon={IdCard}
          placeholder="Select ID type"
          error={errors.idType}
          options={[
            { value: "nin", label: "NIN" },
            { value: "passport", label: "International Passport" },
            { value: "drivers", label: "Driver's License" },
            { value: "voters", label: "Voter's Card" },
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
      </div>
    </>
  );
}

export default Step3;