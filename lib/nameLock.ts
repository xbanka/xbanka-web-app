import { isOnboardingStepCompleted } from "./verificationProgress";

type ProfileLike =
  | { kycStatus?: { bvnVerified?: unknown } | null }
  | null
  | undefined;

type VerificationLike =
  | {
      completedOnboardingSteps?: string[];
      progress?: {
        id: string;
        status?: string;
        isCompleted?: boolean;
        completed?: boolean;
      }[];
    }
  | null
  | undefined;

/**
 * Has this user really verified their BVN?
 *
 * The name fields lock once the BVN is verified, because from then on the
 * name has to match the bank record. Testers found accounts locked with no
 * BVN ever entered, so the profile's bvnVerified flag is no longer trusted
 * on its own: it must be exactly true AND, once the verification status has
 * loaded, that status must show the BVN step completed.
 */
export const isBvnVerified = (
  profile: ProfileLike,
  verification: VerificationLike,
) => {
  const flag = profile?.kycStatus?.bvnVerified === true;
  if (!flag) return false;
  if (!verification) return true;

  const step = verification.progress?.find((s) => s.id === "BVN");
  const stepDone =
    (verification.completedOnboardingSteps ?? []).includes("BVN") ||
    isOnboardingStepCompleted(step);

  return stepDone;
};
