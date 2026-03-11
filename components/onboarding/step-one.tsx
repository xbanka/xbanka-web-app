import { Calendar, Lock, Phone, User } from "lucide-react";
import { FormField } from "../ui/FormField";
import { SelectField } from "../ui/select";
import { FormHeader } from "../ui/FormHeader";
import { FieldError, useForm } from "react-hook-form";
import PhoneNumberField from "../ui/Phonenumberfield";
import { useState } from "react";
import { COUNTRIES, Country, countryOptions } from "@/lib/countries";
import { step1FormValues, step1Schema } from "@/lib/schema/onboarding-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserIdStore } from "@/store/verify-id.store";
import { useUserProfile } from "@/lib/services/onboarding.service";
import { Button } from "../ui/button";

export interface StepOneProps {
  setStep: (n: number) => void;
}

function Step1({setStep}: StepOneProps) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const userId = useUserIdStore((s) => s.userId);

  const { isError, isPending, error, data, mutate } = useUserProfile();
  const {
    register,
    reset,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<step1FormValues>({
    resolver: zodResolver(step1Schema),
    mode: "onTouched",
  });

  const onsubmit = async (data: step1FormValues) => {
    console.log(userId);
    if (!userId) return;
    const payload = {
      userId,
      firstName: data.firstName,
      lastName: data.firstName,
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      country: data.country,
    };
    mutate(payload, {
      onSuccess: () => {
        reset();
        setStep(1)
      },
    });
  };

  return (
    <>
      <FormHeader
        className="space-y-2"
        title="Let's set up your account"
        subtitle="Provide a few details to set up your xbanka account"
      />
      <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
        <FormField
          id="firstName"
          icon={User}
          placeholder="First name"
          error={errors.firstName}
          register={register}
        />
        <FormField
          id="lastName"
          icon={User}
          placeholder="Last name"
          error={errors.lastName}
          register={register}
        />
        <FormField
          id="dateOfBirth"
          icon={Calendar}
          placeholder="Date of Birth"
          type="date"
          error={errors.dateOfBirth}
          register={register}
        />
        <PhoneNumberField
          selectedCountry={country}
          onCountryChange={setCountry}
          id="phoneNumber"
          placeholder="Phone number"
          error={errors.country}
          register={register}
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
        />
        <SelectField
          id="country"
          icon={Lock}
          placeholder="Country of Residence"
          error={errors.country}
          options={countryOptions}
          register={register}
        />

        <div className="flex flex-col md:flex-row gap-4 mt-1">
          <Button variant="outline" size="lg" className="flex-1">
            Cancel
          </Button>
          <Button
            size="lg"
            className="flex-3"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default Step1;
