import { useQuery } from "@tanstack/react-query";
import z from "zod";
import { getMarketPrices } from "../actions/wallet";

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
  { label: "Access Bank", value: "Access Bank" },
  { label: "Citibank Nigeria", value: "Citibank Nigeria" },
  { label: "Ecobank Nigeria", value: "Ecobank Nigeria" },
  { label: "Fidelity Bank", value: "Fidelity Bank" },
  { label: "First Bank of Nigeria", value: "First Bank of Nigeria" },
  { label: "First City Monument Bank", value: "First City Monument Bank" },
  { label: "Globus Bank", value: "Globus Bank" },
  { label: "Guaranty Trust Bank", value: "Guaranty Trust Bank" },
  { label: "Heritage Bank", value: "Heritage Bank" },
  { label: "Jaiz Bank", value: "Jaiz Bank" },
  { label: "Keystone Bank", value: "Keystone Bank" },
  { label: "Polaris Bank", value: "Polaris Bank" },
  { label: "PremiumTrust Bank", value: "PremiumTrust Bank" },
  { label: "Providus Bank", value: "Providus Bank" },
  { label: "Stanbic IBTC Bank", value: "Stanbic IBTC Bank" },
  { label: "Standard Chartered Bank", value: "Standard Chartered Bank" },
  { label: "Sterling Bank", value: "Sterling Bank" },
  { label: "Suntrust Bank", value: "Suntrust Bank" },
  { label: "Titan Bank", value: "Titan Bank" },
  { label: "Union Bank of Nigeria", value: "Union Bank of Nigeria" },
  { label: "United Bank For Africa", value: "United Bank For Africa" },
  { label: "Unity Bank", value: "Unity Bank" },
  { label: "Wema Bank", value: "Wema Bank" },
  { label: "Zenith Bank", value: "Zenith Bank" },
];

export const bankOptions = [
  { label: "Access Bank", value: "044" },
  { label: "Citibank Nigeria", value: "023" },
  { label: "Ecobank Nigeria", value: "050" },
  { label: "Fidelity Bank", value: "070" },
  { label: "First Bank of Nigeria", value: "011" },
  { label: "First City Monument Bank", value: "214" },
  { label: "Globus Bank", value: "00103" },
  { label: "Guaranty Trust Bank", value: "058" },
  { label: "Heritage Bank", value: "030" },
  { label: "Jaiz Bank", value: "301" },
  { label: "Keystone Bank", value: "082" },
  { label: "Polaris Bank", value: "076" },
  { label: "PremiumTrust Bank", value: "105" },
  { label: "Providus Bank", value: "101" },
  { label: "Stanbic IBTC Bank", value: "221" },
  { label: "Standard Chartered Bank", value: "068" },
  { label: "Sterling Bank", value: "232" },
  { label: "Suntrust Bank", value: "100" },
  { label: "Titan Bank", value: "102" },
  { label: "Union Bank of Nigeria", value: "032" },
  { label: "United Bank For Africa", value: "033" },
  { label: "Unity Bank", value: "215" },
  { label: "Wema Bank", value: "035" },
  { label: "Zenith Bank", value: "057" },
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