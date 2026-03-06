import { Calendar, Lock, Phone, User } from "lucide-react";
import { FormField } from "../ui/FormField";
import { SelectField } from "../ui/select";
import { Card } from "../ui/Card";
import { FormHeader } from "../ui/FormHeader";
import { FieldError } from "react-hook-form";

export interface StepOneProps{
  register?: any
  errors?: FieldError;
}

function Step1({ register, errors }: StepOneProps) {
  return (
    <>
      <FormHeader
        title="Let's set up your account"
        subtitle="Provide a few details to set up your xbanka account"
      />
      <div className="space-y-3">
        <FormField
          id="fullName"
          icon={User}
          placeholder="Full name"
          error={errors}
          register={register}
        />
        <FormField
          id="dob"
          icon={Calendar}
          placeholder="Date of Birth"
          type="date"
          error={errors}
          register={register}
        />
        <FormField
          id="phone"
          icon={Phone}
          placeholder="Phone number"
          type="tel"
          error={errors}
          register={register}
        />
        <SelectField
          icon={User}
          placeholder="Gender"
          error={errors}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
          registration={register("gender", {
            required: "Please select your gender",
          })}
        />
        <SelectField
          icon={Lock}
          placeholder="Country of Residence"
          error={errors}
          options={[
            { value: "ng", label: "Nigeria" },
            { value: "gh", label: "Ghana" },
            { value: "ke", label: "Kenya" },
          ]}
          registration={register("country", {
            required: "Please select your country",
          })}
        />
      </div>
    </>
  );
}

export default Step1;
