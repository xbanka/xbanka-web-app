"use client";
import { ArrowUpDown, RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { useEffect, useMemo, useState } from "react";
import { MarketHighlight } from "./market-highlight";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { useForm } from "react-hook-form";
import {
  useExecuteConversion,
  UseGetCryptoWallet,
  useGetCurrency,
  useGetGroupedPair,
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { CRYPTO_OPTIONS, FIAT_OPTIONS } from "@/lib/currencyOptions";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "./confirm-modal";
import { UseProfileUser } from "@/lib/services/profile.service";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { getCoinImage } from "@/lib/coin-images";

type FormValues = {
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function ConvertTab() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sourceCurrency, setSourceCurrency] = useState("USDT");
  const [targetCurrency, setTargetCurrency] = useState("NGNX");
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();
  const { validateUser } = useOnboardingGuard();

  const { mutate, isPending } = useQuoteConversion();
  const {
    data: cryptoWalletData,
    error: cryptoWalletError,
    isPending: cryptoWalletPending,
  } = UseGetCryptoWallet();

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

  const { data: profileData } = UseProfileUser();
  const hasTransactionPin = profileData?.data?.hasTransactionPin;
  console.log(hasTransactionPin);

  const currencies = currencyData?.data || [];
  const pairMap = useMemo(() => groupedPairData?.data || [], [groupedPairData]);

  const SOURCE_OPTIONS = useMemo(() => {
    return currencies.map((item: any) => ({
      label: item.code,
      value: item.code,
      image: item.code === "NGNX" ? null : getCoinImage(item.code),
    }));
  }, [currencies]);

  const wallets = cryptoWalletData?.data?.data || [];

  const selectedWallet = wallets.find(
    (wallet: any) => wallet.currency === sourceCurrency,
  );

  const availableBalance = selectedWallet?.balance || 0;

  const TARGET_OPTIONS = useMemo(() => {
    const pairs =
      pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

    return pairs.map((p: any) => ({
      label: p.code,
      value: p.code,
      image: p.code === "NGNX" ? null : getCoinImage(p.code),
    }));
  }, [pairMap, sourceCurrency]);

  const handleQuoteModal = () => {
    const isAllowed = validateUser();

    if (!isAllowed) return;
    if (!hasTransactionPin) {
      setOpenCreatePin(true);
      return;
    }
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
        action: "SELL",
      },
      {
        onSuccess: (res) => {
          setQuoteData(res?.data);
        },
      },
    );
  };

  const debouncedAmount = useDebounce(amount, 500);

  useEffect(() => {
    if (!TARGET_OPTIONS.find((o: any) => o.value === targetCurrency)) {
      setTargetCurrency(TARGET_OPTIONS[0]?.value || "");
    }
  }, [TARGET_OPTIONS]);

  useEffect(() => {
    if (!debouncedAmount) {
      setError("Amount is required");
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
        action: "SELL",
      },
      {
        onSuccess: (res) => {
          const result = res?.data;
          setConvertData(result);
        },
      },
    );
  }, [debouncedAmount, sourceCurrency, targetCurrency, groupedPairData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 items-start gap-4">
      <DashboardCard className="lg:col-span-2 space-y-3">
        <AmountRow
          label="From"
          dropDownLoading={currencyPending}
          available={`${availableBalance} ${sourceCurrency}`}
          availableBalanceLoading={cryptoWalletPending}
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
          label="To (Estimated)"
          dropDownLoading={groupedPairPending}
          value={convertData?.netPayout ? convertData.netPayout.toString() : ""}
          readOnly
          OPTIONS={TARGET_OPTIONS}
          currencyId
          selectedCurrency={targetCurrency}
          onCurrencyChange={setTargetCurrency}
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
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-text">Transaction Fee</span>
          <span className="text-green-500 font-medium">0 Fee</span>
        </div>
        {RateConversionData?.data && (
          <div className="flex items-center justify-between text-xs px-1 font-medium">
            <span className="text-text">You get</span>
            <span className="text-card-text">
              {RateConversionData?.data?.netPayout}{" "}
              {RateConversionData?.data?.targetCurrency}
            </span>
          </div>
        )}

        <Button
          onClick={handleQuoteModal}
          className="w-full transition-colors"
          variant={
            !amount || Number(amount) <= 0 || isPending ? "disabled" : "default"
          }
          disabled={
            !amount || Number(amount) <= 0 || RateConversionPending || isPending
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
      </DashboardCard>
      <MarketHighlight />
      {quoteData?.netPayout && (
        <ConfirmModal
          open={confirmOpen}
          handleReset={handleReset}
          mode="SELL"
          isConvert
          payAmount={Number(amount || 0)}
          paySymbol={sourceCurrency}
          receiveAmount={`${quoteData?.netPayout} ${targetCurrency}` || ""}
          receiveSymbol={targetCurrency}
          rate={
            quoteData
              ? `1 ${targetCurrency} = ${quoteData.rate} ${sourceCurrency}`
              : ""
          }
          fee={quoteData?.adminFee ? `${quoteData.adminFee}` : "0 Fee"}
          onRefreshQuote={refetchQuote}
          quoteId={quoteData?.quoteId || ""}
        />
      )}
    </div>
  );
}
