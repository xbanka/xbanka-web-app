import { DashboardCard } from "@/components/Layout/DashboardCard";
import { TimeAgoComponent } from "@/components/ui/timeAgo";
import { timeAgo } from "@/lib/formatDate";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { StatusBadge } from "@/lib/statusBadge";
import { transactionHistoryType } from "@/lib/transactionHistoryType";
import { ArrowDown, ArrowUp } from "lucide-react";

const RECENT_TXS = [
  { type: "Bought USDT", amount: "450.20 USDT", time: "1 hour ago", status: "Completed", dir: "up" },
  { type: "Sold BTC", amount: "-0.0245 BTC", time: "2 hour ago", status: "Completed", dir: "down" },
  { type: "Sold ETH", amount: "-0.124 ETH", time: "2 hour ago", status: "Pending", dir: "down" },
  { type: "Sold ETH", amount: "-2.15 ETH", time: "30 minutes ago", status: "Pending", dir: "down" },
];
 
export function RecentTransactions() {
  const {
      data: transactionHistory,
      isPending,
      isError,
      error,
    } = UseGetTransactionHistory();
  const transactions = transactionHistory?.data?.data?.items || [];
    const fiatTransactions = transactionHistoryType("CRYPTO", transactions)
    const getIcon = (status: string) => {
  if (status === "COMPLETED") {
    return <ArrowUp className="w-6 h-6 text-[#6CE9A6]" />;
  }
  if (status === "PENDING") {
    return <ArrowUp className="w-6 h-6 text-[#FF8882]" />;
  }
  return <ArrowDown className="w-6 h-6 text-[#FF8882]" />;
};
    const getBadge = (status: string) => {
  if (status === "COMPLETED") {
    return "w-6 h-6 text-[#6CE9A6]";
  }
  if (status === "PENDING") {
    return "w-6 h-6 text-[#FF8882]";
  }
  return "w-6 h-6 text-[#FF8882]";
};
  return (
    <DashboardCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] leading-6 font-medium text-card-text">Recent Transaction</h3>
        <button className="text-[14px] font-medium leading-5.5 text-Green cursor-pointer hover:underline">See all</button>
      </div>
      <div className="space-y-4">
        {fiatTransactions.map((tx, i) => (
          <div key={i} className="flex justify-between items-center gap-3 py-3 px-4 bg-border rounded-lg">
            <div className="flex gap-2">
              <div className={`w-10 h-10 p-2 rounded-full flex items-center justify-center shrink-0 ${getBadge(tx.status)}`}>
                  {getIcon(tx.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] leading-5 font-medium text-card-text">{tx.type}</p>
                <p className="text-[12px] font-normal leading-5.5 text-text"><TimeAgoComponent date={tx.createdAt} /></p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-[14px] text-card-text font-medium leading-5`}>{tx.amount}</p>
              <StatusBadge status={tx.status} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}