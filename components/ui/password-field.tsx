"use client";

import React, { useState } from "react";
import { Check, Eye, EyeOff, LucideIcon, X } from "lucide-react";
import { FieldError, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "./label";
import { PasswordChecks } from "./password-checks";
import { watch } from "fs/promises";
import { usePasswordStrength } from "@/hooks/use-password-strength";

interface PasswordFieldProps {
  id: string;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  register?: any;
  error?: FieldError;
  disabled?: boolean;
  autoComplete?: string;
}

const PasswordField = ({
  id,
  label,
  placeholder,
  icon: Icon,
  register,
  error,
  disabled,
  autoComplete,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  // watch password value (guard in case component is rendered outside a FormProvider)
  const formContext = useFormContext();
  const password = formContext?.watch(id) || "";
  const { checks, strengthLabel, strengthPercent } =
    usePasswordStrength(password);

  // validation checks

  return (
    <div className="space-y-2">
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
        <div>
          <div style={{ width: `${strengthPercent}%` }} />
          <p className="font-normal text-[12px] leading-4.5">{strengthLabel}</p>
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
    </div>
  );
};

export default PasswordField;
