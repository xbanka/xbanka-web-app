"use client";
import { useEffect } from "react";
import { RateLocked } from "./rate-locked";
import { X } from "lucide-react";
import { useExecuteConversion } from "@/lib/services/wallet.service";
import { ErrorField } from "@/components/ui/field-error";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";

export function ConfirmModal({
  open,
  handleReset,
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  rate,
  fee,
  onRefreshQuote,
  quoteId,
  sourceCurrency,
  targetCurrency,
}: {
  open: boolean;
  handleReset: () => void;
  mode: "BUY" | "SELL";
  payAmount: string | number;
  paySymbol: string;
  receiveAmount: string;
  receiveSymbol: string;
  rate: string;
  fee: string;
  onRefreshQuote?: () => void;
  quoteId: string;
  sourceCurrency: string;
  targetCurrency: string;
}) {
  const { data, mutate, isPending, error, reset } = useExecuteConversion();

  const handleSubmit = () => {
    mutate(
      {
        quoteId,
        sourceCurrency,
        targetCurrency,
        amount: Number(payAmount)
      },
      {
        onSuccess: (res) => {
          handleReset();
          reset();
        },
      },
    );
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && handleReset();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, handleReset]);

  if (!open) return null;
  return (
    <Modal onClose={handleReset} className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-6 border-border">
          {/* <h3 className="text-base font-semibold text-card-text">
          </h3> */}
            <RateLocked key={rate} seconds={30} onExpire={onRefreshQuote} />
          <button
            onClick={handleReset}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-9 space-y-4">
          {/* You Pay / You Receive */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-xl p-3">
              <p className="text-xs text-text mb-1">
                {mode === "BUY" ? "You Pay" : "You Sell"}
              </p>
              <p className="text-base font-bold text-card-text">{payAmount}</p>
              <p className="text-xs text-text mt-0.5">{paySymbol}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-3">
              <p className="text-xs text-text mb-1">You Receive</p>
              <p className="text-base font-bold text-Green">{receiveAmount}</p>
              <p className="text-xs text-text mt-0.5">{receiveSymbol}</p>
            </div>
          </div>

          {error && <ErrorField message={error.message} />}

          {/* Rate + Fee */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-text">
              <span>
                {rate.split("=")[0].trim()} = {rate.split("=")[1]?.trim()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text">Transaction Fee</span>
              <span
                className={
                  fee === "0 Fee" || fee === "O Fee"
                    ? "text-green-500 font-medium"
                    : "text-card-text font-medium"
                }
              >
                {fee}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-6 border-t border-input">
          <Button
            onClick={handleReset}
            variant={"outline"}
            className="flex-1 transition-colors p-2.5 border-input"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            variant={mode === "BUY" ? "default" : "red"}
            className={`flex-3 transition-colors ${isPending ? "cursor-not-allowed" : ""} p-2.5`}
          >
            {isPending ? "Confirming..." : "Confirm"} {mode === "BUY" ? "Purchase" : "Sale"}
          </Button>
        </div>
    </Modal>
  );
}
