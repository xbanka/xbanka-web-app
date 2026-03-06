import { IdCard, MapPin } from "lucide-react";
import { FormField } from "../ui/FormField";
import { SelectField } from "../ui/select";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { useState } from "react";

function Step5({ register, errors }) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

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
            placeholder="Country of Residence"
            error={errors.poaCountry}
            options={[
              { value: "ng", label: "Nigeria" },
              { value: "gh", label: "Ghana" },
            ]}
            registration={register("poaCountry", { required: "Required" })}
          />
          <SelectField
            placeholder="State"
            error={errors.state}
            options={[
              { value: "lag", label: "Lagos" },
              { value: "abj", label: "Abuja" },
              { value: "ph", label: "Port Harcourt" },
              { value: "kno", label: "Kano" },
            ]}
            registration={register("state", { required: "Required" })}
          />
        </div>
        <SelectField
          icon={IdCard}
          placeholder="Select document of choice"
          error={errors.docType}
          options={[
            { value: "utility", label: "Utility Bill" },
            { value: "bank", label: "Bank Statement" },
            { value: "tenancy", label: "Tenancy Agreement" },
          ]}
          registration={register("docType", {
            required: "Please select a document type",
          })}
        />
        <AttachmentUpload value={attachments} onChange={setAttachments} />
      </div>
    </>
  );
}

export default Step5;
