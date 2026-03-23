import { IdCard, MapPin } from "lucide-react";
import { FormField } from "../../ui/FormField";
import { SelectField } from "../../ui/select";
import { AttachmentFile, AttachmentUpload } from "../../ui/UploadAttachment";
import { useState } from "react";
import { useUserIdStore } from "@/store/verify-id.store";
import { useForm } from "react-hook-form";
import { step5FormValues, step5Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/button";
import {
  useAddressProof,
  useSkipStep,
} from "@/lib/services/onboarding.service";
import { useRouter } from "next/navigation";
import { ErrorField } from "@/components/ui/field-error";

interface Step5Props {
  setStep: (n: number) => void;
  step: number;
}

function Step5({ setStep }: Step5Props) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const userId = useUserIdStore((s) => s.userId);
  const clearUserId = useUserIdStore((s) => s.clearUserId);
  const { mutate, isPending, data, isSuccess, error } = useAddressProof();
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
  } = useForm<step5FormValues>({
    resolver: zodResolver(step5Schema),
    mode: "onTouched",
  });

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
        setShowSuccess(true);
        setAttachments([]);
        clearUserId();
      },
    });
  };

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        router.push("/sign-in");
      },
    });
  };

  if (showSuccess && isSuccess && data?.success) {
    return (
      <>
        <div className="w-16 h-16 mx-auto rounded-full bg-Green flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-card-text">
          You're all set! 🎉
        </h2>
        <p className="text-sm text-text leading-relaxed">
          Your are done with your XBanka account onboarding.
        </p>
        <Button
          onClick={() => {
            setStep(0);
            setShowSuccess(false);
            router.push("/sign-in");
          }}
        >
          Back to Start
        </Button>
      </>
    );
  }

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
            { value: "utility_bill", label: "Utility Bill" },
            { value: "bank_statement", label: "Bank Statement" },
            { value: "tenancy_agreement", label: "Tenancy Agreement" },
          ]}
          register={register}
        />
        <AttachmentUpload value={attachments} onChange={setAttachments} />
        <ErrorField message={error?.message || skipError?.message} />
        <div className="space-y-3.25">
          <div className="flex flex-col md:flex-row gap-4 mt-1">
            <Button onClick={()=> setStep(3)} variant="outline" size="lg" className="flex-1">
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

export default Step5;
