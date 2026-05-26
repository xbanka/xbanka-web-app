import { Button } from "@/components/ui/button";
import { RateLocked } from "./rate-locked";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, X } from "lucide-react";
import { ModalHeader } from "@/components/ui/modal-header";
import { useEffect, useRef, useState } from "react";

export function ConfirmStep({
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  rate,
  fee,
  onRefreshQuote,
  onCancel,
  onConfirm,
}: {
  mode: "BUY" | "SELL";
  payAmount: string | number;
  paySymbol: string;
  receiveAmount: string;
  receiveSymbol: string;
  rate: string;
  fee: string;
  onRefreshQuote?: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isValidAmount =
    receiveAmount &&
    String(receiveAmount).trim().toLowerCase() !== "undefined" &&
    String(receiveAmount).trim() !== "";

  const formatAmount = (amount: string | number) => {
    if (!amount) return "0";

    return Number(amount).toLocaleString();
  };

  // Track previous amount
  const previousAmountRef = useRef<string | null>(null);

  // Show update banner only when amount changes
  const [showUpdatedBanner, setShowUpdatedBanner] = useState(false);

  useEffect(() => {
    if (!receiveAmount) return;

    if (
      previousAmountRef.current &&
      previousAmountRef.current !== receiveAmount
    ) {
      setShowUpdatedBanner(true);
    } else {
      previousAmountRef.current = receiveAmount;
    }
  }, [receiveAmount]);

  const previousAmount = previousAmountRef.current;

  return (
    <Modal onClose={onCancel} className="p-0">
      {/* Header */}
      <ModalHeader
        className="px-10 py-6"
        title={mode === "BUY" ? "Confirm Purchase" : "Confirm Sale"}
        onClose={onCancel}
      />

      {/* Body */}
      <div className="px-10 pb-10 pt-6 space-y-8">
        <div className="space-y-5">
          <RateLocked key={rate} seconds={30} onExpire={onRefreshQuote} />

          {showUpdatedBanner && (
            <div className="rounded-lg border border-yellow-warning-border bg-yellow-warning-light px-4 py-3 text-xs font-normal leading-4.5 text-yellow-warning-text flex items-center gap-4">
              <AlertTriangle className="w-4 h-4 text-yellow-warning-text" />
              Rate has changed significantly. Please review the new amounts
              before confirming.
            </div>
          )}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded-xl py-4 px-5">
                <p className="text-xs font-normal leading-4.5 text-text mb-2">
                  {mode === "BUY" ? "You Pay" : "You Sell"}
                </p>
                <p className="text-base font-normal leading-6 text-card-text">
                  {formatAmount(payAmount)}
                </p>
                {/* <p className="text-xs text-text mt-0.5">{paySymbol}</p> */}
              </div>
              <div className="bg-background border border-border rounded-xl py-4 px-5">
                <p className="text-xs text-text mb-1">
                  {mode === "BUY" ? "You Receive" : "You Receive"}
                </p>
                {isValidAmount ? (
                  <div>
                    <p className="text-base font-bold text-Green">
                      {receiveAmount}
                    </p>
                    {showUpdatedBanner &&
                      previousAmount &&
                      previousAmount !== receiveAmount && (
                        <p className="text-xs text-text line-through">
                          {previousAmount}
                        </p>
                      )}
                  </div>
                ) : (
                  <div className="h-3 w-[25%] bg-border rounded" />
                )}
                {/* <p className="text-xs text-text mt-0.5">{receiveSymbol}</p> */}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-text">
                <span className="text-text">Exchange Rate</span>
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
        </div>
        {/* Footer */}
        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 p-2.5 border-input"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-3 p-2.5">
            Confirm {mode === "BUY" ? "Purchase" : "Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
