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

// export const ONBOARDING_STEPS = (verificationStatus: any) => {
//   const mappedSteps = verificationStatus?.progress?.map(
//     (item: any, index: number) => {
//       let status: "done" | "active" | "pending" = "pending";

//       if (item.status === "completed") {
//         status = "done";
//       } else if (item.status === "in_progress") {
//         status = "active";
//       }

//       return {
//         step: `STEP ${index + 1}`,
//         title: item.label,
//         desc: getStepDescription(item.id), // helper function
//         status,
//       };
//     },
//   );

//   return mappedSteps || [];
// };
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
    },
    {
      key: "BVN",
      title: "Verify BVN",
      ids: ["BVN"],
      desc: "Unlocks basic account features",
    },
    {
      key: "IDENTITY",
      title: "ID & Selfie",
      ids: ["IDENTITY", "SELFIE"],
      desc: "Unlocks crypto & withdrawals",
    },
    {
      key: "ADDRESS",
      title: "Proof of Address",
      ids: ["ADDRESS"],
      desc: "Unlocks full platform access",
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
      isCurrent, // 👈 important for button control
    };
  });
};
