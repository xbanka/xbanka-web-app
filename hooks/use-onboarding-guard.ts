// hooks/use-onboarding-guard.ts
"use client";

import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { isOnboardingStepCompleted } from "@/lib/verificationProgress";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";

export const useOnboardingGuard = () => {
  const { data: profileData } = UseProfileUser();
  const { data: verificationData } = UseVerificationStatus();

  const openPersonalInfo = useOnboardingModalStore(
    (state) => state.openPersonalInfo,
  );

  const openBvn = useOnboardingModalStore((state) => state.openBvn);

  const openIdSelfie = useOnboardingModalStore((state) => state.openIdSelfie);

  const profile = profileData?.data;

  const progress = verificationData?.data?.progress ?? [];

  const identityCompleted = isOnboardingStepCompleted(
    progress.find((item: { id: string }) => item.id === "IDENTITY"),
  );

  const selfieCompleted = isOnboardingStepCompleted(
    progress.find((item: { id: string }) => item.id === "SELFIE"),
  );

  const hasPersonalInfo =
    !!profile?.firstName &&
    !!profile?.lastName &&
    !!profile?.dateOfBirth &&
    !!profile?.gender &&
    !!profile?.phoneNumber &&
    !!profile?.country;

  const hasTierOne = profile?.kycStatus?.bvnVerified;

  const hasIdentityVerification =
    identityCompleted && selfieCompleted;

  const validateUser = () => {
    // Step 1 → personal info
    if (!hasPersonalInfo) {
      openPersonalInfo();
      return false;
    }

    // Step 2 → BVN
    if (!hasTierOne) {
      openBvn();
      return false;
    }

    return true;
  };

  const validateCryptoSend = () => {
    if (!hasPersonalInfo) {
      openPersonalInfo();
      return false;
    }

    if (!hasTierOne) {
      openBvn();
      return false;
    }

    if (!hasIdentityVerification) {
      openIdSelfie();
      return false;
    }

    return true;
  };

  return {
    validateUser,
    validateCryptoSend,
    profile,
    hasIdentityVerification,
    hasPersonalInfo,
    hasTierOne,
  };
};
