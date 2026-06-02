import { create } from "zustand";

type ModalType = "personal-info" | "bvn" | null;

type OnboardingModalStore = {
  activeModal: ModalType;

  isIdSelfieOpen: boolean;

  openIdSelfie: () => void;
  closeIdSelfie: () => void;

  openPersonalInfo: () => void;
  openBvn: () => void;
  closeModal: () => void;
};

export const useOnboardingModalStore = create<OnboardingModalStore>((set) => ({
  activeModal: null,

  isIdSelfieOpen: false,

  openPersonalInfo: () => set({ activeModal: "personal-info" }),

  openBvn: () => set({ activeModal: "bvn" }),

  openIdSelfie: () => set({ isIdSelfieOpen: true }),

  closeIdSelfie: () => set({ isIdSelfieOpen: false }),

  closeModal: () => set({ activeModal: null }),
}));
