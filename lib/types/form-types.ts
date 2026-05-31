import { LucideIcon } from "lucide-react";
import { FieldError, UseFormRegister } from "react-hook-form";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  id: string;
  type?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  disabled?: boolean;
  error?: FieldError;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean
}

export interface OptionProps {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  id: string;
  icon?: LucideIcon;
  placeholder?: string;
  options: OptionProps[];
  error?: FieldError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface CryptoOptionProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  image?: string;
}

export interface CryptoSelectFieldProps {
  currencyId?: boolean;
  icon?: LucideIcon;
  placeholder?: string;
  options: CryptoOptionProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: any;
  value: string;
}
