import { Button } from "@/components/ui/button";
import { ErrorLayout } from "@/components/ui/error-layout";
import { FormField } from "@/components/ui/FormField";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import PhoneNumberField from "@/components/ui/Phonenumberfield";
import { SelectField } from "@/components/ui/select";
import { COUNTRIES, Country, countryOptions } from "@/lib/countries";
import { step1FormValues, step1Schema } from "@/lib/schema/onboarding-schema";
import { useSkipStep, useUserProfile } from "@/lib/services/onboarding.service";
import { UseProfileUser } from "@/lib/services/profile.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SuccessState } from "../Onboarding-Journey-Modal/success-state";

export const PersonalInfoModal = ({ onClose }: { onClose: () => void }) => {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [step, setStep] = useState<"form" | "success">("form");
  const { data: profileData } = UseProfileUser();
  const userId = profileData?.data?.userId;

  const { isPending, error, mutate } = useUserProfile();

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
        setStep("success");
      },
    });
  };

  return (
  <Modal className="p-0" onClose={onClose}>
    {step === "form" && (
      <>
        <ModalHeader
          className="px-10 py-6 max-sm:px-5 max-sm:py-4"
          title="Lets's get to know you better"
          subtitle={`Provide a few details to set up your xbanka account`}
          onClose={onClose}
        />

        <div className="pt-6 px-10 pb-10 max-sm:pt-4 max-sm:px-5 max-sm:pb-6">
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
              error={errors.phoneNumber}
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

            <ErrorLayout message={error?.message} />

            <div className="space-y-3.25">
              <div className="flex flex-col md:flex-row gap-4 mt-1">
                <Button
                  disabled
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>

                <Button
                  size="lg"
                  className="flex-3"
                  disabled={!isValid || isPending}
                  variant={
                    isPending || !isValid ? "disabled" : "default"
                  }
                  type="submit"
                >
                  {isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    )}

    {step === "success" && (
      <SuccessState
        title="Profile Updated Successfully"
        subtitle="Your personal information has been saved successfully."
        badge="verified"
        ctaLabel="Continue"
        onCta={() => {
          onClose();
        }}
        onClose={onClose}
      />
    )}
  </Modal>
);
//   return (
//     <Modal className="p-0" onClose={onClose}>
//       <ModalHeader
//         className="px-10 py-6"
//         title="Lets's get to know you better"
//         subtitle={`Provide a few details to set up your xbanka account`}
//         onClose={onClose}
//       />
//       <div className="pt-6 px-10 pb-10">
//         <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
//           <FormField
//             id="firstName"
//             icon={User}
//             placeholder="First name"
//             error={errors.firstName}
//             register={register}
//           />
//           <FormField
//             id="lastName"
//             icon={User}
//             placeholder="Last name"
//             error={errors.lastName}
//             register={register}
//           />
//           <FormField
//             id="dateOfBirth"
//             icon={Calendar}
//             placeholder="Date of Birth"
//             type="date"
//             error={errors.dateOfBirth}
//             register={register}
//           />
//           <PhoneNumberField
//             selectedCountry={country}
//             onCountryChange={setCountry}
//             id="phoneNumber"
//             placeholder="Phone number"
//             error={errors.country}
//             register={register}
//           />
//           <SelectField
//             id="gender"
//             icon={User}
//             placeholder="Gender"
//             error={errors.gender}
//             options={[
//               { value: "male", label: "Male" },
//               { value: "female", label: "Female" },
//               { value: "other", label: "Other" },
//             ]}
//             register={register}
//           />
//           <SelectField
//             id="country"
//             icon={Lock}
//             placeholder="Country of Residence"
//             error={errors.country}
//             options={countryOptions}
//             register={register}
//           />
//           <ErrorLayout message={error?.message || skipError?.message} />
//           <div className="space-y-3.25">
//             <div className="flex flex-col md:flex-row gap-4 mt-1">
//               <Button disabled variant="outline" size="lg" className="flex-1">
//                 Back
//               </Button>
//               <Button
//                 size="lg"
//                 className="flex-3"
//                 disabled={!isValid}
//                 variant={isValid ? "default" : "disabled"}
//                 type="submit"
//               >
//                 {isPending ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
};
