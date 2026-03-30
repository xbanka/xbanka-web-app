import z from "zod";

export const bankSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
export type BankForm = z.infer<typeof bankSchema>;
 
export const BANKS = [
  "GTBank", "Access Bank", "Zenith Bank", "First Bank",
  "UBA", "Fidelity Bank", "Sterling Bank", "Stanbic IBTC",
  "Moniepoint", "OPay", "Kuda", "FCMB",
];

export const cardSchema = z.object({
  cardholderName: z.string().min(2, "Name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
  saveCard: z.boolean().optional(),
});
export type CardForm = z.infer<typeof cardSchema>;