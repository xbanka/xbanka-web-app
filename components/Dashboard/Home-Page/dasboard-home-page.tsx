import { AssetValueCard } from "./asset-vaue-card";
import { MarketOverview } from "./market-overview";
import { OnboardingJourney } from "./onboarding-journey";
import { QuickActions } from "./quick-actions";
import { TopGiftCards } from "./top-gift-card";

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-card-text">
          Welcome to Xbanka, Josh 👋
        </h1>
      </div>
 
      {/* Asset value */}
      <AssetValueCard />
 
      {/* Onboarding */}
      <OnboardingJourney />
 
      {/* Quick actions */}
      <QuickActions />
 
      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarketOverview />
        <TopGiftCards />
      </div>
    </div>
  );
}