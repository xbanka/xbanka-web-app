import { z } from "zod";

export const step1Schema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone number must be at least 7 characters" }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  country: z.string().min(1, { message: "Country is required" }),
});

export type step1FormValues = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  bvn: z.string().length(11, { message: "BVN must be 11 characters long" }),
});

export type step2FormValues = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  idType: z.enum(
    ["international_passport", "nin", "drivers_license", "voters_card"],
    {
      message: "Please select a valid ID type",
    },
  ),
  idNumber: z
    .string()
    .min(5, { message: "ID number must be at least 5 characters" }),
  document: z.any(),
});

export type step3FormValues = z.infer<typeof step3Schema>;

export const step4Schema = z.object({
  selfie: z.any(),
});

export type step4FormValues = z.infer<typeof step4Schema>;

export const step5Schema = z.object({
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  landmark: z
    .string()
    .min(2, { message: "Landmark must be at least 2 characters" }),
  country: z.string({
    message: "Please select your country",
  }),

  state: z.string({
    message: "Please select your state",
  }),

  residenceDocumentType: z.enum(
    ["utility_bill", "bank_statement", "tenancy_agreement"],
    {
      message: "Please select a valid document type",
    },
  ),
  residenceDocument: z.any(),
});

export type step5FormValues = z.infer<typeof step5Schema>;

export const onboardingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
