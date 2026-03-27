import z from "zod";

export const bvnSchema = z.object({
  bvn: z
    .string()
    .min(11, "BVN must be exactly 11 digits")
    .max(11, "BVN must be exactly 11 digits")
    .regex(/^\d+$/, "BVN must contain numbers only"),
});
 
export const pinSchema = z.object({
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(6, "PIN must be at most 6 digits")
    .regex(/^\d+$/, "PIN must contain numbers only"),
});
 
export type BvnForm = z.infer<typeof bvnSchema>;
export type PinForm = z.infer<typeof pinSchema>;
export type ModalState = "verify" | "error" | "success" | "pin";