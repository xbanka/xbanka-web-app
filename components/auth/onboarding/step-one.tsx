import { Calendar, Lock, Phone, User } from "lucide-react";
import { FormField } from "../../ui/FormField";
import { SelectField } from "../../ui/select";
import { FormHeader } from "../../ui/FormHeader";
import { useForm } from "react-hook-form";
import { type ChangeEvent, useState } from "react";
import { countryOptions } from "@/lib/countries";
import { step1FormValues, step1Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserIdStore } from "@/store/verify-id.store";
import { useSkipStep, useUserProfile } from "@/lib/services/onboarding.service";
import { Button } from "../../ui/button";
import { ErrorField } from "@/components/ui/field-error";

export interface StepOneProps {
  setStep: (n: number) => void;
}

const mobileFieldClass =
  "max-sm:[&_input]:h-[50px] max-sm:[&_input]:rounded-lg max-sm:[&_input]:pl-14 max-sm:[&_input]:text-[18px] max-sm:[&_input]:leading-7 max-sm:[&_input]:shadow-none max-sm:[&_svg]:left-5 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5";

const mobileOnlyFieldClass = `sm:hidden ${mobileFieldClass}`;

const mobileSelectClass =
  "max-sm:[&_select]:h-[50px] max-sm:[&_select]:rounded-lg max-sm:[&_select]:pl-14 max-sm:[&_select]:text-[18px] max-sm:[&_select]:leading-7 max-sm:[&_select]:shadow-none max-sm:[&_svg]:left-5 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5";

function Step1({ setStep }: StepOneProps) {
  const [fullName, setFullName] = useState("");
  const userId = useUserIdStore((s) => s.userId);

  const { isPending, error, mutate } = useUserProfile();
  const {
    isPending: skipPending,
    error: skipError,
    mutate: skipMutate,
  } = useSkipStep();
  const {
    register,
    reset,
    setValue,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step1FormValues>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
  });

  const onsubmit = async (data: step1FormValues) => {
    const payload = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      country: data.country,
    };
    mutate(payload, {
      onSuccess: () => {
        reset();
        setFullName("");
        setStep(1);
      },
    });
  };

  const handleFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const [firstName = "", ...rest] = value.trim().split(/\s+/).filter(Boolean);

    setFullName(value);
    setValue("firstName", firstName, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("lastName", rest.join(" "), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSkip = () => {
    skipMutate(userId, {
      onSuccess: () => {
        reset();
        setFullName("");
        setStep(1);
      },
    });
  };

  return (
    <div className="max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col">
      <FormHeader
        className="space-y-2 max-sm:mb-6 max-sm:text-left max-sm:[&_h1]:text-[34px] max-sm:[&_h1]:leading-10 max-sm:[&_h1]:text-card-text max-sm:[&_p]:text-[18px] max-sm:[&_p]:leading-7"
        title="Let's set up your account"
        subtitle="Provide a few details to set up your xbanka account"
      />
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="space-y-4 max-sm:flex max-sm:min-h-0 max-sm:flex-1 max-sm:flex-col max-sm:space-y-0"
      >
        <div className="space-y-4 max-sm:space-y-5">
          <FormField
            id="fullName"
            icon={User}
            placeholder="Full name"
            error={errors.firstName || errors.lastName}
            value={fullName}
            onChange={handleFullNameChange}
            className={mobileOnlyFieldClass}
          />
          <FormField
            id="firstName"
            icon={User}
            placeholder="First name"
            error={errors.firstName}
            register={register}
            className="max-sm:hidden"
          />
          <FormField
            id="lastName"
            icon={User}
            placeholder="Last name"
            error={errors.lastName}
            register={register}
            className="max-sm:hidden"
          />
          <FormField
            id="dateOfBirth"
            icon={Calendar}
            placeholder="Date of Birth"
            type="text"
            error={errors.dateOfBirth}
            register={register}
            className={mobileFieldClass}
          />
          <FormField
            id="phoneNumber"
            icon={Phone}
            placeholder="Phone number"
            error={errors.phoneNumber}
            register={register}
            className={mobileFieldClass}
          />
          <SelectField
            id="gender"
            icon={User}
            placeholder="Gender"
            error={errors.gender}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            register={register}
            className={mobileSelectClass}
          />
          <SelectField
            id="country"
            icon={Lock}
            placeholder="Country of Residence"
            error={errors.country}
            options={countryOptions}
            register={register}
            className={mobileSelectClass}
          />
          <ErrorField message={error?.message || skipError?.message} />
        </div>
        <div className="space-y-3.25 max-sm:mt-auto max-sm:-mx-5 max-sm:border-t max-sm:border-border max-sm:px-5 max-sm:pt-4 max-sm:pb-4">
          <div className="flex flex-col gap-4 mt-1 md:flex-row max-sm:mt-0 max-sm:grid max-sm:grid-cols-[126px_1fr] max-sm:gap-3.5">
            <Button
              type="button"
              onClick={() => setStep(0)}
              variant="outline"
              size="lg"
              className="flex-1 max-sm:h-[50px] max-sm:text-[16px]"
            >
              Back
            </Button>
            <Button
              size="lg"
              className="hidden flex-3 sm:inline-flex"
              disabled={!isValid}
              variant={isValid ? "default" : "disabled"}
              type="submit"
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
            <Button
              size="lg"
              className="h-[50px] text-[16px] sm:hidden"
              disabled={isPending}
              variant={isPending ? "disabled" : "default"}
              type="submit"
            >
              {isPending ? "Submitting..." : "Continue"}
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

export default Step1;
