"use client";
import { UseProfileUser } from "@/lib/services/profile.service";
import { AssetValueCard } from "./asset-vaue-card";
import { MarketOverview } from "./market-overview";
import { OnboardingJourney } from "./onboarding-journey";
import { QuickActions } from "./quick-actions";
import { useUserStore } from "@/store/user.store";
import type { ReactNode } from "react";

// Each dashboard section rises in a beat after the one above it. `empty:hidden`
// keeps a section that renders nothing (e.g. a finished onboarding) from
// leaving a gap in the spacing.
function RiseIn({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div
      className="empty:hidden motion-safe:animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data: profileData } = UseProfileUser();
  console.log("profileData", profileData);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Welcome */}
      <RiseIn index={0}>
        <h1 className="text-xl sm:text-2xl font-semibold leading-8 text-card-text">
          Welcome to Xbanka, {profileData?.data?.firstName ?? ""}{" "}
          <span
            role="img"
            aria-label="waving hand"
            className="inline-block origin-[70%_70%] motion-safe:animate-wave"
          >
            👋
          </span>
        </h1>
      </RiseIn>

      {/* Asset value */}
      <RiseIn index={1}>
        <AssetValueCard />
      </RiseIn>

      {/* Onboarding */}
      <RiseIn index={2}>
        <OnboardingJourney />
      </RiseIn>

      {/* Quick actions */}
      <RiseIn index={3}>
        <QuickActions />
      </RiseIn>

      {/* Bottom grid */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4">
        <MarketOverview />
        <TopGiftCards />
      </div> */}
      <RiseIn index={4}>
        <MarketOverview />
      </RiseIn>
    </div>
  );
}
