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

/**
 * The two Send buttons. Both need Tier 2 (KYC & Transaction Access spec,
 * 7.3 "Outbound and ownership-changing actions"): NGN to another XBanka user,
 * NGN to a third-party bank, crypto to a user or an external wallet.
 *
 * 7.3 also lists "withdraw NGN to own verified bank account" at Tier 1, but
 * Send cannot tell an own account from a third-party one before the user
 * picks it, so product chose to gate the whole fiat Send at Tier 2.
 */
export type SendAction = "fiat" | "crypto";

export const hasPersonalInfo = (p: GateProfile) =>
  !!p?.firstName &&
  !!p?.lastName &&
  !!p?.dateOfBirth &&
  !!p?.gender &&
  !!p?.phoneNumber &&
  !!p?.country;

/** Tier 1: personal details and a verified BVN. Also used by buy, sell, convert. */
export const userBlocker = (profile: GateProfile): KycBlocker => {
  if (!hasPersonalInfo(profile)) return "personal-info";
  if (!profile?.kycStatus?.bvnVerified) return "bvn";
  return null;
};

/**
 * Tier 2: Tier 1 first (spec 6.1, "cannot complete Tier 2 while Tier 1 is
 * incomplete"), then the ID and the liveness selfie.
 */
export const tierTwoBlocker = (
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

/** Sending crypto needs Tier 2. */
export const cryptoSendBlocker = tierTwoBlocker;

/** What must be verified before this send can start, or null when allowed. */
export const sendBlocker = (
  _action: SendAction,
  profile: GateProfile,
  verification: GateVerification,
): KycBlocker => tierTwoBlocker(profile, verification);

/**
 * Does this API error mean "your KYC tier is too low"? The withdrawal API says
 * "Withdrawal blocked: TIER_REQUIRED"; other send endpoints may word it their
 * own way ("Tier 2 required", "requires Tier 2", "KYC tier not met").
 */
export const isTierRequiredError = (error: unknown): boolean => {
  const message = (error as { message?: unknown } | null)?.message;
  if (typeof message !== "string") return false;
  return (
    /tier[\s_-]*(\d+[\s_-]*)?(verification[\s_-]*)?required/i.test(message) ||
    /requires?[\s_-]+(kyc[\s_-]+)?tier\b/i.test(message) ||
    /kyc[\s_-]+tier.*(required|insufficient|not[\s_-]+met)/i.test(message)
  );
};

const ACTION_COPY: Record<
  SendAction,
  { verb: string; subject: string; idReason: string }
> = {
  fiat: {
    verb: "send money",
    subject: "Sending money",
    idReason: "Sending money needs ID verification.",
  },
  crypto: {
    verb: "send crypto",
    subject: "Sending crypto",
    idReason: "Sending crypto needs ID verification.",
  },
};

/** Title, body and button label of the prompt shown before a send. */
export const kycPromptCopy = (
  blocker: Exclude<KycBlocker, null>,
  action: SendAction,
): { title: string; body: string; cta: string } => {
  const { verb, subject, idReason } = ACTION_COPY[action];
  if (blocker === "id-selfie") {
    return {
      title: `Verify your identity to ${verb}`,
      body: `${idReason} It only takes 2 minutes.`,
      cta: "Verify now",
    };
  }
  if (blocker === "personal-info") {
    return {
      title: `Add your personal details to ${verb}`,
      body: `${subject} needs your personal details and BVN. It only takes 2 minutes.`,
      cta: "Continue",
    };
  }
  return {
    title: `Verify your BVN to ${verb}`,
    body: `${subject} needs BVN verification. It only takes 2 minutes.`,
    cta: "Verify now",
  };
};
