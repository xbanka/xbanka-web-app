"use client";
import { HOLDINGS } from "@/lib/MockData";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TransactionHistory } from "./transaction-history";

export function CryptoView() {
  return (
    <div className="space-y-4">
      {/* My Holdings */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-card-text text-sm">My Holdings</h3>
          <span className="text-xs text-text">{HOLDINGS.length} Assets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text border-b border-border">
                <th className="text-left pb-2 font-medium">Assets</th>
                <th className="text-left pb-2 font-medium">Balance</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">24h Change</th>
                <th className="text-left pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {HOLDINGS.map((h, i) => (
                <tr key={i} className="hover:bg-border/20 transition-colors">
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-[10px] font-bold text-card-text">
                        {h.symbol[0]}
                      </div>
                      <div>
                        <p className="font-medium text-card-text">{h.name}</p>
                        <p className="text-text">{h.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-card-text">{h.amount}</td>
                  <td className="py-2.5 font-medium text-card-text">
                    {h.value}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`flex items-center gap-0.5 font-medium ${h.up ? "text-green-500" : "text-red-500"}`}
                    >
                      {h.up ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {h.change}%
                    </span>
                  </td>
                  <td className="py-2.5">
                    <button className="text-Green font-medium hover:underline">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionHistory tableType="CRYPTO" isCrypto />
    </div>
  );
}
