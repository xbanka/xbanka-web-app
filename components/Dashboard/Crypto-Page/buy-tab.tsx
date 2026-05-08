"use client";
import { RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  UseGetCryptoWallet,
  useGetCurrency,
  UseGetFiatWallet,
  useGetGroupedPair,
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { Button } from "@/components/ui/button";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";
import { sumFiatBalances } from "@/lib/sumBalances";

type FormValues = {
  receiveAmount: string;
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function BuyTab() {
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();
  const [sourceCurrency, setSourceCurrency] = useState("USDT");
  const [targetCurrency, setTargetCurrency] = useState("NGNX");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const {
    data: walletData,
    error: walletError,
    isPending: walletPending,
  } = UseGetFiatWallet();
  const wallets = walletData?.data?.data || [];
  const latestWallet = wallets[0];

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

  const validSources =
    pairMap.find((item: any) => item.code === targetCurrency)?.pairs || [];

  const SOURCE_OPTIONS = validSources.map((pair: any) => ({
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

  const handleReset = () => {
    setConvertData(null);
    setQuoteData(null);
    setAmount("");
    setConfirmOpen(false);
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
          console.log("refetchQuote id:", res?.data)
        },
      },
    );
  };
  useEffect(() => {
    if (validSources.length > 0) {
      const hasUSDT = validSources.find((p: any) => p.code === "USDT");

      setSourceCurrency(hasUSDT ? "USDT" : validSources[0].code);
    }
  }, [validSources]);

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
            available={
              wallets
                ? `₦${sumFiatBalances(wallets).toLocaleString()}`
                : "₦0.00"
            }
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
            selectedCurrency={targetCurrency}
            onCurrencyChange={setTargetCurrency}
          />
          <div className="space-y-3">
            <AmountRow
              label="You Receive"
              value={
                convertData?.netPayout ? convertData.netPayout.toString() : ""
              }
              readOnly
              OPTIONS={SOURCE_OPTIONS}
              currencyId
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
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleQuoteModal}
              className="w-full transition-colors"
              variant={
                !amount || Number(amount) <= 0 || isPending
                  ? "disabled"
                  : "default"
              }
              disabled={
                !amount ||
                Number(amount) <= 0 ||
                RateConversionPending ||
                isPending
              }
            >
              {RateConversionPending || isPending
                ? "Getting Quote..."
                : "Get Quote"}
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

      {quoteData?.netPayout && (
        <ConfirmModal
          open={confirmOpen}
          handleReset={handleReset}
          mode="BUY"
          payAmount={Number(amount || 0)}
          paySymbol={targetCurrency}
          receiveAmount={`${quoteData?.netPayout} ${sourceCurrency}` || ""}
          receiveSymbol={targetCurrency}
          rate={
            quoteData
              ? `1 ${sourceCurrency} = ${quoteData.rate} ${targetCurrency}`
              : ""
          }
          fee={quoteData?.adminFee ? `${quoteData.adminFee}` : "0 Fee"}
          onRefreshQuote={refetchQuote}
          quoteId={quoteData?.quoteId || ""}
          sourceCurrency={sourceCurrency}
          targetCurrency={targetCurrency}
        />
      )}
    </>
  );
}
