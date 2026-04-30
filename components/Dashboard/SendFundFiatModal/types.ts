export type Tab = "select-recipient" | "bank-form" | "xbanka";
export type Step = "select-recipient" | "bank-form" | "enter-amount" | "confirm_bank" | "enter_pin" | "success" | "processing" ;

export interface Recipient {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  amount: number;
  narration: string;
}

export interface SendMoneyModalProps {
  onClose: () => void;
  onBack?: () => void;
}

export interface RecipientXbankaUsersTypes {
  id: string;
  name: string;
  uid: string;
  color: string;
}