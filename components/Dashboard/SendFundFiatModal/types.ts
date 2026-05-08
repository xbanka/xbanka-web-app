export type Tab = "select-recipient" | "bank-form";

export type Step =
  | "select-recipient"
  | "enter-amount"
  | "enter-amount-xbanka"
  | "confirm_bank"
  | "confirm-xbanka"
  | "enter_pin_xbanka"
  | "enter_pin"
  | "processing-xbanka-users"
  | "processing"
  | "success";

export interface Recipient {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  amount: number;
  narration: string;
}
export interface XbankaTransferRecipient {
  id: string;
  name: string;
  uid: string;
  amount?: number;
  narration?: string;
}

export interface SendMoneyModalProps {
  onClose: () => void;
  onBack?: () => void;
}

export interface XbankaUserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}
export interface XbankaUser {
  id: string;
  createdAt: string;
  profile: XbankaUserProfile | null;
  email: string;
}