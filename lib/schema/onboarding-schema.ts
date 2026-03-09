import { z } from "zod";

export const step1Schema = z.object({
  email: z.string().email(),
  date: z.string().min(1),
  phone: z.string().min(7),
  gender: z.enum(["male", "female", "other"]),
  country: z.string().min(1)
});

export const step2Schema = z.object({
  bvn: z.string().length(11)
});

export const step3Schema = z.object({
  idType: z.enum([
    "international_passport",
    "nin",
    "drivers_license",
    "voters_card"
  ]),
  idNumber: z.string().min(5),
  document: z.any()
});

export const step4Schema = z.object({
  selfie: z.any()
});

export const step5Schema = z.object({
  address: z.string().min(5),
  landmark: z.string().optional(),
  residenceCountry: z.string(),
  state: z.string(),
  residenceDocumentType: z.enum([
    "utility_bill",
    "bank_statement",
    "tenancy_agreement"
  ]),
  residenceDocument: z.any()
});