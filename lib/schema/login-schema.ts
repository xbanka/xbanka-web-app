import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "8 characters minimum")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Must include a symbol")
    .regex(/[A-Za-z]/, "Must include a letter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;