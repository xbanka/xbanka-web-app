import { useExecuteConversion } from "@/lib/services/wallet.service";
import { useEffect } from "react";
import { ConversionResult, ExecuteConversionResponse } from "./types";
import { Spinner } from "@/components/ui/spinner";
import { LucideArrowLeftRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function ProcessingStep({
  mode,
  quoteId,
  onSuccess,
  onError,
}: {
  mode: "BUY" | "SELL";
  quoteId: string;
  onSuccess: (data: ConversionResult) => void;
  onError: (error: any) => void;
}) {
  const { mutate, isPending } = useExecuteConversion();

  useEffect(() => {
    if (!quoteId) return;
    mutate(
      {
        quoteId,
      },
      {
        onSuccess: (res: ExecuteConversionResponse) => {
          const debit = res.data.debit;
          const credit = res.data.credit;
          onSuccess({
            debitAmount: debit.amount,
            debitCurrency: debit.currency,

            creditAmount: credit.amount,
            creditCurrency: credit.currency,

            dateTime: credit.createdAt,
            transactionId: credit.reference,
          });
        },
        onError: (error) => {
          onError(error);
        },
      },
    );
  }, [quoteId]);

  return (
    <Modal
      className="space-y-6 text-center p-10 max-sm:p-6"
      onClose={() => {}}
    >
      <div className="flex justify-center">
        <Spinner icon={LucideArrowLeftRight} size={80} />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-xl max-sm:leading-7">
          Processing your request…
        </h3>
        <p className="text-base font-normal leading-6 text-text max-sm:text-sm">
          This usually takes a few seconds. Please don't close this window.
        </p>
      </div>
    </Modal>
  );
}
