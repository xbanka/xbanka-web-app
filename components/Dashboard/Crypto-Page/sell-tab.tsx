"use client";
import { useEffect, useMemo, useState } from "react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { RefreshCcw } from "lucide-react";
import {
  useExecuteConversion,
  UseGetCryptoWallet,
  useGetCurrency,
  UseGetFiatWallet,
  useGetGroupedPair,
  useGetRateConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { isValidPair } from "@/lib/isValidPair";
import { mapCurrenciesToOptions, splitCurrencies } from "@/lib/crypto";
import { CryptoGetConversionTypes, CryptoQuoteTypes } from "./crypto-types";
import { Button } from "@/components/ui/button";
import { CreatePinModal } from "../Account-Page/create-pin-modal";
import { UseProfileUser } from "@/lib/services/profile.service";
import { sumFiatBalances } from "@/lib/sumBalances";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { getCoinImage } from "@/lib/coin-images";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FormValues = {
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
};

export function SellTab() {
  const searchParams = useSearchParams();
  const coinParam = searchParams.get("coin")?.toUpperCase();
  const [amount, setAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sourceCurrency, setSourceCurrency] = useState("NGNX");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();
  const { validateUser } = useOnboardingGuard();

  // const { mutate, isPending } = useExecuteConversion();
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

  const {
    data: walletData,
    error: walletError,
    isPending: walletPending,
  } = UseGetFiatWallet();

  const fiatWallets = walletData?.data?.data || [];

  const { data: profileData } = UseProfileUser();
  const hasTransactionPin = profileData?.data?.hasTransactionPin;

  const debouncedAmount = useDebounce(amount, 500);

  const currencies = currencyData?.data || [];

  const { fiat, crypto } = splitCurrencies(currencies);
  const pairMap = groupedPairData?.data || [];

  const TARGET_OPTIONS = useMemo(() => {
    return pairMap
      .filter((item: any) =>
        item.pairs?.some(
          (pair: any) => pair.code === "NGNX" && pair.side === "SELL",
        ),
      )
      .map((item: any) => ({
        label: item.code,
        value: item.code,
        image: item.code === "NGNX" ? null : getCoinImage(item.code),
      }));
  }, [pairMap]);

  const wallets = cryptoWalletData?.data?.data || [];

  const selectedWallet = wallets.find(
    (wallet: any) => wallet.currency === targetCurrency,
  );

  const availableBalance = selectedWallet?.balance || 0;

  const validTargets =
    pairMap.find((item: any) => item.code === "NGNX")?.pairs || [];

  // A coin can appear in Market Overview but not be a tradeable pair. When we
  // arrive via a "Trade" link (?coin=) for such a coin, flag it so we can tell
  // the user instead of silently falling back to the default.
  const coinUnsupported = useMemo(() => {
    if (!coinParam || validTargets.length === 0) return false;
    return !validTargets.some((pair: any) => pair.code === coinParam);
  }, [coinParam, validTargets]);

  useEffect(() => {
    if (!coinUnsupported) return;
    toast(
      `${coinParam} isn't available for buy & sell yet. ${targetCurrency} has been selected instead.`,
      {
        id: `coin-unsupported-${coinParam}`,
        style: {
          background: "#0c9a8e",
          color: "#ffffff",
          border: "1px solid #0c9a8e",
        },
      },
    );
  }, [coinUnsupported, coinParam, targetCurrency]);

  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);

  // const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

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
        sourceCurrency: targetCurrency,
        targetCurrency: sourceCurrency,
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
    // Preselect the coin passed via ?coin= (from a "Trade" link) when it's sellable
    if (coinParam && validTargets.find((p: any) => p.code === coinParam)) {
      setTargetCurrency(coinParam);
      return;
    }
    if (!validTargets.find((p: any) => p.code === targetCurrency)) {
      setTargetCurrency("USDT");
    }
  }, [groupedPairData, coinParam]);

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
        sourceCurrency: targetCurrency,
        targetCurrency: sourceCurrency,
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
            label="You Sell"
            dropDownLoading={groupedPairPending}
            available={`${availableBalance} ${targetCurrency}`}
            availableBalanceLoading={cryptoWalletPending}
            OPTIONS={TARGET_OPTIONS}
            currencyId
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            selectedCurrency={targetCurrency}
            onCurrencyChange={setTargetCurrency}
          />
          
          <AmountRow
            label="You Receive"
            dropDownLoading={currencyPending}
            availableBalanceLoading={walletPending}
            available={
              wallets
                ? `₦${sumFiatBalances(fiatWallets).toLocaleString()}`
                : "₦0.00"
            }
            value={
              convertData?.netPayout ? convertData?.netPayout.toString() : ""
            }
            readOnly
            OPTIONS={FIAT_OPTIONS}
            selectedCurrency={sourceCurrency}
            onCurrencyChange={setSourceCurrency}
          />
          <p className="text-[10px] text-text px-1">
            Min: 15 USDT • Max: 20,000 USDT
          </p>

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

      {quoteData?.netPayout && (
        <ConfirmModal
          open={confirmOpen}
          handleReset={handleReset}
          mode="SELL"
          payAmount={Number(amount || 0)}
          paySymbol={targetCurrency}
          receiveAmount={`${quoteData?.netPayout} ${sourceCurrency}` || ""}
          receiveSymbol={sourceCurrency}
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

      {openCreatePin && (
        <CreatePinModal
          open={openCreatePin}
          handleClose={() => setOpenCreatePin(false)}
        />
      )}
    </>
  );
}
