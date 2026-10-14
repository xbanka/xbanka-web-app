"use client";

// OPay-style data plan picker: category tabs (Hot, Daily, Weekly, Monthly,
// Night, Broadband) over a card grid, so users don't scroll one long list.
// Categories are derived from the plan names the API sends — plan name formats
// vary by network, so everything the parser can't place lands in "Others"
// rather than disappearing.

import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataPlan } from "@/lib/types/bills-types";

/** Route 6 reads `productId`, but Nomba sometimes names the field `id`. */
export const planKey = (plan: DataPlan) =>
  plan.productId ?? plan.id ?? plan.plan;

export type PlanTabId =
  | "hot"
  | "daily"
  | "weekly"
  | "monthly"
  | "night"
  | "broadband"
  | "others";

type PlanMeta = {
  /** "1.5GB" when the size can be read from the plan name. */
  size?: string;
  /** "30 days" / "Night" — the small line under the size. */
  validity?: string;
  days?: number;
  night: boolean;
  broadband: boolean;
};

function parsePlan(name: string): PlanMeta {
  const night = /night|midnight/i.test(name);
  const broadband = /broadband|router|mifi|modem|hynet|xtra\s*value/i.test(
    name,
  );

  const size = name.match(/(\d+(?:[.,]\d+)?)\s*(TB|GB|MB)/i);

  let days: number | undefined;
  let m: RegExpMatchArray | null;
  if ((m = name.match(/(\d+)\s*[- ]?\s*days?\b/i))) days = Number(m[1]);
  else if ((m = name.match(/(\d+)\s*[- ]?\s*(?:weeks?|wks?)\b/i)))
    days = Number(m[1]) * 7;
  else if ((m = name.match(/(\d+)\s*[- ]?\s*(?:months?|mths?)\b/i)))
    days = Number(m[1]) * 30;
  else if ((m = name.match(/(\d+)\s*[- ]?\s*(?:hours?|hrs?)\b/i)))
    days = Math.max(1, Math.ceil(Number(m[1]) / 24));
  else if (/daily|1day/i.test(name)) days = 1;
  else if (/weekly/i.test(name)) days = 7;
  else if (/monthly/i.test(name)) days = 30;
  else if (/yearly|annual/i.test(name)) days = 365;

  return {
    size: size ? `${size[1].replace(",", ".")}${size[2].toUpperCase()}` : undefined,
    validity:
      night ? "Night" : days != null ? (days === 1 ? "1 day" : `${days} days`) : undefined,
    days,
    night,
    broadband,
  };
}

function bucketOf(meta: PlanMeta): Exclude<PlanTabId, "hot"> {
  if (meta.night) return "night";
  if (meta.broadband) return "broadband";
  if (meta.days == null) return "others";
  if (meta.days <= 2) return "daily";
  if (meta.days <= 14) return "weekly";
  return "monthly";
}

type PlanTab = { id: PlanTabId; label: string; plans: DataPlan[] };

const BUCKETS: { id: Exclude<PlanTabId, "hot">; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "night", label: "Night" },
  { id: "broadband", label: "Broadband" },
  { id: "others", label: "Others" },
];

function buildTabs(plans: DataPlan[]): PlanTab[] {
  const buckets: Record<Exclude<PlanTabId, "hot">, DataPlan[]> = {
    daily: [],
    weekly: [],
    monthly: [],
    night: [],
    broadband: [],
    others: [],
  };
  plans.forEach((p) => buckets[bucketOf(parsePlan(p.plan))].push(p));
  BUCKETS.forEach(({ id }) => buckets[id].sort((a, b) => a.amount - b.amount));

  // "Hot" = the cheapest plans of each validity, so the common purchases sit
  // on the first screen without scrolling. The API carries no popularity data,
  // so price-per-duration stands in for it.
  const hot = [
    ...buckets.daily.slice(0, 2),
    ...buckets.weekly.slice(0, 2),
    ...buckets.monthly.slice(0, 3),
    ...buckets.night.slice(0, 1),
  ]
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 8);

  const tabs: PlanTab[] = [];
  // A Hot tab over a catalogue of two plans is noise — only add it once it
  // actually shortcuts something.
  if (hot.length >= 3 && plans.length > hot.length)
    tabs.push({ id: "hot", label: "Hot", plans: hot });
  BUCKETS.forEach(({ id, label }) => {
    if (buckets[id].length) tabs.push({ id, label, plans: buckets[id] });
  });
  return tabs;
}

/** Card prices drop the ".00" that formatNaira carries — three cards share a
 *  row, and the decimals are what makes them wrap. */
const naira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

export function DataPlanPicker({
  plans,
  loading,
  value,
  onChange,
}: {
  plans: DataPlan[];
  loading?: boolean;
  /** The selected plan's key (see `planKey`). */
  value: string;
  onChange: (planId: string) => void;
}) {
  const tabs = useMemo(() => buildTabs(plans), [plans]);
  const [picked, setPicked] = useState<PlanTabId | null>(null);
  // Fall back to the first tab when nothing is picked yet, or when a network
  // switch produced a catalogue without the picked category.
  const activeId =
    picked && tabs.some((t) => t.id === picked) ? picked : tabs[0]?.id;
  const active = tabs.find((t) => t.id === activeId);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-7 w-16 rounded-full border border-border bg-card-secondary animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-border bg-card-secondary animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="rounded-xl border border-border bg-card-secondary p-4 text-center text-sm text-text">
        No data plans are available for this network right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="flex gap-1.5 overflow-x-auto pb-1 -mb-1"
        role="tablist"
        aria-label="Plan categories"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeId}
            onClick={() => setPicked(tab.id)}
            className={cn(
              "flex items-center gap-1 h-7 px-3 text-xs font-medium rounded-full border whitespace-nowrap shrink-0 transition-colors",
              tab.id === activeId
                ? "bg-Green border-Green text-white"
                : "border-border text-text hover:text-card-text hover:border-border-active",
            )}
          >
            {tab.id === "hot" && <Flame className="w-3 h-3" />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-62 overflow-y-auto pr-0.5">
        {active.plans.map((p) => {
          const key = planKey(p);
          const meta = parsePlan(p.plan);
          const selected = key === value;
          return (
            <button
              key={key}
              type="button"
              title={p.plan}
              onClick={() => onChange(key)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-h-20 p-2 rounded-xl border text-center transition-colors",
                selected
                  ? "border-Green bg-Green/10"
                  : "border-border bg-card-secondary hover:border-border-active",
              )}
            >
              {meta.size ? (
                <>
                  <span className="text-sm font-bold text-card-text leading-tight">
                    {meta.size}
                  </span>
                  <span className="text-[10px] text-text leading-tight line-clamp-1">
                    {meta.validity ?? p.plan}
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-card-text leading-tight line-clamp-2">
                  {p.plan}
                </span>
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  selected ? "text-Green" : "text-card-text",
                )}
              >
                {naira(p.amount)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
