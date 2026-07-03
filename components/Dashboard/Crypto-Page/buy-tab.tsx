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
import { UseProfileUser } from "@/lib/services/profile.service";
import { CreatePinModal } from "../Account-Page/create-pin-modal";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { getCoinImage } from "@/lib/coin-images";
import { useSearchParams } from "next/navigation";

export function BuyTab() {
  const searchParams = useSearchParams();
  const coinParam = searchParams.get("coin")?.toUpperCase();
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();
  const [sourceCurrency, setSourceCurrency] = useState("NGNX");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [error, setError] = useState("");
  const { validateUser } = useOnboardingGuard();

  const {
    data: walletData,
    error: walletError,
    isPending: walletPending,
  } = UseGetFiatWallet();
  const wallets = walletData?.data?.data || [];
  const latestWallet = wallets[0];

  const { mutate, isPending } = useQuoteConversion();
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
  const {
    data: cryptoWalletData,
    error: cryptoWalletError,
    isPending: cryptoWalletPending,
  } = UseGetCryptoWallet();
  const { data: profileData } = UseProfileUser();
  const hasTransactionPin = profileData?.data?.hasTransactionPin;

  const currencies = currencyData?.data || [];
  const { fiat, crypto } = splitCurrencies(currencies);
  const pairMap = useMemo(() => groupedPairData?.data || [], [groupedPairData]);

  const validSources =
    pairMap.find((item: any) => item.code === targetCurrency)?.pairs || [];

  const validTargets =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  const SOURCE_OPTIONS = validSources.map((pair: any) => ({
    label: pair.code,
    value: pair.code,
    image: pair.code === "NGNX" ? null : getCoinImage(pair.code),
  }));

  const TARGET_OPTIONS = validTargets.map((pair: any) => ({
    label: pair.code,
    value: pair.code,
    image: pair.code === "NGNX" ? null : getCoinImage(pair.code),
  }));
  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  const cryptoWallets = cryptoWalletData?.data?.data || [];

  const selectedWallet = cryptoWallets.find(
    (wallet: any) => wallet.currency === targetCurrency,
  );

  const availableBalance = selectedWallet?.balance || 0;

  const debouncedAmount = useDebounce(amount, 500);

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
    // amount = fiat the user is paying; quote returns crypto they receive
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
      const preferred =
        coinParam && validTargets.find((p: any) => p.code === coinParam);
      if (preferred) {
        setTargetCurrency(preferred.code);
        return;
      }

      const hasUSDT = validTargets.find((p: any) => p.code === "USDT");

      setTargetCurrency(hasUSDT ? "USDT" : validTargets[0].code);
    }
  }, [validTargets, coinParam]);

  useEffect(() => {
    if (!debouncedAmount) {
      setError("Amount is required");
      setReceiveAmount("");
      setConvertData(null);
      return;
    }

    if (Number(debouncedAmount) <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setError("");

    // User enters fiat amount (sourceCurrency) → API returns crypto amount (targetCurrency)
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
          setConvertData(result);
        },
      },
    );
  }, [debouncedAmount, sourceCurrency, targetCurrency]);

  return (
    <>
      <div className="gap-4">
        <div className="space-y-6">
          {/* You Pay — user enters fiat amount */}
          <div className="space-y-3">
            <AmountRow
              label="You Pay"
              dropDownLoading={currencyPending}
              availableBalanceLoading={walletPending}
              available={
                wallets
                  ? `₦${sumFiatBalances(wallets).toLocaleString()}`
                  : "₦0.00"
              }
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              OPTIONS={SOURCE_OPTIONS}
              selectedCurrency={sourceCurrency}
              onCurrencyChange={setSourceCurrency}
            />
          </div>
          {/* You Receive — read-only, calculated crypto amount */}
          <AmountRow
            label="You Receive"
            dropDownLoading={groupedPairPending}
            available={`${availableBalance} ${targetCurrency}`}
            availableBalanceLoading={cryptoWalletPending}
            OPTIONS={TARGET_OPTIONS}
            currencyId
            value={
              convertData?.amount ? convertData.amount.toString() : ""
            }
            readOnly
            selectedCurrency={targetCurrency}
            onCurrencyChange={setTargetCurrency}
          />
          {RateConversionData?.data?.rate && (
            <div className="flex items-center justify-between font-normal leading-6 text-xs text-card-ext px-1">
              <div className="flex items-center gap-1.5">
                <span>
                  1 {targetCurrency} ≈ {(1 / RateConversionData.data.rate).toLocaleString(undefined, { maximumFractionDigits: 2 })} {sourceCurrency}
                </span>
                <button className="text-card-text hover:text-Green/80 transition-colors">
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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
          paySymbol={sourceCurrency}
          receiveAmount={`${quoteData?.netPayout} ${targetCurrency}` || ""}
          receiveSymbol={targetCurrency}
          rate={
            quoteData
              ? `1 ${targetCurrency} = ${(1 / quoteData.rate).toFixed(2)} ${sourceCurrency}`
              : ""
          }
          fee={quoteData?.adminFee ? `${quoteData.adminFee}` : "0 Fee"}
          onRefreshQuote={refetchQuote}
          quoteId={quoteData?.quoteId || ""}
        />
      )}
      {openCreatePin && (
        <CreatePinModal
          open={openCreatePin}
          handleClose={() => setOpenCreatePin(false)}
        />
      )}
    </>
  );
}
