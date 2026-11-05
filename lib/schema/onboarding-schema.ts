import { z } from "zod";

/**
 * Personal details collected at sign-up (email flow) and by the dashboard
 * personal-info form (Google sign-ups). Shared so the two can't drift.
 */
export const personalInfoFields = {
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  phoneNumber: z
    .string()
    .trim()
    .min(7, { message: "Phone number must be at least 7 characters" }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  country: z.string().min(1, { message: "Country is required" }),
};

export const step1Schema = z.object({
  ...personalInfoFields,
  // Optional. When filled it must be exactly 11 digits (spaces and hyphens are
  // ignored). It unlocks the international passport option at the ID step.
  nin: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{11}$/.test(v.replace(/[\s-]+/g, "")), {
      message: "NIN must be exactly 11 digits",
    }),
});

export type step1FormValues = z.infer<typeof step1Schema>;

/**
 * ID types offered at the identity step. The passport lookup needs the holder's
 * NIN, so International Passport is only offered once a NIN is saved.
 */
export const idTypeOptions = (hasNin: boolean) => [
  { value: "nin", label: "NIN" },
  ...(hasNin
    ? [{ value: "international_passport", label: "International Passport" }]
    : []),
  { value: "drivers_license", label: "Driver's License" },
  { value: "voters_card", label: "Voter's Card" },
];

export const step2Schema = z.object({
  bvn: z.string().length(11, { message: "BVN must be 11 characters long" }),
});

export type step2FormValues = z.infer<typeof step2Schema>;

/** Spaces and hyphens are common when people copy an ID number. */
export const cleanIdNumber = (value: string) => value.replace(/[\s-]+/g, "");

export const step3Schema = z
  .object({
    idType: z.enum(
      ["international_passport", "nin", "drivers_license", "voters_card"],
      {
        message: "Please select a valid ID type",
      },
    ),
    idNumber: z.string(),
    // True while a NIN already saved on the profile is being reused, so no
    // number is typed. Only meaningful for the NIN ID type.
    useSavedNin: z.boolean().optional(),
    document: z.any(),
  })
  // The same rules the server applies, so people see the problem while typing
  // instead of after an upload.
  .superRefine((data, ctx) => {
    const number = cleanIdNumber(data.idNumber);
    const fail = (message: string, path: "idNumber" | "idType" = "idNumber") =>
      ctx.addIssue({ code: "custom", path: [path], message });

    // The saved NIN is verified by the server; there is no number to check here.
    if (data.idType === "nin" && data.useSavedNin) return;
    if (data.idType !== "voters_card" && !number) {
      fail("Enter your ID number");
      return;
    }

    switch (data.idType) {
      case "nin":
        if (!/^\d{11}$/.test(number)) fail("NIN must be exactly 11 digits");
        break;
      case "international_passport":
        if (!/^[A-Za-z0-9]{6,12}$/.test(number))
          fail("Enter your passport number as printed, 6 to 12 letters and numbers");
        break;
      case "drivers_license":
        if (!/^[A-Za-z0-9]{8,20}$/.test(number))
          fail("Enter your driver's licence number as printed, 8 to 20 letters and numbers");
        break;
      case "voters_card":
        fail(
          "Voter's card can't be verified automatically yet. Please choose NIN, International Passport or Driver's License.",
          "idType",
        );
        break;
    }
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
