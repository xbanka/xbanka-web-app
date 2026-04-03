"use client";
import { RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetCurrency,
  useGetGroupedPair,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { Button } from "@/components/ui/button";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";

type FormValues = {
  receiveAmount: string;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function BuyTab() {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteData, setQuoteData] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("NGNX");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const { data, mutate, isPending } = useQuoteConversion();
  const { data: groupedPairData, error: groupedPairError, isPending: groupedPairPending } = useGetGroupedPair();
  console.log("groupedPairData", groupedPairData);
  const {
    error: currencyError,
    data: currencyData,
    isPending: currencyPending,
  } = useGetCurrency();
  console.log("currencyData", currencyData);

  const currencies = currencyData?.data || [];
  const { fiat, crypto } = splitCurrencies(currencies);
  console.log("fiat", fiat);
  console.log("crypto", crypto);
  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);

  // const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  const debouncedAmount = useDebounce(amount, 500);

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

    setError("");

    mutate(
      {
        sourceCurrency,
        targetCurrency,
        amount: Number(debouncedAmount),
      },
      {
        onSuccess: (res) => {
          const result = res?.data;

          setReceiveAmount(result?.amount?.toString() || "");
          setQuoteData(result);
        },
      },
    );
  }, [debouncedAmount, sourceCurrency, targetCurrency]);

  return (
    <>
      <div className="gap-4">
        <div className="space-y-6">
          <AmountRow
            label="You Pay"
            available="₦40,000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
            selectedCurrency={sourceCurrency}
            onCurrencyChange={setSourceCurrency}
          />
          <div className="space-y-3">
            <AmountRow
              label="You Receive"
              value={Number(receiveAmount).toFixed(CRYPTO_OPTIONS.find((o) => o.value === targetCurrency)?.maximumDecimalPlaces || 0)}
              OPTIONS={CRYPTO_OPTIONS}
              currencyId
              selectedCurrency={targetCurrency}
              onCurrencyChange={setTargetCurrency}
            />
            <div className="flex items-center justify-between text-xs text-text px-1">
              <div className="flex items-center gap-1.5">
                <span>1 USDT ≈ 1,470.75 NGN</span>
                <button className="text-Green hover:text-Green/80 transition-colors">
                  <RefreshCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => setConfirmOpen(true)}
              className="w-full h-11 rounded-xl bg-Green hover:bg-Green/90 text-white text-sm font-semibold transition-colors"
            >
              Get Quote
            </Button>
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
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        mode="buy"
        payAmount={`₦${Number(amount || 0).toLocaleString()}`}
        paySymbol={sourceCurrency}
        receiveAmount={`${receiveAmount} ${targetCurrency}`}
        receiveSymbol={targetCurrency}
        rate={
          quoteData
            ? `1 ${targetCurrency} = ${quoteData.rate} ${sourceCurrency}`
            : ""
        }
        fee={quoteData?.fee ? `${quoteData.fee}` : "0 Fee"}
      />
    </>
  );
}
