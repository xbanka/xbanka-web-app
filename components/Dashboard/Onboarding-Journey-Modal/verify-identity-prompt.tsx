"use client";

import { ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CloseBtn } from "@/components/ui/close-btn";
import { Button } from "@/components/ui/button";

/**
 * Figma "Blocked - Verify identity" (node 9219-366). Shown when a customer
 * taps Send on crypto without ID + selfie done. "Verify now" hands off to the
 * ID/selfie modal; "Later" and close just dismiss.
 */
export function VerifyIdentityPrompt({
  onVerify,
  onClose,
}: {
  onVerify: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} className="p-0">
      <div
        role="dialog"
        aria-labelledby="verify-identity-title"
        className="relative px-8 pb-8 pt-16 text-center max-sm:px-5"
      >
        <CloseBtn onClose={onClose} className="absolute right-6 top-6" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-Green/40 bg-teal-light">
          <ShieldCheck className="h-7 w-7 text-Green" />
        </div>
        <h2
          id="verify-identity-title"
          className="mt-8 text-2xl font-semibold text-card-text max-sm:text-xl"
        >
          Verify your identity to send crypto
        </h2>
        <p className="mt-3 text-text">
          Sending crypto needs ID verification. It only takes 2 minutes.
        </p>
        <div className="mt-10 flex gap-4">
          <Button
            variant="outline"
            size="lg"
            className="w-1/3"
            onClick={onClose}
          >
            Later
          </Button>
          <Button size="lg" className="flex-1" onClick={onVerify}>
            Verify now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
