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
            className={`p-4 min-h-34 transition-colors
              ${s.status === "done" ? "border-l-3 border-border-active flex flex-col justify-between" : ""}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium leading-5 text-[#A6F4C5] uppercase tracking-wide">
                  {s.step}
                </span>
                {s.status === "done" && (
                  <div className="bg-[#37703F1A]/10">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                {s.status === "active" && (
                  <span className="w-6 h-6 rounded-full bg-[#37703F1A]/80 animate-pulse" />
                )}
              </div>
              <p className={`text-sm font-semibold text-card-text`}>
                {s.title}
              </p>
              {s.status === "active" && (
                <p className="text-xs text-green-500 font-medium">{s.desc}</p>
              )}
            </div>
            {s.status === "done" ? (
              <p className="text-xs text-green-500 font-medium">
                Account created
              </p>
            ) : s.status === "active" ? (
              <div className="space-y-5">
                <p className="text-xs text-text leading-relaxed">{s.desc}</p>
                <button className="w-full bg-Green text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                  Continue →
                </button>
              </div>
            ) : (
              <p className="text-xs text-green-500 font-medium">{s.desc}</p>
            )}
          </OnboardingJourneyCard>
        ))}
      </div>
    </DashboardCard>
  );
}
