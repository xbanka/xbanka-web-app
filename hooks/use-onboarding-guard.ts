// hooks/use-onboarding-guard.ts
"use client";

import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import {
  KycBlocker,
  SendAction,
  hasPersonalInfo as personalInfoDone,
  sendBlocker,
  tierTwoBlocker,
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
  const openKycPrompt = useOnboardingModalStore((state) => state.openKycPrompt);

  const profile = profileQuery.data?.data;
  const verification = verificationQuery.data?.data;

  const hasPersonalInfo = personalInfoDone(profile);
  const hasTierOne = profile?.kycStatus?.bvnVerified;
  const hasIdentityVerification =
    isStepDone(verification, "IDENTITY") && isStepDone(verification, "SELFIE");

  /** Buy, sell, convert: straight to the missing form, no intro. */
  const validateUser = () => {
    const blocker: KycBlocker = userBlocker(profile);
    if (blocker === "personal-info") openPersonalInfo();
    if (blocker === "bvn") openBvn();
    if (blocker === "id-selfie") openIdSelfie();
    return blocker === null;
  };

  /**
   * Reads a fresh profile and verification status, not the 5-minute cache:
   * a BVN or selfie finished on another device (QR flow) would otherwise
   * still look missing and the prompt would open again.
   */
  const fresh = async () => {
    const [freshProfile, freshVerification] = await Promise.all([
      profileQuery.refetch(),
      verificationQuery.refetch(),
    ]);
    return {
      profile: freshProfile.data?.data ?? profile,
      verification: freshVerification.data?.data ?? verification,
    };
  };

  /**
   * Before a send starts: true when the customer's tier covers it, else opens
   * the "Verify your BVN / identity to send ..." prompt and returns false.
   */
  const validateSend = async (action: SendAction) => {
    const latest = await fresh();
    const blocker = sendBlocker(action, latest.profile, latest.verification);
    if (blocker) openKycPrompt({ blocker, action });
    return blocker === null;
  };

  const validateCryptoSend = () => validateSend("crypto");

  /**
   * Backstop: the backend refused a send with "tier required" even though
   * Send let the user in (status changed since, or stale data). Opens the
   * prompt for the next missing step (BVN below Tier 1, ID + selfie for a
   * Tier 1 user) and
   * returns true. Returns false when our data already shows Tier 2 complete
   * (e.g. ID still under review), so the caller shows the backend message.
   */
  const promptForTierError = async (action: SendAction) => {
    const latest = await fresh();
    const blocker = tierTwoBlocker(latest.profile, latest.verification);
    if (blocker) openKycPrompt({ blocker, action });
    return blocker !== null;
  };

  return {
    validateUser,
    validateSend,
    validateCryptoSend,
    promptForTierError,
    profile,
    hasIdentityVerification,
    hasPersonalInfo,
    hasTierOne,
  };
};
