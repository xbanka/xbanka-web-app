import { create } from "zustand";
import type { KycBlocker, SendAction } from "@/lib/kycGate";

type ModalType = "personal-info" | "bvn" | "kyc-prompt" | "id-selfie" | null;

/** What the "Verify ... to send" prompt asks for, and for which send. */
export type KycPromptState = {
  blocker: Exclude<KycBlocker, null>;
  action: SendAction;
};

type OnboardingModalStore = {
  activeModal: ModalType;
  prompt: KycPromptState | null;

  /**
   * "Verify your BVN / identity to send ..." intro shown before the KYC form.
   * "Verify now" opens the form for `blocker`.
   */
  openKycPrompt: (prompt: KycPromptState) => void;
  openIdSelfie: () => void;

  openPersonalInfo: () => void;
  openBvn: () => void;
  closeModal: () => void;
};

export const useOnboardingModalStore = create<OnboardingModalStore>((set) => ({
  activeModal: null,
  prompt: null,

  openPersonalInfo: () => set({ activeModal: "personal-info", prompt: null }),

  openBvn: () => set({ activeModal: "bvn", prompt: null }),

  openKycPrompt: (prompt) => set({ activeModal: "kyc-prompt", prompt }),

  openIdSelfie: () => set({ activeModal: "id-selfie", prompt: null }),

  closeModal: () => set({ activeModal: null, prompt: null }),
}));
