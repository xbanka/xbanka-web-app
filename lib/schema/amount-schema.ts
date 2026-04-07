import z from "zod";

export const amountSchema = z.object({
  amount: z.string(),
  receiveAmount: z.string().optional(),
  sourceCurrency: z.string(),
  targetCurrency: z.string()
});

export type amountFormValues = z.infer<typeof amountSchema>;