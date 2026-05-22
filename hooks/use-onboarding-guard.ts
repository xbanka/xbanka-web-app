// hooks/use-onboarding-guard.ts
"use client";

import { UseProfileUser } from "@/lib/services/profile.service";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";

export const useOnboardingGuard = () => {
  const { data: profileData } = UseProfileUser();

  const openPersonalInfo =
    useOnboardingModalStore(
      (state) => state.openPersonalInfo,
    );

  const openBvn =
    useOnboardingModalStore(
      (state) => state.openBvn,
    );

  const profile = profileData?.data;

  const hasPersonalInfo =
    !!profile?.firstName &&
    !!profile?.lastName &&
    !!profile?.dateOfBirth &&
    !!profile?.gender &&
    !!profile?.phoneNumber &&
    !!profile?.country;

  const hasTierOne =
    profile?.kycStatus?.bvnVerified;

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

  return {
    validateUser,
    profile,
    hasPersonalInfo,
    hasTierOne,
  };
};