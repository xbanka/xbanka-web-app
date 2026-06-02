// components/providers/onboarding-modal-provider.tsx
"use client";

import { useOnboardingModalStore } from "@/store/onboarding-modal-store";
import { PersonalInfoModal } from "./personal-info-modal";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";

export const OnboardingModalProvider = () => {
  const { activeModal, closeModal } = useOnboardingModalStore();
  const isIdSelfieOpen = useOnboardingModalStore(
    (state) => state.isIdSelfieOpen,
  );

  const closeIdSelfie = useOnboardingModalStore((state) => state.closeIdSelfie);

  return (
    <>
      {activeModal === "personal-info" && (
        <PersonalInfoModal onClose={closeModal} />
      )}

      {activeModal === "bvn" && (
        <BvnModal onClose={closeModal} onCompleted={closeModal} />
      )}

      {isIdSelfieOpen && (
        <IdSelfieModal onClose={closeIdSelfie} onCompleted={closeIdSelfie} />
      )}
    </>
  );
};
