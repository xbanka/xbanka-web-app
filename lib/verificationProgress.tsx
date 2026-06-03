const getStepDescription = (id: string) => {
  switch (id) {
    case "SIGNUP":
      return "Account created";
    case "EMAIL_VERIFIED":
      return "Verify your email address";
    case "BASIC_INFO":
      return "Provide your basic details";
    case "BVN":
      return "Verify your BVN";
    case "IDENTITY":
      return "Upload identity document";
    case "SELFIE":
      return "Complete selfie verification";
    case "ADDRESS":
      return "Provide proof of address";
    default:
      return "";
  }
};

export const ONBOARDING_STEPS = (data: any) => {
  if (!data?.progress) return [];

  const progressMap = Object.fromEntries(
    data.progress.map((step: any) => [
      step.id,
      {
        ...step,
        isCompleted:
          step.id === "EMAIL_VERIFIED"
            ? data.emailVerified
            : step.isCompleted,
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
    // {
    //   key: "BVN",
    //   modalKey: "bvn",
    //   title: "Verify BVN",
    //   ids: ["BVN"],
    //   desc: "Unlocks gift cards & bill payments",
    //   label: "Gift cards & bill payments unlocked",
    // },
    {
      key: "IDENTITY",
      modalKey: "id-selfie",
      title: "ID & Selfie",
      ids: ["IDENTITY", "SELFIE"],
      desc: "Unlocks crypto & withdrawals",
      label: "Crypto & withdrawals unlocked",
    },
    {
      key: "ADDRESS",
      modalKey: "address",
      title: "Proof of Address",
      ids: ["ADDRESS"],
      desc: "Unlocks full platform access",
      label: "Full platform access unlocked",
    },
  ];

  let activeStepFound = false;

  return stepGroups.map((group, index) => {
    const groupSteps = group.ids.map((id) => progressMap[id]);

    const isCompleted = groupSteps.every(
      (step) => step?.isCompleted,
    );

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
