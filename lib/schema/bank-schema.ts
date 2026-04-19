import z from "zod";

export const bankSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountName: z.string().min(1, "Please enter your account name"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
export type BankForm = z.infer<typeof bankSchema>;
 
export const MOCK_RESOLVED = {
  accountName: "John Doe",
  accountType: "Savings",
};
 
export const BANK_OPTIONS = [
  { value: "gtb", label: "GTB" },
  { value: "access", label: "Access Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "firstbank", label: "First Bank" },
  { value: "uba", label: "UBA" },
  { value: "fidelity", label: "Fidelity Bank" },
  { value: "fcmb", label: "FCMB" },
  { value: "sterling", label: "Sterling Bank" },
  { value: "stanbic", label: "Stanbic IBTC" },
  { value: "moniepoint", label: "Moniepoint" },
  { value: "opay", label: "OPay" },
  { value: "kuda", label: "Kuda" },
];

export const cardSchema = z.object({
  cardholderName: z.string().min(2, "Name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
  saveCard: z.boolean().optional(),
});
export type CardForm = z.infer<typeof cardSchema>;

// const bankSchema = z.object({
//   bankName: z.string().min(1, "Please select a bank"),
//   accountNumber: z
//     .string()
//     .regex(/^\d{10}$/, "Account number must be 10 digits"),
// });
// export type BankForm = z.infer<typeof bankSchema>;