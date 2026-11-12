"use client";

import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ComingSoonScene, type SceneIcon } from "@/components/ui/coming-soon-scene";
import { COMING_SOON, type ComingSoonId } from "@/lib/coming-soon";

const ICONS: Record<ComingSoonId, SceneIcon> = {
  "gift-cards": "gift",
  p2p: "p2p",
  affiliate: "affiliate",
  referrals: "referrals",
};

/** A section that's in the navigation but not built yet. */
export default function ComingSoonPage({ id }: { id: ComingSoonId }) {
  const section = COMING_SOON[id];

  return (
    <div className="mx-auto max-w-6xl space-y-5 max-md:space-y-0">
      {/* On phones the card's own heading names the section. */}
      <h1 className="font-display text-xl font-semibold leading-8 text-card-text max-md:sr-only sm:text-2xl">
        {section.title}
      </h1>

      <DashboardCard className="p-3 sm:p-6 md:p-8">
        <ComingSoonScene
          title={section.title}
          accent={section.accent}
          icon={ICONS[id]}
          description={section.description}
          notifyKey={id}
        />
      </DashboardCard>
    </div>
  );
}
