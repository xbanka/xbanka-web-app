"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { PrivacyPolicyModal } from "./privacy-policy-modal";

/**
 * The "Privacy Policy" text used in consent copy across sign-up, sign-in and
 * the trade forms. Owns its own modal state so each usage stays a one-liner.
 */
export function PrivacyPolicyLink({
  className,
  label = "Privacy Policy",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "cursor-pointer text-Green underline-offset-2 hover:underline",
          className,
        )}
      >
        {label}
      </button>
      {open && <PrivacyPolicyModal onClose={() => setOpen(false)} />}
    </>
  );
}
