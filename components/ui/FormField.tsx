import { cn } from "@/lib/utils";
import * as React from "react";
import { Input } from "./input";
import { Icon, LucideIcon } from "lucide-react";
import { FieldError } from "react-hook-form";
import { Label } from "./label";
import { ErrorField } from "./field-error";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  id: string;
  type?: string;
  placeholder?: string;
  register?: any;
  disabled?: boolean;
  error?: FieldError;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  register,
  error,
  disabled,
  value,
  onChange,
}: FormFieldProps) {
  
  return (
    <div className={cn("space-y-2")}>
      {label && (
        <Label label={label} />
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${Icon ? "pl-10 pr-4" : "px-4"}`}
          {...register(id)}
          value={value}
          onChange={onChange}
          {...(register ? register(id) : {})}
        />
      </div>
      {error && (
        <ErrorField message={error.message} />
      )}
    </div>
  );
}
