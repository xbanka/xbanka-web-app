import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectField } from "@/components/ui/select";
import {
  AttachmentFile,
  AttachmentUpload,
} from "@/components/ui/UploadAttachment";
import { IdCard, MapPin } from "lucide-react";
import { useState } from "react";
import { SuccessState } from "./success-state";
import { useUserIdStore } from "@/store/verify-id.store";
import { useAddressProof } from "@/lib/services/onboarding.service";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { step5FormValues, step5Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseProfileUser } from "@/lib/services/profile.service";
import { ErrorLayout } from "@/components/ui/error-layout";
import { COUNTRY_STATES } from "@/lib/types/countries";

export function AddressModal({
  onClose,
  onCompleted,
}: {
  onClose: () => void;
  onCompleted: () => void;
}) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [step, setStep] = useState<"form" | "success">("form");
  const clearUserId = useUserIdStore((s) => s.clearUserId);
  const { mutate, isPending, data, isSuccess, error } = useAddressProof();
  const router = useRouter();
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;

  const {
    register,
    reset,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step5FormValues>({
    resolver: zodResolver(step5Schema),
    mode: "onTouched",
  });

  const selectedCountry = watch("country");

  const stateOptions =
    COUNTRY_STATES[selectedCountry as keyof typeof COUNTRY_STATES] || [];

  const onSubmit = (data: step5FormValues) => {
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("address", data.address);
    formData.append("landmark", data.landmark);
    formData.append("country", data.country);
    formData.append("state", data.state);
    formData.append("documentType", data.residenceDocumentType);

    if (!attachments.length) return;

    formData.append("proofOfAddressImage", attachments[0].file);

    mutate(formData, {
      onSuccess: () => {
        reset();
        setStep("success");
        setAttachments([]);
        clearUserId();
      },
    });
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      {step === "form" && (
        <>
          <ModalHeader
            className="px-8"
            title="Proof of Address"
            subtitle=" Please provide the address exactly as it appears on your document"
            onClose={onClose}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 px-8 pb-8 pt-6 space-y-6"
          >
            <div className="space-y-4">
              <FormField
                id="address"
                icon={MapPin}
                placeholder="Enter Address"
                error={errors.address}
                register={register}
              />
              <FormField
                id="landmark"
                icon={MapPin}
                placeholder="Popular Landmark (optional)"
                register={register}
              />
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  id="country"
                  placeholder="Country of Residence"
                  error={errors.country}
                  options={[
                    { value: "nigeria", label: "Nigeria" },
                    { value: "ghana", label: "Ghana" },
                  ]}
                  register={register}
                />
                <SelectField
                  id="state"
                  placeholder="State"
                  error={errors.state}
                  disabled={!selectedCountry}
                  options={stateOptions.map((state) => ({
                    value: state,
                    label: state,
                  }))}
                  register={register}
                />
              </div>
              <SelectField
                id="residenceDocumentType"
                icon={IdCard}
                placeholder="Select document of choice"
                error={errors.residenceDocumentType}
                options={[
                  { value: "utility_bill", label: "Utility Bill" },
                  { value: "bank_statement", label: "Bank Statement" },
                  { value: "tenancy_agreement", label: "Tenancy Agreement" },
                ]}
                register={register}
              />
              <AttachmentUpload value={attachments} onChange={setAttachments} />
              <ErrorLayout message={error?.message} />
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
                  Submit
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
        </>
      )}

      {step === "success" && (
        <SuccessState
          title="You're all set!"
          subtitle="Your address has been submitted. Your account is now fully set up and ready to use."
          badge="verified"
          ctaLabel="Go to Dashboard"
          onCta={() => {
            onClose();
            onCompleted();
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
