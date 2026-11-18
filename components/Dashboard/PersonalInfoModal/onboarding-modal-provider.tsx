// components/providers/onboarding-modal-provider.tsx
"use client";

import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { PersonalInfoModal } from "./personal-info-modal";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";
import { VerifyIdentityPrompt } from "../Onboarding-Journey-Modal/verify-identity-prompt";

export const OnboardingModalProvider = () => {
  const { activeModal, closeModal, openIdSelfie } = useOnboardingModalStore();

  return (
    <>
      {activeModal === "id-selfie-prompt" && (
        <VerifyIdentityPrompt onVerify={openIdSelfie} onClose={closeModal} />
      )}

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
