import { DashboardCard } from "@/components/Layout/DashboardCard";
import {
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import { OnboardingJourneyCard } from "../Home-Page/onboarding-journey-card";
import { ONBOARDING_STEPS } from "@/lib/verificationProgress";
import { UseVerificationStatus } from "@/lib/services/profile.service";
import { ModalType } from "../Home-Page/types";
import { useState } from "react";
import { BvnModal } from "../Onboarding-Journey-Modal/bvn-modal";
import { IdSelfieModal } from "../Onboarding-Journey-Modal/id-selfie-modal";
import { AddressModal } from "../Onboarding-Journey-Modal/address-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorLayout } from "@/components/ui/error-layout";

export function IdentityVerificationTab() {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const {
    data: verificationStatus,
    isPending,
    error,
  } = UseVerificationStatus();
  console.log("verificationStatus:", verificationStatus);
  const progress = ONBOARDING_STEPS(verificationStatus?.data);
  console.log("progress", progress)
  const completedCount = progress.filter(
    (step) => step.status === "done",
  ).length;

  const totalSteps = progress.length;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-semibold text-2xl leading-8">
          Identity Verification
        </h1>
        <p className="font-normal text-sm leading-6">
          Complete your KYC to unlock higher limits and all features.
        </p>
      </div>

      <div className="space-y-4">
        {/* Review banner */}
        <div className="flex items-center justify-between gap-6 px-4 py-3 rounded-lg bg-[#3E2E00] border-l-3 border-[#A27D00]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#FEC84B] leading-5">
                Complete your verification to unlock your wallet
              </p>
              <p className="text-xs font-medium leading-5 text-[#FEC84B] truncate">
                Verify your BVN to add funds, send money, and do more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-xs cursor-pointer font-medium leading-5 text-[#FEC84B] hover:text-[#FEC84B]/60 transition-colors whitespace-nowrap flex items-center gap-2">
              Verify Now
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Header */}
        <DashboardCard>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-medium leading-6 text-card-text">
                Verification Status
              </h2>
              <p className="text-xs font-normal leading-5.5 text-text mt-1">
                Complete all 4 tiers to unlock the full XBanka platform
              </p>
            </div>
            <span className="text-xs font-normal leading-5.5 text-text">
              Tier {completedCount} of {totalSteps} completed
            </span>
          </div>

          {/* Verification Status */}
          <div>
            {isPending && !error && (
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
                      <Skeleton className="h-8 w-8 rounded-full bg-border" />

                      {/* Title */}
                      <Skeleton className="h-4 w-3/4 bg-border rounded" />

                      {/* Description */}
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-full bg-border rounded" />
                        <Skeleton className="h-3 w-5/6 bg-border rounded" />
                      </div>

                      {/* Status badge */}
                      <Skeleton className="h-5 w-16 bg-border rounded-full" />
                    </div>
                  ))}
                </div>
              </DashboardCard>
            )}

            {error && !isPending && (
              <DashboardCard>
                <ErrorLayout message={error?.message} />
              </DashboardCard>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {!isPending &&
                !error &&
                progress.map((s, i) => (
                  <OnboardingJourneyCard
                    className="min-h-47"
                    key={i}
                    status={s.status}
                    step={s.step}
                    title={s.title}
                    label={s.label}
                    desc={s.desc}
                    onClick={() => {
                      if (s.modalKey) {
                        setOpenModal(s.modalKey as ModalType);
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        </DashboardCard>

        {/* Tier 2 Requirements */}
        <DashboardCard>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-medium leading-4 text-card-text">
              Tier 2 Requirements
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              Under Review
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <h4 className="text-xs font-semibold text-card-text mb-2">
                Accepted Document
              </h4>
              <ul className="space-y-1.5">
                {[
                  "National ID Card (NIN)",
                  "International Passport",
                  "Driver's Licence",
                  "Voter's Card",
                ].map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-text"
                  >
                    <CheckCircle className="w-3 h-3 text-Green shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-card-text mb-2">
                Document Requirements
              </h4>
              <ul className="space-y-1.5">
                {[
                  "Document must be valid and unexpired",
                  "All four corners must be visible",
                  "No blurry or edited images",
                  "Selfie must match ID photo",
                  "Supported formats: JPG, PNG, PDF",
                ].map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-text"
                  >
                    <CheckCircle className="w-3 h-3 text-Green shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-card-text mb-2">
                Proof of Liveness
              </h4>
              <ul className="space-y-1.5">
                {["Selfie / liveness video"].map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-text"
                  >
                    <CheckCircle className="w-3 h-3 text-Green shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DashboardCard>
        {openModal === "bvn" && (
          <BvnModal
            onClose={() => setOpenModal(null)}
            onCompleted={() => {
              setOpenModal("id-selfie");
            }}
          />
        )}
        {openModal === "id-selfie" && (
          <IdSelfieModal
            onClose={() => setOpenModal(null)}
            onCompleted={() => {
              setOpenModal("address");
            }}
          />
        )}
        {openModal === "address" && (
          <AddressModal
            onClose={() => setOpenModal(null)}
            onCompleted={() => {
              setOpenModal(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
