import { IdCard, MapPin } from "lucide-react";
import { FormField } from "../ui/FormField";
import { SelectField } from "../ui/select";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { useState } from "react";
import { useUserStore } from "@/store/verify-id.store";
import { useForm } from "react-hook-form";
import { step5FormValues, step5Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";

function Step5() {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const userId = useUserStore((s) => s.userId);

  const {
      register,
      reset,
      formState: { errors, isValid },
      handleSubmit,
    } = useForm<step5FormValues>({
      resolver: zodResolver(step5Schema),
      mode: "onTouched",
    });

  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">
          Proof of Address
        </h1>
        <p className="text-sm text-text leading-relaxed">
          Please provide the address exactly as it appears on your document
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <FormField
          id="address"
          icon={MapPin}
          placeholder="Enter Address"
          error={errors.address}
          register={register}
        />
        <FormField
          id="address"
          icon={MapPin}
          placeholder="Popular Landmark (optional)"
          register={register}
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="residenceCountry"
            placeholder="Country of Residence"
            error={errors.residenceCountry}
            options={[
              { value: "ng", label: "Nigeria" },
              { value: "gh", label: "Ghana" },
            ]}
            register={register}
          />
          <SelectField
          id="state"
            placeholder="State"
            error={errors.state}
            options={[
              { value: "lag", label: "Lagos" },
              { value: "abj", label: "Abuja" },
              { value: "ph", label: "Port Harcourt" },
              { value: "kno", label: "Kano" },
            ]}
            register={register}
          />
        </div>
        <SelectField
        id="residenceDocumentType"
          icon={IdCard}
          placeholder="Select document of choice"
          error={errors.residenceDocumentType}
          options={[
            { value: "utility", label: "Utility Bill" },
            { value: "bank", label: "Bank Statement" },
            { value: "tenancy", label: "Tenancy Agreement" },
          ]}
          register={register}
        />
        <AttachmentUpload value={attachments} onChange={setAttachments} />
      </div>
    </>
  );
}

export default Step5;
