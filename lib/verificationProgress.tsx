type RawOnboardingStep = {
  id: string;
  label?: string;
  status?: string;
  isCompleted?: boolean;
  completed?: boolean;
};

type VerificationProgressData = {
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  completedOnboardingSteps?: string[];
  progress?: RawOnboardingStep[];
};

export const isOnboardingStepCompleted = (step?: RawOnboardingStep) => {
  if (!step) return false;

  const status = step.status?.toLowerCase();

  return Boolean(
    step.isCompleted ||
      step.completed ||
      status === "completed" ||
      status === "done" ||
      status === "approved",
  );
};

export const ONBOARDING_STEPS = (data?: VerificationProgressData) => {
  if (!data?.progress) return [];

  const completedStepIds = new Set(data.completedOnboardingSteps ?? []);

  const progressMap: Record<string, RawOnboardingStep> = Object.fromEntries(
    data.progress.map((step) => [
      step.id,
      {
        ...step,
        isCompleted:
          step.id === "EMAIL_VERIFIED"
            ? Boolean(
                data.emailVerified ??
                  data.isEmailVerified ??
                  isOnboardingStepCompleted(step),
              )
            : completedStepIds.has(step.id) || isOnboardingStepCompleted(step),
      },
    ]),
  );

  const stepGroups = [
    {
      key: "EMAIL",
      modalKey: null,
      title: "Email Verification",
      ids: ["EMAIL_VERIFIED"],
      desc: "Basic account features unlocked",
      label: "Account created",
    },
    {
      key: "BVN",
      modalKey: "bvn",
      title: "Verify BVN",
      ids: ["BVN"],
      desc: "Unlocks gift cards & bill payments",
      label: "Gift cards & bill payments unlocked",
    },
    {
      key: "IDENTITY",
      modalKey: "id-selfie",
      title: "ID & Selfie",
      ids: ["IDENTITY", "SELFIE"],
      desc: "Unlocks crypto & withdrawals",
      label: "Crypto & withdrawals unlocked",
    },
    // {
    //   key: "ADDRESS",
    //   modalKey: "address",
    //   title: "Proof of Address",
    //   ids: ["ADDRESS"],
    //   desc: "Unlocks full platform access",
    //   label: "Full platform access unlocked",
    // },
  ];

  let activeStepFound = false;

  return stepGroups.map((group, index) => {
    const groupSteps = group.ids.map((id) => progressMap[id]);

    const isCompleted = groupSteps.every(isOnboardingStepCompleted);

    let status: "done" | "active" | "pending" = "pending";

    if (isCompleted) {
      status = "done";
    } else if (!activeStepFound) {
      status = "active";
      activeStepFound = true;
    }

    return {
      step: `STEP ${index + 1}`,
      title: group.title,
      desc: group.desc,
      status,
      modalKey: group.modalKey,
      label: group.label,

      // IMPORTANT
      steps: groupSteps,
    };
  });
};
