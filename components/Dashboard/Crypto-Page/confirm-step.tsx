import { Button } from "@/components/ui/button";
import { RateLocked } from "./rate-locked";
import { Modal } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { ModalHeader } from "@/components/ui/modal-header";

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
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded-xl py-4 px-5">
                <p className="text-xs font-normal leading-4.5 text-text mb-2">
                  {mode === "BUY" ? "You Pay" : "You Sell"}
                </p>
                <p className="text-base font-normal leading-6 text-card-text">
                  {payAmount}
                </p>
                {/* <p className="text-xs text-text mt-0.5">{paySymbol}</p> */}
              </div>
              <div className="bg-background border border-border rounded-xl py-4 px-5">
                <p className="text-xs text-text mb-1">{mode === "BUY" ? "You Receive" : "You Receive"}</p>
                {isValidAmount ? (
                  <p className="text-base font-bold text-Green">
                    {receiveAmount}
                  </p>
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
          <Button
            onClick={onConfirm}
            className="flex-3 p-2.5"
          >
            Confirm {mode === "BUY" ? "Purchase" : "Sale"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
