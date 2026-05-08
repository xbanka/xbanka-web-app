import { Recipient } from "./types";


 
export const NIGERIAN_BANKS = [
  { value: "gtb", label: "Guaranty Trust Bank" },
  { value: "access", label: "Access Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "uba", label: "United Bank for Africa" },
  { value: "first", label: "First Bank of Nigeria" },
  { value: "stanbic", label: "Stanbic IBTC Bank" },
];
 
export const QUICK_AMOUNTS = [5000, 10000, 50000, 100000, 150000];

export const SEND_STEPS = {
  "select-recipient": 1,
  "bank-form": 1,
  "enter-amount": 2,
};

export const TOTAL_SEND_STEPS = 2;

export const SEND_STEP_LABELS = {
  "select-recipient": "Select recipient",
  "bank-form": "Bank details",
  "enter-amount": "Enter amount",
};