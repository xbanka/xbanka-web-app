"use client";

import { ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CloseBtn } from "@/components/ui/close-btn";
import { Button } from "@/components/ui/button";
import { kycPromptCopy } from "@/lib/kycGate";
import type { KycPromptState } from "@/store/onboarding-modal-store";

/**
 * Figma "Blocked - Verify identity" (node 9219-366), reused for every send
 * that the customer's tier does not cover yet: "Verify your BVN to send
 * money" below Tier 1, "Verify your identity to send ..." below Tier 2.
 * The main button ("Verify now", or "Continue" for personal details) hands
 * off to that step's form; "Later" and close dismiss.
 */
export function KycPrompt({
  prompt,
  onVerify,
  onClose,
}: {
  prompt: KycPromptState;
  onVerify: () => void;
  onClose: () => void;
}) {
  const { title, body, cta } = kycPromptCopy(prompt.blocker, prompt.action);
  return (
    <Modal onClose={onClose} className="p-0">
      <div
        role="dialog"
        aria-labelledby="kyc-prompt-title"
        className="relative px-8 pb-8 pt-16 text-center max-sm:px-5"
      >
        <CloseBtn onClose={onClose} className="absolute right-6 top-6" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-Green/40 bg-teal-light">
          <ShieldCheck className="h-7 w-7 text-Green" />
        </div>
        <h2
          id="kyc-prompt-title"
          className="mt-8 text-2xl font-semibold text-card-text max-sm:text-xl"
        >
          {title}
        </h2>
        <p className="mt-3 text-text">{body}</p>
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
            {cta}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
