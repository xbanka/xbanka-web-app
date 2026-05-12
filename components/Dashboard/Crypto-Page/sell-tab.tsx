"use client";
import { useEffect, useMemo, useState } from "react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { RefreshCcw } from "lucide-react";
import {
  useExecuteConversion,
  UseGetCryptoWallet,
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
import { CreatePinModal } from "../Account-Page/create-pin-modal";
import { UseProfileUser } from "@/lib/services/profile.service";

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
  const [quoteData, setQuoteData] = useState<CryptoQuoteTypes | null>();
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [convertData, setConvertData] =
    useState<CryptoGetConversionTypes | null>();

  // const { mutate, isPending } = useExecuteConversion();
  const { data, mutate, isPending } = useQuoteConversion();
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

  const wallets = cryptoWalletData?.data?.data || [];

  const selectedWallet = wallets.find(
    (wallet: any) => wallet.currency === sourceCurrency,
  );

  const availableBalance = selectedWallet?.balance || 0;

  const validTargets =
    pairMap.find((item: any) => item.code === sourceCurrency)?.pairs || [];

  const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);

  // const FIAT_OPTIONS = mapCurrenciesToOptions(fiat);
  const CRYPTO_OPTIONS = mapCurrenciesToOptions(crypto);

  const handleQuoteModal = () => {
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
            label="You Sell"
            available={`${availableBalance} ${sourceCurrency}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={SELL_SOURCE_OPTIONS}
            currencyId
            selectedCurrency={sourceCurrency}
            onCurrencyChange={setSourceCurrency}
          />
          <p className="text-[10px] text-text px-1">
            Min: 15 USDT • Max: 20,000 USDT
          </p>
          <AmountRow
            label="You Receive"
            readOnly
            value={
              convertData?.netPayout ? convertData?.netPayout.toString() : ""
            }
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
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
          sourceCurrency={sourceCurrency}
          targetCurrency={targetCurrency}
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
