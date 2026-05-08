"use client";

import { DashboardCard } from "@/components/Layout/DashboardCard";
import { GIFT_CARDS } from "@/lib/MockData";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TopGiftCards() {
  const [showMoreCards, setShowMoreCards] = useState(false);
  const mobileCards = showMoreCards ? GIFT_CARDS : GIFT_CARDS.slice(0, 4);

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
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {GIFT_CARDS.map((card, i) => (
          <div
            key={i}
            className="group cursor-pointer rounded-xl bg-border p-4"
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
      <div
        className={`grid grid-cols-2 gap-3 overflow-x-hidden sm:hidden ${
          showMoreCards
            ? "max-h-[360px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            : ""
        }`}
      >
        {mobileCards.map((card, i) => (
          <div
            key={`${card.name}-${i}`}
            className="group cursor-pointer rounded-xl bg-border p-4"
          >
            <div
              className="rounded-lg h-[32px] w-[32px] flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105"
              style={{ background: card.bg }}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 truncate text-[14px] font-medium leading-[22px] text-card-text">
              {card.name}
            </p>
            <p className="truncate text-[12px] font-medium leading-[20px] text-text">
              {card.rate}
            </p>
            <button className="text-[12px] font-medium leading-[20px] text-Green hover:underline">
              Trade
            </button>
          </div>
        ))}
      </div>
      {GIFT_CARDS.length > 4 && (
        <button
          type="button"
          onClick={() => setShowMoreCards((value) => !value)}
          className="text-left text-[12px] font-medium leading-5 text-Green hover:underline sm:hidden"
        >
          {showMoreCards ? "See less" : "See more"}
        </button>
      )}
    </DashboardCard>
  );
}
