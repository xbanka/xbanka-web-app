import { isStepDone } from "./verificationProgress";

type GateProfile =
  | {
      firstName?: string | null;
      lastName?: string | null;
      dateOfBirth?: string | null;
      gender?: string | null;
      phoneNumber?: string | null;
      country?: string | null;
      kycStatus?: { bvnVerified?: unknown } | null;
    }
  | null
  | undefined;

type GateVerification = Parameters<typeof isStepDone>[0];

/** Which KYC modal must open before this action, or null when allowed. */
export type KycBlocker = "personal-info" | "bvn" | "id-selfie" | null;

export const hasPersonalInfo = (p: GateProfile) =>
  !!p?.firstName &&
  !!p?.lastName &&
  !!p?.dateOfBirth &&
  !!p?.gender &&
  !!p?.phoneNumber &&
  !!p?.country;

/** Fiat, buy, sell, convert: personal info and BVN. */
export const userBlocker = (profile: GateProfile): KycBlocker => {
  if (!hasPersonalInfo(profile)) return "personal-info";
  if (!profile?.kycStatus?.bvnVerified) return "bvn";
  return null;
};

/** Sending crypto also needs the ID and the liveness selfie on record. */
export const cryptoSendBlocker = (
  profile: GateProfile,
  verification: GateVerification,
): KycBlocker => {
  const blocker = userBlocker(profile);
  if (blocker) return blocker;
  if (!isStepDone(verification, "IDENTITY") || !isStepDone(verification, "SELFIE")) {
    return "id-selfie";
  }
  return null;
};
