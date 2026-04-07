"use client";
import { ArrowUpDown } from "lucide-react";
import { AmountRow } from "./amount-input";
import { useEffect, useMemo, useState } from "react";
import { MarketHighlight } from "./market-highlight";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { useForm } from "react-hook-form";
import {
  useExecuteConversion,
  useGetCurrency,
  useGetGroupedPair,
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { CRYPTO_OPTIONS, FIAT_OPTIONS } from "@/lib/currencyOptions";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";
import { Button } from "@/components/ui/button";

type FormValues = {
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function ConvertTab() {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();
  const [sourceCurrency, setSourceCurrency] = useState("BTC");
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

  const {
    error: currencyError,
    data: currencyData,
    isPending: currencyPending,
  } = useGetCurrency();

  const currencies = currencyData?.data || [];
  const pairMap = useMemo(() => groupedPairData?.data || [], [groupedPairData]);

  const validTargets =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  const SOURCE_OPTIONS = useMemo(() => {
    return currencies.map((item: any) => ({
      label: item.code,
      value: item.code,
    }));
  }, [currencies]);

  const TARGET_OPTIONS = useMemo(() => {
  const pairs =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  return pairs.map((p: any) => ({
    label: p.code,
    value: p.code,
  }));
}, [pairMap, sourceCurrency]);

  const debouncedAmount = useDebounce(amount, 500);

  useEffect(() => {
  if (!TARGET_OPTIONS.find((o: any) => o.value === targetCurrency)) {
    setTargetCurrency(TARGET_OPTIONS[0]?.value || "");
  }
}, [TARGET_OPTIONS]);

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <DashboardCard className="lg:col-span-2 space-y-3">
        <AmountRow
          label="You Receive"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          OPTIONS={SOURCE_OPTIONS}
          currencyId
          selectedCurrency={sourceCurrency}
          onCurrencyChange={setSourceCurrency}
        />
        <p className="text-[10px] text-text px-1">
          Min: 0.0001 BTC • Max: 1 BTC
        </p>

        <AmountRow
          label="You Receive"
          value={
            convertData?.netPayout ? convertData.netPayout.toLocaleString() : ""
          }
          readOnly
          OPTIONS={TARGET_OPTIONS}
          currencyId
          selectedCurrency={targetCurrency}
          onCurrencyChange={setTargetCurrency}
        />

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

        <Button className="w-full transition-colors">
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
      </DashboardCard>
      <MarketHighlight />
    </div>
  );
}
