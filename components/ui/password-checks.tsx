import { Check, X } from "lucide-react";
import React from "react";

interface PasswordChecksProps {
  errorMessage: string;
  checks: boolean;
}

export const PasswordChecks = ({
  errorMessage,
  checks,
}: PasswordChecksProps) => {
  return (
    <div className="flex items-center gap-1">
      <div>
        {checks ? (
          <Check className="w-[19.5px] h-[19.5px] rounded-full border-2 p-0.5 font-bold border-text transition-all duration-300 ease-out scale-100" />
        ) : (
          <X className="w-[19.5px] h-[19.5px] rounded-full border-2 p-0.5 font-bold border-text transition-all duration-300 ease-out scale-100" />
        )}
      </div>
      <p className="text-text">{errorMessage}</p>
    </div>
  );
};
