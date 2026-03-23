"use client"
import { CRYPTO_TRANSACTIONS, TRANSACTIONS } from "@/lib/MockData";
import { StatusBadge } from "@/lib/statusBadge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function TransactionHistory({ isCrypto = false }: { isCrypto?: boolean }) {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Pending", "Completed", "In Progress", "Failed"];
  const data = isCrypto ? CRYPTO_TRANSACTIONS : TRANSACTIONS;
 
  return (
    <div className="bg-card-background border border-border rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-card-text text-sm">Transaction History</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
            <input
              placeholder="Search by name or email"
              className="pl-8 pr-3 h-8 text-xs border border-input rounded-lg bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active w-44"
            />
          </div>
          <button className="flex items-center gap-1.5 h-8 px-3 text-xs border border-input rounded-lg text-card-text hover:border-border-active transition-colors">
            Transaction Type
            <SlidersHorizontal className="w-3 h-3 text-placeholder" />
          </button>
        </div>
      </div>
 
      {/* Status tabs */}
      <div className="flex gap-1 mb-4 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`pb-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
              filter === t
                ? "border-Green text-Green"
                : "border-transparent text-text hover:text-card-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
 
      <div className="overflow-x-auto">
        {isCrypto ? (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text border-b border-border">
                <th className="text-left pb-2 font-medium">Date & Time</th>
                <th className="text-left pb-2 font-medium">Type</th>
                <th className="text-left pb-2 font-medium">Asset</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Note</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((tx, i) => (
                <tr key={i} className="hover:bg-border/20 transition-colors">
                  <td className="py-2.5">
                    <p className="text-card-text font-medium">{tx.date}</p>
                    <p className="text-text">{tx.time}</p>
                  </td>
                  <td className="py-2.5 text-card-text">{tx.type}</td>
                  <td className="py-2.5 text-card-text">{(tx as any).asset}</td>
                  <td className={`py-2.5 font-medium ${(tx as any).amount?.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {(tx as any).amount}
                  </td>
                  <td className="py-2.5 text-text font-mono">{tx.ref}</td>
                  <td className="py-2.5"><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text border-b border-border">
                <th className="text-left pb-2 font-medium">Date & Time</th>
                <th className="text-left pb-2 font-medium">Transaction Type</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Reference ID</th>
                <th className="text-left pb-2 font-medium">Note</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((tx, i) => (
                <tr key={i} className="hover:bg-border/20 transition-colors">
                  <td className="py-2.5">
                    <p className="text-card-text font-medium">{tx.date}</p>
                    <p className="text-text">{tx.time}</p>
                  </td>
                  <td className="py-2.5 text-card-text">{tx.type}</td>
                  <td className="py-2.5 font-medium text-card-text">{tx.amount}</td>
                  <td className="py-2.5 text-text font-mono">{tx.ref}</td>
                  {/* <td className="py-2.5 text-text">{tx.note}</td> */}
                  <td className="py-2.5 text-text">{tx.ref}</td>
                  <td className="py-2.5"><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}