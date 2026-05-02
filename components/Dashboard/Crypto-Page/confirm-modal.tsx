import { useEffect, useState } from "react";
import { ConversionResult, CryptoStep } from "./types";
import { ConfirmStep } from "./confirm-step";
import { PinStep } from "./pin-step";
import { ProcessingStep } from "./processing-step";
import { SuccessStep } from "./success-step";
import { FailedStep } from "./failed-step";

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
  const [step, setStep] = useState<CryptoStep>("confirm");
  const [result, setResult] = useState<ConversionResult | null>(null);
 
  // Reset internal step every time the modal is opened/closed
  useEffect(() => {
    if (open) setStep("confirm");
  }, [open]);
 
  // Keyboard Escape → close (only on confirm step; other steps handle it)
  useEffect(() => {
    if (!open || step !== "confirm") return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && handleReset();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, handleReset, step]);
 
  if (!open) return null;
 
  // ── step renderers ─────────────────────────────────────────
 
  if (step === "confirm") {
    return (
      <ConfirmStep
        mode={mode}
        payAmount={payAmount}
        paySymbol={paySymbol}
        receiveAmount={receiveAmount}
        receiveSymbol={receiveSymbol}
        rate={rate}
        fee={fee}
        onRefreshQuote={onRefreshQuote}
        onCancel={handleReset}
        onConfirm={() => setStep("pin")}
      />
    );
  }
 
  if (step === "pin") {
    return (
      <PinStep
        mode={mode}
        onBack={() => setStep("confirm")}
        onClose={handleReset}
        onConfirmed={() => setStep("processing")}
      />
    );
  }
 
  if (step === "processing") {
    return (
      <ProcessingStep
        mode={mode}
        payAmount={String(payAmount)}
        paySymbol={paySymbol}
        receiveAmount={receiveAmount}
        receiveSymbol={receiveSymbol}
        quoteId={quoteId}
        sourceCurrency={sourceCurrency}
        targetCurrency={targetCurrency}
        onSuccess={(data) => {
          setResult(data);
          setStep("success");
        }}
        onError={() => setStep("failed")}
      />
    );
  }
 
  if (step === "success") {
    return (
      <SuccessStep
        mode={mode}
        payAmount={String(payAmount)}
        paySymbol={paySymbol}
        receiveAmount={receiveAmount}
        receiveSymbol={receiveSymbol}
        rate={rate}
        fee={fee}
        result={result}
        onDone={handleReset}
        onRepeat={() => {
          handleReset();
        }}
      />
    );
  }
 
  if (step === "failed") {
    return (
      <FailedStep
        mode={mode}
        onClose={handleReset}
        onRetry={() => setStep("processing")}
      />
    );
  }
 
  return null;
}