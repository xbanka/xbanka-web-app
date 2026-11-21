"use client";

import { ChevronLeft, IdCard } from "lucide-react";
import { FormField } from "../../ui/FormField";
import { AttachmentFile, AttachmentUpload } from "../../ui/UploadAttachment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  cleanIdNumber,
  idTypeOptions,
  step3FormValues,
  step3Schema,
} from "@/lib/schema/onboarding-schema";
import { UseProfileUser } from "@/lib/services/profile.service";
import { useSavedNinChoice } from "@/hooks/use-saved-nin-choice";
import { SavedNinNotice } from "@/components/ui/saved-nin-notice";
import { Button } from "../../ui/button";
import { useIdentity, useSkipStep } from "@/lib/services/onboarding.service";
import { useUserIdStore } from "@/store/verify-id.store";
import { ErrorField } from "@/components/ui/field-error";
import { loadFaceLandmarker } from "@/components/ui/LivenessDetector";
import { cn } from "@/lib/utils";

interface Step3Props {
  setStep: (n: number) => void;
}

/** Friendlier names for the ID types (values stay what the API expects). */
const ID_LABELS: Record<string, string> = {
  nin: "National ID (NIN)",
  international_passport: "International passport",
  drivers_license: "Driver’s licence",
  voters_card: "Voter’s card",
};

const NUMBER_LABELS: Record<string, string> = {
  nin: "NIN",
  international_passport: "Passport number",
  drivers_license: "Licence number",
  voters_card: "Voter’s card number",
};

const ID_FIELD =
  "[&_label]:text-[13px] [&_input]:h-12 [&_input]:pl-10 [&_input]:text-[15px] max-sm:[&_input]:h-13";

function Step3({ setStep }: Step3Props) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const { mutate, isPending, error } = useIdentity();
  const userId = useUserIdStore((s) => s.userId);
  // Passport verification needs the NIN saved at the basic info step.
  const { data: profileData } = UseProfileUser();
  const hasNin = !!profileData?.data?.hasNin;
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();

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
        setStep(2);
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
        setStep(2);
      },
    });
  };

  const idType = watch("idType");
  const canContinue = isValid && !isPending && attachments.length > 0;

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <button
        type="button"
        onClick={() => setStep(0)}
        className="mb-4 inline-flex items-center gap-1 text-sm text-text hover:text-card-text"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.03em] text-card-text sm:text-[30px]">
          Add an ID document
        </h1>
        <p className="text-[15px] leading-6 text-text">
          Pick the one you have to hand. The name on it should match your BVN.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 max-sm:min-h-0 max-sm:flex-1"
      >
        <fieldset className="space-y-2">
          <legend className="mb-2 text-[13px] font-medium text-card-text">ID type</legend>
          {idTypeOptions(hasNin).map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 text-[15px] text-card-text transition-colors",
                idType === option.value
                  ? "border-Green bg-teal-light"
                  : "border-input bg-input-background hover:border-border-active/60",
              )}
            >
              <input
                type="radio"
                value={option.value}
                {...register("idType")}
                className="h-4 w-4 shrink-0 accent-[#0c9a8e]"
              />
              {ID_LABELS[option.value] ?? option.label}
            </label>
          ))}
          <ErrorField message={errors.idType?.message} />
        </fieldset>

        {usingSavedNin ? (
          <SavedNinNotice ninMasked={profileData?.data?.ninMasked} onChange={changeNin} />
        ) : (
          <FormField
            icon={IdCard}
            label={NUMBER_LABELS[idType] ?? "ID number"}
            placeholder={idType === "nin" ? "11-digit NIN" : "As printed on your ID"}
            error={errors.idNumber}
            register={register}
            id="idNumber"
            className={ID_FIELD}
          />
        )}

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-card-text">Photo of your ID</p>
          <AttachmentUpload
            value={attachments}
            onChange={setAttachments}
            maxSizeMB={5}
            accept="image/jpeg,image/png,application/pdf"
            title="Upload a photo or PDF of your ID"
          />
          <p className="text-xs text-text">Keep all four corners of the ID in view.</p>
        </div>
        <ErrorField message={error?.message || skipError?.message} />

        <div className="space-y-2 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
          <Button
            type="submit"
            disabled={!canContinue}
            variant={canContinue ? "default" : "disabled"}
            className="h-12 w-full text-[15px] font-semibold max-sm:h-13"
          >
            {isPending ? "Verifying…" : "Continue"}
          </Button>
          <button
            type="button"
            onClick={handleSkip}
            disabled={skipPending}
            className="h-11 w-full text-sm font-medium text-card-text hover:text-Green disabled:opacity-60"
          >
            {skipPending ? "Skipping…" : "Skip for now"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Step3;
