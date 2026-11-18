import { create } from "zustand";

type ModalType =
  | "personal-info"
  | "bvn"
  | "id-selfie-prompt"
  | "id-selfie"
  | null;

type OnboardingModalStore = {
  activeModal: ModalType;

  /** "Verify your identity to send crypto" intro shown before the ID/selfie flow. */
  openIdSelfiePrompt: () => void;
  openIdSelfie: () => void;

  openPersonalInfo: () => void;
  openBvn: () => void;
  closeModal: () => void;
};

export const useOnboardingModalStore = create<OnboardingModalStore>((set) => ({
  activeModal: null,

  openPersonalInfo: () => set({ activeModal: "personal-info" }),

  openBvn: () => set({ activeModal: "bvn" }),

  openIdSelfiePrompt: () => set({ activeModal: "id-selfie-prompt" }),

  openIdSelfie: () => set({ activeModal: "id-selfie" }),

  closeModal: () => set({ activeModal: null }),
}));
