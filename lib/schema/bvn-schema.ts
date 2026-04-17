import z from "zod";

export const bvnSchema = z.object({
  bvn: z
    .string()
    .min(11, "BVN must be exactly 11 digits")
    .max(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain numbers only"),
});

export const pinSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, "PIN must contain numbers only"),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
});

export const updatePinSchema = z.object({
  otp: z
    .string()
    .regex(/^\d+$/, "PIN must contain numbers only"),
  oldPin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
  newPin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(4, "PIN must be at most 4 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
});

export type BvnForm = z.infer<typeof bvnSchema>;
export type PinForm = z.infer<typeof pinSchema>;
export type UpdatePinForm = z.infer<typeof updatePinSchema>;
export type ModalState = "verify" | "error" | "success" | "pin" | "pinSuccess";
