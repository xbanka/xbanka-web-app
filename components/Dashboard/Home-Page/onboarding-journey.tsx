import { CheckCircle } from "lucide-react";
import { OnboardingJourneyCard } from "./onboarding-journey-card";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseVerificationStatus } from "@/lib/services/profile.service";
import { ONBOARDING_STEPS } from "@/lib/verificationProgress";
import { ErrorField } from "@/components/ui/field-error";

export function OnboardingJourney() {
  const {
    data: verificationStatus,
    isPending,
    error,
  } = UseVerificationStatus();
  console.log(verificationStatus);
  const progress = ONBOARDING_STEPS(verificationStatus?.data);
  const completedCount = progress.filter(
    (step) => step.status === "done",
  ).length;

  const totalSteps = progress.length;
  if (isPending) {
    return <DashboardCard>Loading onboarding...</DashboardCard>;
  }

  if (error) {
    return (
      <DashboardCard>
        <ErrorField message={error?.message} />
      </DashboardCard>
    );
  }
  return (
    <DashboardCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-card-text text-[16px] leading-6">
            Complete your Onboarding Journey
          </h3>
          <p className="text-xs text-text">
            Unlock full access to Xbanka features
          </p>
        </div>
        <span className="text-xs text-text font-normal leading-5.5">
          {completedCount} of {totalSteps} completed
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progress.map((s, i) => (
          <OnboardingJourneyCard
            key={i}
            status={s.status}
            step={s.step}
            title={s.title}
            desc={s.desc}
          />
        ))}
      </div>
    </DashboardCard>
  );
}
