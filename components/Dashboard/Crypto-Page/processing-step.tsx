import { useExecuteConversion } from "@/lib/services/wallet.service";
import { useEffect } from "react";
import { ConversionResult } from "./types";
import { Spinner } from "@/components/ui/spinner";
import { LucideArrowLeftRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function ProcessingStep({
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  quoteId,
  sourceCurrency,
  targetCurrency,
  onSuccess,
  onError,
}: {
  mode: "BUY" | "SELL";
  payAmount: string;
  paySymbol: string;
  receiveAmount: string;
  receiveSymbol: string;
  quoteId: string;
  sourceCurrency: string;
  targetCurrency: string;
  onSuccess: (data: ConversionResult) => void;
  onError: () => void;
}) {
  const { mutate, isPending } = useExecuteConversion();
 
  useEffect(() => {
    if (!quoteId) return;
    mutate(
      {
        quoteId,
        sourceCurrency,
        targetCurrency,
        amount: Number(payAmount),
      },
      {
        onSuccess: (res: any) => {
          // Map API response fields — adjust to your actual shape
          onSuccess({
            youPaid: payAmount,
            youReceived: receiveAmount,
            rate: res?.data?.rate,
            fee: res?.data?.fee ?? "₦0.00",
            dateTime: res?.data?.createdAt,
            transactionId: res?.data?.reference ?? res?.data?.transactionId,
          });
        },
        onError: () => {
          onError();
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);
 
  return (
    <Modal className="pt-6 space-y-6" onClose={() => {}}>
      <div className="flex flex-col items-center gap-6 text-center px-6 pb-10">
        <Spinner icon={LucideArrowLeftRight} size={52} />
 
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            Processing your {mode === "BUY" ? "purchase" : "sale"}…
          </h3>
          <p className="text-base font-normal leading-6 text-text">
            We are completing your order. Please don't close this window.
          </p>
        </div>
 
        {/* Mini summary */}
        <div className="w-full bg-background border border-border rounded-xl p-4 space-y-3 text-left">
          <div className="flex justify-between text-xs">
            <span className="text-text">
              {mode === "BUY" ? "You Pay" : "You Sell"}
            </span>
            <span className="font-semibold text-card-text">
              {payAmount} {paySymbol}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text">You Receive</span>
            <span className="font-semibold text-Green">{receiveAmount}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}