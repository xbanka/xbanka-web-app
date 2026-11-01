// hooks/use-onboarding-guard.ts
"use client";

import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import {
  KycBlocker,
  cryptoSendBlocker,
  hasPersonalInfo as personalInfoDone,
  userBlocker,
} from "@/lib/kycGate";
import { isStepDone } from "@/lib/verificationProgress";
import { useOnboardingModalStore } from "@/store/onboarding-modal-store";

export const useOnboardingGuard = () => {
  const profileQuery = UseProfileUser();
  const verificationQuery = UseVerificationStatus();

  const openPersonalInfo = useOnboardingModalStore(
    (state) => state.openPersonalInfo,
  );

  const openBvn = useOnboardingModalStore((state) => state.openBvn);

  const openIdSelfie = useOnboardingModalStore((state) => state.openIdSelfie);

  const profile = profileQuery.data?.data;
  const verification = verificationQuery.data?.data;

  const hasPersonalInfo = personalInfoDone(profile);
  const hasTierOne = profile?.kycStatus?.bvnVerified;
  const hasIdentityVerification =
    isStepDone(verification, "IDENTITY") && isStepDone(verification, "SELFIE");

  const openFor = (blocker: KycBlocker) => {
    if (blocker === "personal-info") openPersonalInfo();
    if (blocker === "bvn") openBvn();
    if (blocker === "id-selfie") openIdSelfie();
    return blocker === null;
  };

  const validateUser = () => openFor(userBlocker(profile));

  /**
   * Checks against a fresh verification status, not the 5-minute cache: a
   * selfie finished on another device (QR flow) would otherwise still look
   * missing and the liveness check would open again.
   */
  const validateCryptoSend = async () => {
    const [freshProfile, freshVerification] = await Promise.all([
      profileQuery.refetch(),
      verificationQuery.refetch(),
    ]);
    return openFor(
      cryptoSendBlocker(
        freshProfile.data?.data ?? profile,
        freshVerification.data?.data ?? verification,
      ),
    );
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
