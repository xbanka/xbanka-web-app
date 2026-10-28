import { isStepDone } from "./verificationProgress";

type ProfileLike =
  | {
      kycStatus?: { bvnVerified?: unknown; idStatus?: unknown } | null;
    }
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

const APPROVED_ID_STATUSES = new Set([
  "APPROVED",
  "VERIFIED",
  "COMPLETED",
  "SUCCESS",
  "DONE",
]);

/**
 * Has this user really verified their BVN?
 *
 * Testers found accounts locked with no BVN ever entered, so the profile's
 * bvnVerified flag is not trusted on its own: it must be exactly true AND,
 * once the verification status has loaded, that status must show the BVN
 * step completed.
 */
export const isBvnVerified = (
  profile: ProfileLike,
  verification: VerificationLike,
) => {
  if (profile?.kycStatus?.bvnVerified !== true) return false;
  if (!verification) return true;
  return isStepDone(verification, "BVN");
};

/**
 * Has this user's identity document (NIN, passport, licence or voter's card)
 * been verified? The verification status must show the IDENTITY step
 * completed, and when the profile carries an idStatus it must be an approved
 * one, so a document still under review does not count.
 */
export const isIdentityVerified = (
  profile: ProfileLike,
  verification: VerificationLike,
) => {
  if (!isStepDone(verification, "IDENTITY")) return false;
  const idStatus = String(profile?.kycStatus?.idStatus ?? "")
    .trim()
    .toUpperCase();
  return idStatus === "" || APPROVED_ID_STATUSES.has(idStatus);
};

/**
 * First and last name lock only once KYC is complete: a verified BVN AND an
 * approved ID document. Until both are done the name stays editable.
 */
export const isNameLocked = (
  profile: ProfileLike,
  verification: VerificationLike,
) => isBvnVerified(profile, verification) && isIdentityVerified(profile, verification);
