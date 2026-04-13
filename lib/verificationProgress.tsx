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

  // ❌ Remove SIGNUP
  const filtered = data.progress.filter(
    (step: any) => step.id !== "SIGNUP"
  );

  // ✅ Group into 4 steps
  const stepGroups = [
    {
      key: "EMAIL",
      title: "Email Verification",
      ids: ["EMAIL_VERIFIED"],
      desc: "Unlocks basic account features",
      label: "Account created & verified",
    },
    {
      key: "BVN",
      title: "Verify BVN",
      ids: ["BVN"],
      desc: "Unlocks git card & bill payments",
      label: "Unlocked: Gift Cards • Bill Payments • ₦50k limit"
    },
    {
      key: "IDENTITY",
      title: "ID & Selfie",
      ids: ["IDENTITY", "SELFIE"],
      desc: "Unlocks crypto & withdrawals",
      label: "Unlocked: Crypto • Withdrawals • ₦500k limit"
    },
    {
      key: "ADDRESS",
      title: "Proof of Address",
      ids: ["ADDRESS"],
      desc: "Unlocks full platform access",
      label: "Unlocked: Full access • ₦2M limit"
    },
  ];

  return stepGroups.map((group, index) => {
    const steps = filtered.filter((s: any) =>
      group.ids.includes(s.id)
    );

    const isCompleted = steps.every((s: any) => s.isCompleted);
    const isCurrent = steps.some((s: any) => s.status === "current");

    let status: "done" | "active" | "pending" = "pending";

    if (isCompleted) {
      status = "done";
    } else if (isCurrent) {
      status = "active";
    }

    return {
      step: `STEP ${index + 1}`,
      title: group.title,
      desc: group.desc,
      status,
      label: group.label,
      isCurrent, // 👈 important for button control
    };
  });
};
