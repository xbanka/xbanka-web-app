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
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="space-y-1">
        <p className="text-[13px] text-text">
          {section.group} / {section.title}
        </p>
        <h1 className="font-display text-xl font-semibold leading-8 text-card-text sm:text-2xl">
          {section.title}
        </h1>
      </div>

      <DashboardCard className="px-5 py-8 sm:px-8 sm:py-12">
        <ComingSoonScene
          title={section.title}
          accent={section.accent}
          icon={ICONS[id]}
          description={section.description}
          features={section.features}
          notifyKey={id}
        />
      </DashboardCard>
    </div>
  );
}
