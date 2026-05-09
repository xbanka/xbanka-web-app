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
  onError: (error: Error) => void;
}) {
  const { mutate, isPending } = useExecuteConversion();

  useEffect(() => {
    if (!quoteId) return;
    mutate(
      {
        quoteId,
        // sourceCurrency,
        // targetCurrency,
        // amount: Number(payAmount),
      },
      {
        onSuccess: (res: any) => {
          // Map API response fields — adjust to your actual shape
          onSuccess({
            youPaid: payAmount,
            youReceived: receiveAmount,
            rate: res?.data?.rate ?? "N0.00",
            fee: res?.data?.fee ?? "₦0.00",
            dateTime: res?.data?.createdAt,
            transactionId: res?.data?.reference,
          });
        },
        onError: (error) => {
          onError(error);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId]);

  return (
    <Modal className="space-y-6 text-center p-10" onClose={() => {}}>
      <div className="flex justify-center">
        <Spinner icon={LucideArrowLeftRight} size={80} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold leading-8 text-card-text">
          Processing your {mode === "BUY" ? "purchase" : "sale"}…
        </h3>
        <p className="text-base font-normal leading-6 text-text">
          We are completing your order. Please don't close this window.
        </p>
      </div>
    </Modal>
  );
}
