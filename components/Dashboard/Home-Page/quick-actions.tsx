import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ArrowUpRight, BlocksIcon, LucideGift } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Buy/Sell Crypto",
      sub: "BTC, ETH, USDT, USDC",
      gradient: "bg-[#042F2E]",
      iconColor: "bg-[#0F766E]",
      page: "crypto",
      icon: BlocksIcon,
    },
    {
      title: "Buy/Sell Gift Cards",
      sub: "Amazon, Visa, Starbucks + more",
      gradient: "bg-[#36002E]",
      iconColor: "bg-[#9A0283]",
      page: "gift-cards",
      icon: LucideGift,
    },
    {
      title: "Bill Payments",
      sub: "Airtime, Data, Electricity + more",
      gradient: "bg-[#051D33]",
      iconColor: "bg-[#004C99]",
      page: "bills",
      icon: BlocksIcon,
    },
  ];
  return (
    <DashboardCard>
      <h3 className="text-[16px] max-sm:text-[14px] max-sm:leading-7 font-medium leading-6 text-card-text">
        Quick Actions
      </h3>
      <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {actions.map((a) => (
          <Link
            key={a.title}
            href={`/${a.page}`}
            className="w-[76vw] max-w-[360px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:snap-none"
          >
            <div
              className={`relative cursor-pointer flex min-h-24 gap-4.25 items-center ${a.gradient} rounded-2xl p-4 text-left text-white hover:opacity-90 transition-opacity overflow-hidden max-sm:min-h-28`}
            >
              <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 opacity-60" />
              <div className={`${a.iconColor} p-2.5 rounded-lg max-sm:p-4`}>
                <a.icon className="w-4 h-4 max-sm:h-[20px] max-sm:w-[20px]" />
              </div>
              <div>
                <p className="font-medium text-sm text-card-text leading-5 max-sm:text-[14px] max-sm:leading-[20px]">
                  {a.title}
                </p>
                <p className="font-medium text-[12px] text-text leading-5 max-sm:text-[12px] max-sm:leading-6">
                  {a.sub}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
