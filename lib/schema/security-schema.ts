import z from "zod";

export const changePasswordSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, "PIN must contain numbers only"),
  oldPassword: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
  newPassword: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
});

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;