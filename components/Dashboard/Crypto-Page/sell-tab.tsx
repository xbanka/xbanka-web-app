"use client"
import { useState } from "react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { RecentTransactions } from "./recent-transactions";
import { HowTo } from "./steps";
import { RefreshCcw } from "lucide-react";

export function SellTab() {
  const [sellAmount, setSellAmount] = useState("823.50");
  const [receiveAmount] = useState("₦1,092,010.34");
  const [confirmOpen, setConfirmOpen] = useState(false);
 
  return (
    <>
      <div className="gap-4">
        <div className="space-y-3">
          <AmountRow
            label="You Sell"
            available="823.50 USDT"
            value={sellAmount}
            onChange={setSellAmount}
            currency="USDT"
            onCurrencyToggle={() => {}}
            showMax
          />
          <p className="text-[10px] text-text px-1">Min: 15 USDT • Max: 20,000 USDT</p>
          <AmountRow
            label="You Receive"
            value={receiveAmount}
            onChange={() => {}}
            currency="NGN"
          />
          <p className="text-[10px] text-text px-1">
            Receive to xbanka wallet — 1 USDT ≈ 1,470.79 NGN{" "}
            <button className="text-Green inline-flex items-center gap-0.5 hover:underline">
              <RefreshCcw className="w-2.5 h-2.5" />
            </button>
          </p>
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
        mode="sell"
        payAmount="823.50"
        paySymbol="USDT"
        receiveAmount="₦1,092,010.34"
        receiveSymbol="NGN"
        rate="1 USDT = 1,470.79 NGN"
        fee="0 Fee"
      />
    </>
  );
}