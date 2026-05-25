import { DashboardCard } from "@/components/Layout/DashboardCard";
import { ArrowUpRight, BlocksIcon, LucideGift } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Buy/Sell Crypto",
      sub: "BTC, ETH, USDT, USDC",
      gradient: "bg-teal-light",
      iconColor: "bg-teal-border",
      iconTextColor: "text-teal-text",
      page: "crypto",
      icon: BlocksIcon,
      disabled: false,
    },
    {
      title: "Buy/Sell Gift Cards",
      sub: "Amazon, Visa, Starbucks + more",
      gradient: "bg-coral-light",
      iconColor: "bg-coral-border",
      iconTextColor: "text-coral-text",
      page: "gift-cards",
      icon: LucideGift,
      disabled: true,
    },
    {
      title: "Bill Payments",
      sub: "Airtime, Data, Electricity + more",
      gradient: "bg-blue-light",
      iconColor: "bg-blue-border",
      iconTextColor: "text-blue-text",
      page: "bills",
      icon: BlocksIcon,
      disabled: true,
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
            href={a.disabled ? "#" : `/${a.page}`}
            className="w-[76vw] max-w-90 shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:snap-none"
          >
            <div
              className={`relative cursor-pointer flex gap-4.25 items-center ${a.gradient} rounded-2xl p-4 text-left text-white hover:opacity-90 transition-opacity overflow-hidden`}
            >
              {!a.disabled ? (
                <ArrowUpRight className="text-card-text/60 absolute top-3 right-3 w-4 h-4" />
              ) : (
                <span className="absolute top-3 right-3 bg-black/10 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-card-text border border-white/10">
                  Soon
                </span>
              )}
              <div className={`${a.iconColor} p-2.5 rounded-lg max-sm:p-4`}>
                <a.icon className={`w-4 h-4 ${a.iconTextColor} max-sm:h-5 max-sm:w-5`} />
              </div>
              <div>
                <p className="font-medium text-sm text-card-text leading-5 max-sm:text-[14px] max-sm:leading-5">
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
