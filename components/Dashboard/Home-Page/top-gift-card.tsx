import { DashboardCard } from "@/components/Layout/DashboardCard";
import { GIFT_CARDS } from "@/lib/MockData";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function TopGiftCards() {
  return (
    <DashboardCard>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-text max-sm:text-[14px]  max-sm:leading-7">
          Top Gift Cards
        </h3>
        <Link
          href="/gift-cards"
          className="text-xs text-Green flex items-center gap-2 hover:underline max-sm:text-[12px] max-sm:leading-6"
        >
          View more <ArrowUpRight className="w-4 h-4 max-sm:h-5 max-sm:w-5" />
        </Link>
      </div>
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {GIFT_CARDS.map((card, i) => (
          <div
            key={i}
            className="group w-[42vw] max-w-[180px] shrink-0 snap-start cursor-pointer rounded-xl bg-border p-4 sm:w-auto sm:max-w-none sm:shrink sm:snap-none"
          >
            <div
              className="rounded-lg w-10 h-10  max-sm:h-[32px] max-sm:w-[32px] flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105"
              style={{ background: card.bg }}
            >
              <card.icon className="w-5 h-5 max-sm:h-5 max-sm:w-5 " />
            </div>
            <p className="mt-4 truncate text-[14px] font-medium text-card-text max-sm:text-[14px] max-sm:leading-[22px]">
              {card.name}
            </p>
            <p className="text-[12px] font-medium text-text max-sm:text-[12px] max-sm:leading-[20px]">
              {card.rate}
            </p>
            <button className="text-[14px] font-medium text-Green hover:underline max-sm:text-[12px] max-sm:leading-[20px]">
              Trade
            </button>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
