import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ArrowUpRight, BlocksIcon, LucideGift, TrendingUp } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Buy/Sell Crypto",
      sub: "BTC, ETH, USDT, USDC",
      gradient: "bg-[#042F2E]",
      iconColor: "bg-[#0F766E]",
      page: "crypto" as PageId,
      icon: BlocksIcon,
    },
    {
      title: "Buy/Sell Gift Cards",
      sub: "Amazon, Visa, Starbucks + more",
      gradient: "bg-[#36002E]",
      iconColor: "bg-[#9A0283]",
      page: "giftcards" as PageId,
      icon: LucideGift,
    },
    {
      title: "Bill Payments",
      sub: "Airtime, Data, Electricity + more",
      gradient: "bg-[#051D33]",
      iconColor: "bg-[#004C99]",
      page: "bills" as PageId,
      icon: BlocksIcon,
    },
  ];
  return (
    <DashboardCard>
      <h3 className="text-[16px] font-medium leading-6 text-card-text">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.title}
            className={`relative flex gap-4.25 items-center ${a.gradient} rounded-2xl p-4 text-left text-white hover:opacity-90 transition-opacity overflow-hidden`}
          >
            <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 opacity-60" />
            <div className={`${a.iconColor} p-2.5 rounded-lg`}>
              <a.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-card-text leading-5">{a.title}</p>
              <p className="font-medium text-[12px] text-text leading-5">{a.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </DashboardCard>
  );
}
