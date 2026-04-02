"use client";
import { RefreshCcw } from "lucide-react";
import { AmountRow } from "./amount-input";
import { ConfirmModal } from "./confirm-modal";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useExecuteConversion,
  useQuoteConversion,
} from "@/lib/services/wallet.service";
import { useForm } from "react-hook-form";
import { CRYPTO_OPTIONS, FIAT_OPTIONS } from "@/lib/currencyOptions";
import { amountSchema } from "@/lib/schema/amount-schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const [sourceCurrency, setSourceCurrency] = useState("NGN");
  const [targetCurrency, setTargetCurrency] = useState("USDT");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState("");

  const { data, mutate, isPending } = useQuoteConversion();

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
      <div className=" gap-4">
        <div className="space-y-3">
          <AmountRow
            label="You Pay"
            available="₦40,000"
            value={amount.replace(/,/g, "")}
            onChange={(e) => setAmount(e.target.value)}
            OPTIONS={FIAT_OPTIONS}
            currencyId="sourceCurrency"
            onCurrencyChange={(val) => setSourceCurrency(val)}
          />
          <AmountRow
            label="You Receive"
            value={receiveAmount}
            OPTIONS={CRYPTO_OPTIONS}
            currencyId="targetCurrency"
            onCurrencyChange={(val) => setTargetCurrency(val)}
          />
          <div className="flex items-center justify-between text-xs text-text px-1">
            <div className="flex items-center gap-1.5">
              <span>1 USDT ≈ 1,470.75 NGN</span>
              <button className="text-Green hover:text-Green/80 transition-colors">
                <RefreshCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
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
