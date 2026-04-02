"use client"
import { ArrowUpDown } from "lucide-react";
import { AmountRow } from "./amount-input";
import { useEffect, useState } from "react";
import { MarketHighlight } from "./market-highlight";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { useForm } from "react-hook-form";
import { useExecuteConversion } from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { CRYPTO_OPTIONS, FIAT_OPTIONS } from "@/lib/currencyOptions";

type FormValues = {
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function ConvertTab() {
  const [fromAmount, setFromAmount] = useState("823.50");
  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      amount: "",
      sourceCurrency: "USDT",
      targetCurrency: "NGN",
    },
  });

  const { mutate, isPending } = useExecuteConversion();

  const amount = watch("amount");
  const sourceCurrency = watch("sourceCurrency");
  const targetCurrency = watch("targetCurrency");

  const debouncedAmount = useDebounce(amount, 500);

  const [quoteId, setQuoteId] = useState("");

  // 🔥 Auto call backend when user stops typing
  useEffect(() => {
    if (!debouncedAmount || Number(debouncedAmount) <= 0) return;

    mutate({
      quoteId: "temp-quote-id", // replace with real quote endpoint later
      sourceCurrency,
      targetCurrency,
      amount: Number(debouncedAmount),
    });
  }, [debouncedAmount, sourceCurrency, targetCurrency]);
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <DashboardCard className="lg:col-span-2 space-y-3">
        {/* <AmountRow 
          label="From"
          available="0.00034 BTC"
          currency="BTC"
          onCurrencyToggle={() => {}}
          showMax
          OPTIONS={FIAT_OPTIONS}
          id={"amount"}
          currencyId={"sourceCurrency"}
        /> */}
        <p className="text-[10px] text-text px-1">Min: 0.0001 BTC • Max: 1 BTC</p>
 
        {/* Swap icon */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full border border-border bg-card-background flex items-center justify-center text-text hover:border-border-active hover:text-Green transition-colors cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
          </div>
        </div>
 
        {/* <AmountRow
          label="To (Estimated)"
          currency="USDT"
          onCurrencyToggle={() => {}}
          OPTIONS={FIAT_OPTIONS}
          id={"amount"}
          currencyId={"sourceCurrency"}
        /> */}
 
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-text">1 BTC = 92,300 USDT</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-text">Transaction Fee</span>
          <span className="text-green-500 font-medium">0 Fee</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1 font-medium">
          <span className="text-text">You get</span>
          <span className="text-card-text">0.00 USDT</span>
        </div>
 
        <button className="w-full h-11 rounded-xl bg-Green hover:bg-Green/90 text-white text-sm font-semibold transition-colors">
          Get Quote
        </button>
        <p className="text-[10px] text-text text-center">
          By Proceeding, you agree to Xbanka{" "}
          <span className="text-Green cursor-pointer hover:underline">Terms & Conditions</span>
          {" "}and{" "}
          <span className="text-Green cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </DashboardCard>
      <MarketHighlight />
    </div>
  );
}