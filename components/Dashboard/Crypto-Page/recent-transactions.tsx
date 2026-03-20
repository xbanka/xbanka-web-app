import { DashboardCard } from "@/components/Layout/DashboardCard";
import { StatusBadge } from "@/lib/statusBadge";
import { ArrowDown, ArrowUp } from "lucide-react";

const RECENT_TXS = [
  { type: "Bought USDT", amount: "450.20 USDT", time: "1 hour ago", status: "Completed", dir: "up" },
  { type: "Sold BTC", amount: "-0.0245 BTC", time: "2 hour ago", status: "Completed", dir: "down" },
  { type: "Sold ETH", amount: "-0.124 ETH", time: "2 hour ago", status: "Pending", dir: "down" },
  { type: "Sold ETH", amount: "-2.15 ETH", time: "30 minutes ago", status: "Pending", dir: "down" },
];
 
export function RecentTransactions() {
  return (
    <DashboardCard className="bg-card-background border border-border rounded-2xl p-4 h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-text">Recent Transaction</h3>
        <button className="text-xs text-Green hover:underline">See all</button>
      </div>
      <div className="space-y-2.5">
        {RECENT_TXS.map((tx, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${tx.dir === "up" ? "bg-green-500/10" : "bg-red-500/10"}`}>
              {tx.dir === "up"
                ? <ArrowUp className="w-3.5 h-3.5 text-green-500" />
                : <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-card-text">{tx.type}</p>
              <p className="text-[10px] text-text">{tx.time}</p>
            </div>
            <div className="text-right">
              <p className={`text-xs font-semibold ${tx.dir === "up" ? "text-green-500" : "text-red-500"}`}>{tx.amount}</p>
              <StatusBadge status={tx.status} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}