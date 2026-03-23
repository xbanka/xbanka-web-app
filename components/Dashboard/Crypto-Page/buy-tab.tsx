"use client"
import { RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { RecentTransactions } from "./recent-transactions";
import { HowTo } from "./steps";
import { ConfirmModal } from "./confirm-modal";
import { useState } from "react";
import { DashboardCard } from "@/components/Layout/DashboardCard";

export function BuyTab() {
  const [payAmount, setPayAmount] = useState("45,000.00");
  const [receiveAmount] = useState("30.60");
  const [confirmOpen, setConfirmOpen] = useState(false);
 
  return (
    <>
      <div className=" gap-4">
        <div className="space-y-3">
          <AmountRow
            label="You Pay"
            available="₦40,000"
            value={payAmount}
            onChange={setPayAmount}
            currency="NGN"
            showMax
          />
          <AmountRow
            label="You Receive"
            value={receiveAmount}
            onChange={() => {}}
            currency="USDT"
            onCurrencyToggle={() => {}}
          />
          <div className="flex items-center justify-between text-xs text-text px-1">
            <div className="flex items-center gap-1.5">
              <span>1 USDT ≈ 1,470.75 NGN</span>
              <button className="text-Green hover:text-Green/80 transition-colors">
                <RefreshCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full h-11 rounded-xl bg-Green hover:bg-Green/90 text-white text-sm font-semibold transition-colors"
          >
            Get Quote
          </button>
          <p className="text-[10px] text-text text-center">
            By Proceeding, you agree to Xbanka{" "}
            <span className="text-Green cursor-pointer hover:underline">Terms & Conditions</span>
            {" "}and{" "}
            <span className="text-Green cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
 
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        mode="buy"
        payAmount="₦45,000.00"
        paySymbol="NGN"
        receiveAmount="30.60 USDT"
        receiveSymbol="USDT"
        rate="1 USDT = 1,470.79 NGN"
        fee="O Fee"
      />
    </>
  );
}