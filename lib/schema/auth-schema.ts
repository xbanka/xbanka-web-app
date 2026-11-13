import { z } from "zod";
import { personalInfoFields } from "./onboarding-schema";

export const signUpSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Must include a symbol")
    .regex(/[A-Za-z]/, "Must include a letter"),
  referral: z.string().optional(),
  ...personalInfoFields,
});

export type SignupFormData = z.infer<typeof signUpSchema>;

export const logInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  // Sign-in only checks the field is filled in. Complexity rules belong to the
  // flows that *set* a password (sign-up / reset); enforcing them here locks out
  // existing accounts whose password predates or differs from the current rules.
  password: z.string().min(1, "Password is required"),
});

export type logInFormData = z.infer<typeof logInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export type forgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address"),
    otp: z.string().min(1, "OTP is required"),
    password: z
      .string()
      .min(8, "8 characters minimum")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[^A-Za-z0-9]/, "Must include a symbol")
      .regex(/[A-Za-z]/, "Must include a letter"),

    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type resetPasswordData = z.infer<typeof resetPasswordSchema>;
