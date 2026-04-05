"use client";
import { useEffect, useState } from "react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { RecentTransactions } from "./recent-transactions";
import { HowTo } from "./steps";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useExecuteConversion,
  useGetCurrency,
  useGetGroupedPair,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { isValidPair } from "@/lib/isValidPair";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";

type FormValues = {
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function SellTab() {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sourceCurrency, setSourceCurrency] = useState("USDT");
  const [targetCurrency, setTargetCurrency] = useState("NGNX");
  const [quoteData, setQuoteData] = useState("");


  // const { mutate, isPending } = useExecuteConversion();
    const { data, mutate, isPending } = useQuoteConversion();
  
  const {
    data: groupedPairData,
    error: groupedPairError,
    isPending: groupedPairPending,
  } = useGetGroupedPair();

   const {
      error: currencyError,
      data: currencyData,
      isPending: currencyPending,
    } = useGetCurrency();

  const debouncedAmount = useDebounce(amount, 500);

  const [quoteId, setQuoteId] = useState("");
  const currencies = currencyData?.data || [];

    const { fiat, crypto } = splitCurrencies(currencies);
  

  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);

  // const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  // 🔥 Auto call backend when user stops typing
  useEffect(() => {
    if (!debouncedAmount) {
      setError("Amount is required");
      setReceiveAmount("");
      return;
    }

    if (Number(debouncedAmount) <= 0) {
      setError("Enter a valid amount");
      return;
    }

    // ✅ CHECK PAIR BEFORE CALL
    if (
      !isValidPair(groupedPairData?.data || [], sourceCurrency, targetCurrency)
    ) {
      setError("This conversion pair is not supported");
      setReceiveAmount("");
      return;
    }

    setError("");

    mutate(
      {
        sourceCurrency,
        targetCurrency,
        amount: Number(debouncedAmount),
        action: "SELL",
      },
      {
        onSuccess: (res) => {
          const result = res?.data;
          setReceiveAmount(result?.amount?.toString() || "");
          setQuoteData(result);
        },
      },
    );
  }, [debouncedAmount, sourceCurrency, targetCurrency, groupedPairData]);

  return (
    <>
      <div className="gap-4">
        <div className="space-y-3">
          <AmountRow
            label="You Pay"
            available="₦40,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
            selectedCurrency={sourceCurrency}
            onCurrencyChange={setSourceCurrency}
          />
          <p className="text-[10px] text-text px-1">
            Min: 15 USDT • Max: 20,000 USDT
          </p>
          <AmountRow
            label="You Receive"
            value={Number(receiveAmount).toFixed(
              CRYPTO_OPTIONS.find((o) => o.value === targetCurrency)
                ?.maximumDecimalPlaces || 0,
            )}
            OPTIONS={CRYPTO_OPTIONS}
            currencyId
            selectedCurrency={targetCurrency}
            onCurrencyChange={setTargetCurrency}
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
            <span className="text-Green cursor-pointer hover:underline">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-Green cursor-pointer hover:underline">
              Privacy Policy
            </span>
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
