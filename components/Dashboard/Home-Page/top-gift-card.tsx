import { DashboardCard } from "@/components/Layout/DashboardCard";
import { GIFT_CARDS } from "@/lib/MockData";
import { ChevronRight } from "lucide-react";

export function TopGiftCards() {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-text">Top Gift Cards</h3>
        <button className="text-xs text-Green flex items-center gap-1 hover:underline">
          See all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 items-start border border-border bg-border p-3 rounded-lg">
        {GIFT_CARDS.map((card, i) => (
          <div key={i} className="group cursor-pointer p-2 rounded-lg bg-card-background">
            <div
              className="rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105"
              style={{ background: card.bg }}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-[14px] font-medium text-card-text truncate">{card.name}</p>
            <p className="text-[12px] font-medium text-text">{card.rate}</p>
            <button className="text-[14px] font-medium text-Green hover:underline">Trade</button>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}