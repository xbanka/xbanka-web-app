"use client"

import { IdCard } from "lucide-react";
import { SelectField } from "../ui/select";
import { FormField } from "../ui/FormField";
import { UploadZone } from "../ui/upload-zone";
import { AttachmentFile, AttachmentUpload } from "../ui/UploadAttachment";
import { useState } from "react";

function Step3({ register, errors }) {
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-[26px] font-bold text-card-text">Select your preferred ID</h1>
        <p className="text-sm text-text">Verify your identity to unlock your wallet</p>
      </div>
      <div className="flex flex-col gap-3">
        <SelectField
          icon={IdCard}
          placeholder="Select ID type"
          error={errors.idType}
          options={[
            { value: "nin", label: "NIN" },
            { value: "passport", label: "International Passport" },
            { value: "drivers", label: "Driver's License" },
            { value: "voters", label: "Voter's Card" },
          ]}
          registration={register("idType", { required: "Please select an ID type" })}
        />
        <FormField
          icon={IdCard}
          placeholder="Enter ID number"
          error={errors.idNumber}
          register={register}
          id="card"
        />
        <AttachmentUpload value={attachments} onChange={setAttachments} />
      </div>
    </>
  );
}

export default Step3;