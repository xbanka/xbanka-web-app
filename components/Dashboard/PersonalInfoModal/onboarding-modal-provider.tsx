// components/providers/onboarding-modal-provider.tsx
"use client";

import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { PersonalInfoModal } from "./personal-info-modal";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";
import { KycPrompt } from "../Onboarding-Journey-Modal/kyc-prompt";

export const OnboardingModalProvider = () => {
  const {
    activeModal,
    prompt,
    closeModal,
    openPersonalInfo,
    openBvn,
    openIdSelfie,
  } = useOnboardingModalStore();

  const startVerification = () => {
    if (prompt?.blocker === "personal-info") openPersonalInfo();
    else if (prompt?.blocker === "bvn") openBvn();
    else if (prompt?.blocker === "id-selfie") openIdSelfie();
    else closeModal();
  };

  return (
    <>
      {activeModal === "kyc-prompt" && prompt && (
        <KycPrompt
          prompt={prompt}
          onVerify={startVerification}
          onClose={closeModal}
        />
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
