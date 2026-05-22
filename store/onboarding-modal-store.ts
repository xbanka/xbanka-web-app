// stores/onboarding-modal-store.ts
import { create } from "zustand";

type ModalType =
  | "personal-info"
  | "bvn"
  | null;

type OnboardingModalStore = {
  activeModal: ModalType;

  openPersonalInfo: () => void;
  openBvn: () => void;
  closeModal: () => void;
};

export const useOnboardingModalStore =
  create<OnboardingModalStore>((set) => ({
    activeModal: null,

    openPersonalInfo: () =>
      set({ activeModal: "personal-info" }),

    openBvn: () =>
      set({ activeModal: "bvn" }),

    closeModal: () =>
      set({ activeModal: null }),
  }));