import { useEffect, useState } from "react";
import { ConfirmStep } from "../Crypto-Page/confirm-step";
import { PinStep } from "../Crypto-Page/pin-step";
import { ProcessingStep } from "../Crypto-Page/processing-step";
import { SuccessStep } from "../Crypto-Page/success-step";
import { FailedStep } from "../Crypto-Page/failed-step";
import { ConversionResult, CryptoStep } from "../Crypto-Page/types";

export function ConfirmCryptoModal({
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
  const [ processingError, setProcessingError] = useState<string | null>(null);
 
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
        onError={(error) => {
          setProcessingError(error.message);
          setStep("failed");
        }}
      />
    );
  }
 
  if (step === "success") {
    return (
      <SuccessStep
        mode={mode}
        payAmount={String(result?.youPaid ?? payAmount)}
        paySymbol={paySymbol}
        receiveAmount={result?.youReceived ?? receiveAmount}
        receiveSymbol={receiveSymbol}
        rate={result?.rate || "N0.00"}
        fee={fee}
        dateTime={result?.dateTime}
        reference={result?.transactionId || "—"}
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
        errorMessage={processingError ? `${processingError}` : ""}
      />
    );
  }
 
  return null;
}