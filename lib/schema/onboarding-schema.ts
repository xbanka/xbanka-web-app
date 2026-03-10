import { z } from "zod";

export const step1Schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().min(1),
  phoneNumber: z.string().min(7),
  gender: z.enum(["male", "female", "other"]),
  country: z.string().min(1),
});

export type step1FormValues = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  bvn: z.string().length(11),
});

export type step2FormValues = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  idType: z.enum([
    "international_passport",
    "nin",
    "drivers_license",
    "voters_card",
  ]),
  idNumber: z.string().min(5),
  document: z.any(),
});

export type step3FormValues = z.infer<typeof step3Schema>;

export const step4Schema = z.object({
  selfie: z.any(),
});

export type step4FormValues = z.infer<typeof step4Schema>;

export const step5Schema = z.object({
  address: z.string().min(5),
  landmark: z.string().optional(),
  residenceCountry: z.string(),
  state: z.string(),
  residenceDocumentType: z.enum([
    "utility_bill",
    "bank_statement",
    "tenancy_agreement",
  ]),
  residenceDocument: z.any(),
});

export type step5FormValues = z.infer<typeof step5Schema>;

export const onboardingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
