import { GIFT_CARDS } from "@/lib/MockData";
import { ChevronRight } from "lucide-react";

export function TopGiftCards() {
  return (
    <div className="bg-card-background border border-border rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-text">Top Gift Cards</h3>
        <button className="text-xs text-Green flex items-center gap-1 hover:underline">
          See all <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {GIFT_CARDS.map((card, i) => (
          <div key={i} className="group cursor-pointer">
            <div
              className="aspect-square rounded-xl flex items-center justify-center text-white font-bold text-xs mb-1.5 transition-transform group-hover:scale-105"
              style={{ background: card.bg }}
            >
              {card.name[0]}
            </div>
            <p className="text-[10px] font-medium text-card-text truncate">{card.name}</p>
            <p className="text-[10px] text-text">{card.rate}</p>
            <button className="text-[10px] text-Green font-medium hover:underline">Trade</button>
          </div>
        ))}
      </div>
    </div>
  );
}