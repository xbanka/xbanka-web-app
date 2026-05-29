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
        className="px-10 py-6 max-sm:px-5 max-sm:py-4"
        title={mode === "BUY" ? "Confirm Purchase" : "Confirm Sale"}
        onClose={onCancel}
      />

      {/* Body */}
      <div className="px-10 pb-10 pt-6 space-y-8 max-sm:px-5 max-sm:pb-6 max-sm:pt-4 max-sm:space-y-6">
        <div className="space-y-6 max-sm:space-y-5">
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
                <p className="text-2xl font-bold max-sm:font-medium max-sm:text-[16px] max-sm:leading-[24px] leading-7 text-card-text wrap-break-word max-sm:text-xl">
                  {paySymbol ? `${paySymbol} ` : ""}
                  {formatAmount(payAmount)}
                </p>
              </div>
              <div className="bg-[#25272B] border border-[#374151] rounded-xl py-5 px-5 max-sm:py-4 max-sm:px-3.5">
                <p className="text-sm font-normal leading-5 text-text mb-3 max-sm:text-xs max-sm:mb-2">
                  You Receive
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
                  <div className="h-6 w-[60%] bg-border rounded animate-pulse" />
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm max-sm:text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text">Exchange Rate</span>
                <span className="text-card-text font-medium">
                  {rate.split("=")[0].trim()} = {rate.split("=")[1]?.trim()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text">Transaction Fee</span>
                <span
                  className={
                    fee === "0 Fee" || fee === "O Fee"
                      ? "text-Green font-medium"
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
        <div className="flex gap-4 max-sm:gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-3 border-input"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-2 py-3 font-semibold">
            Confirm {mode === "BUY" ? "Purchase" : "Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
