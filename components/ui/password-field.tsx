"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  useFormContext,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "./label";
import { PasswordChecks } from "./password-checks";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { cn } from "@/lib/utils";
import { ErrorField } from "./field-error";

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  id: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  register?: UseFormRegister<TFieldValues>;
  error?: FieldError;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

const PasswordField = <TFieldValues extends FieldValues>({
  id,
  label,
  placeholder,
  icon: Icon,
  register,
  error,
  disabled,
  autoComplete,
  className,
}: PasswordFieldProps<TFieldValues>) => {
  const [show, setShow] = useState(false);

  // watch password value (guard in case component is rendered outside a FormProvider)
  const formContext = useFormContext();
  const password = formContext?.watch(id) || "";
  const { checks, score, strengthPercent } = usePasswordStrength(password);
  const strengthColor =
    score <= 2 ? "bg-[#FF5F58]" : score === 3 ? "bg-[#C19700]" : "bg-Green";

  // validation checks

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label label={label} />}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-placeholder" />
        )}

        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          className={`${Icon ? "pl-10 pr-10" : "px-3 pr-10"}`}
          {...(register ? register(id) : {})}
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onMouseDown={(e) => e.preventDefault()}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {password.length > 0 && (
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-border"
          aria-hidden="true"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              strengthColor,
            )}
            style={{ width: `${strengthPercent}%` }}
          />
        </div>
      )}

      {password.length > 0 && (
        <div className="space-y-1 text-sm text-text">
          <PasswordChecks
            checks={checks.minLength}
            errorMessage="8 characters minimum"
          />
          <PasswordChecks
            checks={checks.uppercase}
            errorMessage="any uppercase letter"
          />
          <PasswordChecks
            checks={checks.lowercase}
            errorMessage="any lowercase letter"
          />
          <PasswordChecks checks={checks.symbol} errorMessage="any symbol" />
          <PasswordChecks checks={checks.letter} errorMessage="any letter" />
        </div>
      )}
      {error && <ErrorField message={error.message} />}
    </div>
  );
};

export default PasswordField;
