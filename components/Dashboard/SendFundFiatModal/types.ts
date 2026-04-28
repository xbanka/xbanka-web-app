export type Tab = "select-recipient" | "bank-form";
export type Step = "select-recipient" | "bank-form" | "enter-amount";
 
export interface Recipient {
  id: string;
  name: string;
  uid: string;
  bank?: string;
  avatar?: string;
  color?: string;
}
 
export interface SendMoneyModalProps {
  onClose: () => void;
  onBack?: () => void;
}