"use client";
import { useEffect, useMemo, useState } from "react";
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
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { isValidPair } from "@/lib/isValidPair";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";
import { Button } from "@/components/ui/button";

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
  const [sourceCurrency, setSourceCurrency] = useState("NGNX");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [convertData, setConvertData] = useState<CryptoGetConversionTypes | null>();

  // const { mutate, isPending } = useExecuteConversion();
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

  const debouncedAmount = useDebounce(amount, 500);

  const [quoteId, setQuoteId] = useState("");
  const currencies = currencyData?.data || [];

  const { fiat, crypto } = splitCurrencies(currencies);
  const pairMap = groupedPairData?.data || [];

  const SELL_SOURCE_OPTIONS = useMemo(() => {
    return pairMap
      .filter((item: any) =>
        item.pairs?.some((p: any) => p.code === "NGNX" && p.side === "SELL"),
      )
      .map((item: any) => ({
        label: item.code,
        value: item.code,
      }));
  }, [pairMap]);

  const validTargets =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);

  // const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  const handleQuoteModal = () => {
    refetchQuote();
    setConfirmOpen(true);
  };

  const handleReset = () => {
    setConvertData(null)
    setQuoteData(null)
    setAmount("")
    setConfirmOpen(false);
  }

  const refetchQuote = () => {
    mutate(
      {
        sourceCurrency,
        targetCurrency,
        amount: Number(debouncedAmount),
        action: "SELL",
      },
      {
        onSuccess: (res) => {
          setQuoteData(res?.data);
        },
      },
    );
  };

  useEffect(() => {
    if (!validTargets.find((p: any) => p.code === targetCurrency)) {
      setTargetCurrency("NGNX");
    }
  }, [sourceCurrency, groupedPairData]);

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

    RateConversionMutate(
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
          setConvertData(result);
        },
      },
    );
  }, [debouncedAmount, sourceCurrency, targetCurrency, groupedPairData]);

  return (
    <>
      <div className="gap-4">
        <div className="space-y-3">
          <AmountRow
            label="You Receive"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={SELL_SOURCE_OPTIONS}
            currencyId
            selectedCurrency={targetCurrency}
            onCurrencyChange={setTargetCurrency}
          />
          <p className="text-[10px] text-text px-1">
            Min: 15 USDT • Max: 20,000 USDT
          </p>
          <AmountRow
            label="You Pay"
            available="₦40,000"
            readOnly
            value={
              convertData?.netPayout
                ? Number(convertData?.netPayout).toLocaleString()
                : ""
            }
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
            selectedCurrency={sourceCurrency}
            onCurrencyChange={setSourceCurrency}
          />

          {RateConversionData?.data?.estimatedPrice && (
              <div className="flex items-center justify-between font-normal leading-6 text-xs text-card-ext px-1">
                <div className="flex items-center gap-1.5">
                  <span>{RateConversionData?.data?.estimatedPrice}</span>
                  <button className="text-card-text hover:text-Green/80 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        handleReset={handleReset}
        mode="SELL"
        payAmount={Number(amount || 0)}
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
        quoteId={quoteData?.quoteId || ""}
        sourceCurrency={sourceCurrency}
        targetCurrency={targetCurrency}
      />
    </>
  );
}
