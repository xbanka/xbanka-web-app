import { describe, expect, it } from "vitest";
import {
  KycBlocker,
  SendAction,
  isTierRequiredError,
  kycPromptCopy,
  sendBlocker,
  tierTwoBlocker,
} from "../kycGate";

// Spec: "XBanka KYC & Transaction Access", 6 "V1 Verification Tiers",
// 6.1 "Tier completion rules" and 7.3 "Outbound actions". Sweeps every combination of KYC state and
// send action against the table, so a change that quietly breaks one cell
// fails here. Offline: no backend, no LLM.

type State = {
  details: boolean;
  bvn: boolean;
  id: boolean;
  selfie: boolean;
};

const BOOLS = [false, true];
const STATES: State[] = BOOLS.flatMap((details) =>
  BOOLS.flatMap((bvn) =>
    BOOLS.flatMap((id) => BOOLS.map((selfie) => ({ details, bvn, id, selfie }))),
  ),
);
const ACTIONS: SendAction[] = ["fiat", "crypto"];

/** Spec tier the state reaches. Tier 2 needs Tier 1 (6.1). */
const tierOf = (s: State) => {
  if (!s.details || !s.bvn) return 0;
  return s.id && s.selfie ? 2 : 1;
};
/**
 * Spec 7.3. The fiat Send button covers NGN to another XBanka user and to a
 * third-party bank (both Tier 2); product gated the whole button at Tier 2.
 */
const REQUIRED_TIER: Record<SendAction, number> = {
  fiat: 2,
  crypto: 2,
};
/** The next form a customer must complete, in spec order. */
const nextStep = (s: State): Exclude<KycBlocker, null> =>
  !s.details ? "personal-info" : !s.bvn ? "bvn" : "id-selfie";

const build = (s: State) => ({
  profile: {
    firstName: s.details ? "Ada" : "",
    lastName: "Obi",
    dateOfBirth: "1990-01-01",
    gender: "female",
    phoneNumber: "08012345678",
    country: "NG",
    kycStatus: { bvnVerified: s.bvn },
  },
  verification: {
    completedOnboardingSteps: [
      ...(s.id ? ["IDENTITY"] : []),
      ...(s.selfie ? ["SELFIE"] : []),
    ],
  },
});

describe("send gate matches the tier table for every state x action", () => {
  it("allows exactly when tier >= required, else asks for the next step", () => {
    let cases = 0;
    for (const s of STATES) {
      const { profile, verification } = build(s);
      for (const action of ACTIONS) {
        const allowed = tierOf(s) >= REQUIRED_TIER[action];
        const got = sendBlocker(action, profile, verification);
        expect(got, `${JSON.stringify(s)} ${action}`).toBe(
          allowed ? null : nextStep(s),
        );
        cases++;
      }
    }
    expect(cases).toBe(16 * ACTIONS.length);
  });

  it("never asks a Tier 0 customer for ID before BVN (spec 6.1)", () => {
    for (const s of STATES.filter((x) => tierOf(x) === 0)) {
      const { profile, verification } = build(s);
      for (const action of ACTIONS) {
        expect(sendBlocker(action, profile, verification)).not.toBe("id-selfie");
      }
    }
  });

  it("a backend tier refusal always maps to the next missing step, or null at Tier 2", () => {
    for (const s of STATES) {
      const { profile, verification } = build(s);
      expect(tierTwoBlocker(profile, verification)).toBe(
        tierOf(s) === 2 ? null : nextStep(s),
      );
    }
  });
});

describe("prompt copy is complete and consistent", () => {
  it("every blocker x action has a step-specific title and a 2-minute body", () => {
    for (const blocker of ["personal-info", "bvn", "id-selfie"] as const) {
      for (const action of ACTIONS) {
        const { title, body, cta } = kycPromptCopy(blocker, action);
        expect(title).toMatch(
          {
            "id-selfie": /^Verify your identity to send /,
            bvn: /^Verify your BVN to send /,
            "personal-info": /^Add your personal details to send /,
          }[blocker],
        );
        expect(title).toMatch(action === "crypto" ? /crypto$/ : /money$/);
        expect(body).toMatch(/It only takes 2 minutes\.$/);
        expect(cta).toBe(blocker === "personal-info" ? "Continue" : "Verify now");
        expect(`${title} ${body}`).not.toMatch(/—|undefined/);
      }
    }
  });
});

describe("tier error detection across plausible backend wordings", () => {
  const TIER = [
    "Withdrawal blocked: TIER_REQUIRED",
    "TIER_REQUIRED",
    "tier_required",
    "Tier 2 required",
    "Tier 2 verification required",
    "TIER_2_REQUIRED",
    "Transfer blocked: TIER_REQUIRED",
    "This action requires Tier 2",
    "Requires tier 1",
    "Requires KYC tier 2 verification",
    "KYC tier requirement not met",
    "KYC tier insufficient for this transfer",
  ];
  const OTHER = [
    "Insufficient balance",
    "Invalid transaction PIN",
    "Withdrawal blocked: LIMIT_EXCEEDED",
    "Withdrawal blocked: PIN_SETUP_REQUIRED",
    "Transaction PIN not set",
    "Recipient not found",
    "Frontier wallet required",
    "Withdrawal request expired. Please start again",
    "Network timeout. Please check your connection.",
    "Something went wrong",
  ];

  it("recall 100% on tier wordings, 0 false positives on the rest", () => {
    const missed = TIER.filter((m) => !isTierRequiredError({ message: m }));
    const falsePositives = OTHER.filter((m) => isTierRequiredError({ message: m }));
    expect({ missed, falsePositives }).toEqual({ missed: [], falsePositives: [] });
  });
});
