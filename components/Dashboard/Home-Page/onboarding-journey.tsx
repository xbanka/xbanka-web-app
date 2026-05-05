import { CheckCircle } from "lucide-react";
import { OnboardingJourneyCard } from "./onboarding-journey-card";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { UseVerificationStatus } from "@/lib/services/profile.service";
import { ONBOARDING_STEPS } from "@/lib/verificationProgress";
import { ErrorField } from "@/components/ui/field-error";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";
import { AddressModal } from "../Onboarding-Journey-Modal/address-modal";
import { useState } from "react";
import { ModalType, stepsConfig } from "./types";

export function OnboardingJourney() {
  const {
    data: verificationStatus,
    isPending,
    error,
  } = UseVerificationStatus();
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]); // step 1 (email) pre-completed
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const progress = ONBOARDING_STEPS(verificationStatus?.data);
  const completedCount = progress.filter(
    (step) => step.status === "done",
  ).length;

  const markDone = (stepId: number) =>
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId],
    );

  const totalSteps = progress.length;
  if (isPending) {
    return (
      <DashboardCard className="space-y-4 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-48 bg-border rounded" />
            <div className="h-3 w-32 bg-border rounded" />
          </div>
          <div className="h-3 w-20 bg-border rounded" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-border space-y-3"
            >
              {/* Icon / badge */}
              <div className="h-8 w-8 rounded-full bg-border" />

              {/* Title */}
              <div className="h-4 w-3/4 bg-border rounded" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-border rounded" />
                <div className="h-3 w-5/6 bg-border rounded" />
              </div>

              {/* Status badge */}
              <div className="h-5 w-16 bg-border rounded-full" />
            </div>
          ))}
        </div>
      </DashboardCard>
    );
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
            status={"active"}
            step={s.step}
            title={s.title}
            desc={s.desc}
            onClick={() => {
              if (s.modalKey) {
                setOpenModal(s.modalKey as ModalType); // ✅ safe now
              }
            }}
          />
        ))}
      </div>
      {openModal === "bvn" && (
        <BvnModal
          onClose={() => setOpenModal(null)}
          onCompleted={() => {
            markDone(2);
            setOpenModal(null);
          }}
        />
      )}
      {openModal === "id-selfie" && (
        <IdSelfieModal
          onClose={() => setOpenModal(null)}
          onCompleted={() => {
            markDone(3);
            setOpenModal(null);
          }}
        />
      )}
      {openModal === "address" && (
        <AddressModal
          onClose={() => setOpenModal(null)}
          onCompleted={() => {
            markDone(4);
            setOpenModal(null);
          }}
        />
      )}
    </DashboardCard>
  );
}
