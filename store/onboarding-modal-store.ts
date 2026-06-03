import { create } from "zustand";

type ModalType = "personal-info" | "bvn" | "id-selfie" | null;

type OnboardingModalStore = {
  activeModal: ModalType;

  openIdSelfie: () => void;

  openPersonalInfo: () => void;
  openBvn: () => void;
  closeModal: () => void;
};

export const useOnboardingModalStore = create<OnboardingModalStore>((set) => ({
  activeModal: null,

  openPersonalInfo: () => set({ activeModal: "personal-info" }),

  openBvn: () => set({ activeModal: "bvn" }),

  openIdSelfie: () => set({ activeModal: "id-selfie" }),

  closeModal: () => set({ activeModal: null }),
}));
