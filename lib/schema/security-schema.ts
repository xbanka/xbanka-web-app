import z from "zod";

export const changePasswordSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, "PIN must contain numbers only"),
  oldPassword: z
    .string(),
  newPassword: z
    .string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Must include a symbol")
    .regex(/[A-Za-z]/, "Must include a letter"),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;