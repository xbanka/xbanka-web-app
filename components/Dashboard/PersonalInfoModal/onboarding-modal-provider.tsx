// components/providers/onboarding-modal-provider.tsx
"use client";

import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { PersonalInfoModal } from "./personal-info-modal";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";

export const OnboardingModalProvider = () => {
  const { activeModal, closeModal } = useOnboardingModalStore();

  return (
    <>
      {activeModal === "personal-info" && (
        <PersonalInfoModal onClose={closeModal} />
      )}

      {activeModal === "bvn" && (
        <BvnModal onClose={closeModal} onCompleted={closeModal} />
      )}

      {activeModal === "id-selfie" && (
        <IdSelfieModal onClose={closeModal} onCompleted={closeModal} />
      )}
    </>
  );
};
