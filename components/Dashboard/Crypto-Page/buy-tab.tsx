"use client";
import { RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetCurrency,
  useGetGroupedPair,
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { Button } from "@/components/ui/button";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";

type FormValues = {
  receiveAmount: string;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function BuyTab() {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes>();
  const [convertData, setConvertData] = useState<CryptoGetConversionTypes>();
  const [sourceCurrency, setSourceCurrency] = useState("NGNX");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const { data, mutate, isPending } = useQuoteConversion();
  const {
    data: RateConversionData,
    mutate: RateConversionMutate,
    isPending: RateConversionPending,
  } = useGetRateConversion();
  const {
    data: groupedPairData,
    error: groupedPairError,
    isPending: groupedPairPending,
  } = useGetGroupedPair();
  console.log("groupedPairData", groupedPairData);
  const {
    error: currencyError,
    data: currencyData,
    isPending: currencyPending,
  } = useGetCurrency();

  const currencies = currencyData?.data || [];
  const { fiat, crypto } = splitCurrencies(currencies);
  const pairMap = useMemo(() => groupedPairData?.data || [], [groupedPairData]);

  const validTargets =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  const TARGET_OPTIONS = validTargets.map((pair: any) => ({
    label: pair.code,
    value: pair.code,
  }));
  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  const debouncedAmount = useDebounce(amount, 500);

  const handleQuoteModal = () => {
    refetchQuote();
    setConfirmOpen(true);
  };

  const refetchQuote = () => {
    mutate(
      {
        sourceCurrency,
        targetCurrency,
        amount: Number(debouncedAmount),
        action: "BUY",
      },
      {
        onSuccess: (res) => {
          setQuoteData(res?.data);
        },
      },
    );
  };
  useEffect(() => {
    if (validTargets.length > 0) {
      const hasUSDT = validTargets.find((p: any) => p.code === "USDT");

      setTargetCurrency(hasUSDT ? "USDT" : validTargets[0].code);
    }
  }, [validTargets]);

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

    RateConversionMutate(
      {
        sourceCurrency,
        targetCurrency,
        amount: Number(debouncedAmount),
        action: "BUY",
      },
      {
        onSuccess: (res) => {
          const result = res?.data;

          setReceiveAmount(result?.amount?.toString() || "");
          console.log("quote result", result);
          setConvertData(result);
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
              value={
                convertData?.netPayout
                  ? convertData.netPayout.toLocaleString()
                  : ""
              }
              readOnly
              OPTIONS={TARGET_OPTIONS}
              currencyId
              selectedCurrency={targetCurrency}
              onCurrencyChange={setTargetCurrency}
            />
            <div className="flex items-center justify-between font-normal leading-6 text-xs text-card-ext px-1">
              <div className="flex items-center gap-1.5">
                <span>1 USDT ≈ 1,470.75 NGN</span>
                <button className="text-card-text hover:text-Green/80 transition-colors">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleQuoteModal}
              className="w-full transition-colors"
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
        receiveAmount={`${quoteData?.netPayout} ${targetCurrency}`}
        receiveSymbol={targetCurrency}
        rate={
          quoteData
            ? `1 ${targetCurrency} = ${quoteData.rate} ${sourceCurrency}`
            : ""
        }
        fee={quoteData?.netPayout ? `${quoteData.rate}` : "0 Fee"}
        onRefreshQuote={refetchQuote}
      />
    </>
  );
}
