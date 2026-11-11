"use client";
import { OtpInput } from "@/components/ui/otp-input";
import { ErrorField } from "@/components/ui/field-error";
import { CODE_LENGTH, PIN_LENGTH } from "@/lib/trusted-wallets";

/**
 * Transaction PIN and authenticator code. A wrong PIN and a wrong code share
 * one limit of 5 tries per 15 minutes, so each field says how many digits it
 * takes and the caller only enables submit when both are complete.
 *
 * The inputs keep their own digits: bump `resetKey` to clear them.
 */
export function PinAndCodeFields({
  resetKey,
  onPinChange,
  onCodeChange,
  error,
  disabled,
}: {
  resetKey: number;
  onPinChange: (pin: string) => void;
  onCodeChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-5">
      <OtpInput
        key={`pin-${resetKey}`}
        length={PIN_LENGTH}
        mask
        label="Transaction PIN"
        hint={`Your ${PIN_LENGTH}-digit transaction PIN.`}
        onChange={onPinChange}
        disabled={disabled}
      />
      <OtpInput
        key={`code-${resetKey}`}
        length={CODE_LENGTH}
        label="Authenticator code"
        hint={`Open your authenticator app and enter the ${CODE_LENGTH}-digit code.`}
        onChange={onCodeChange}
        disabled={disabled}
      />
      <ErrorField message={error} />
    </div>
  );
}
