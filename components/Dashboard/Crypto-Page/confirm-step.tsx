import { Button } from "@/components/ui/button";
import { RateLocked } from "./rate-locked";
import { Modal } from "@/components/ui/Modal";
import { X } from "lucide-react";

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
  return (
    <Modal onClose={onCancel} className="p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-6 border-border">
        <RateLocked key={rate} seconds={30} onExpire={onRefreshQuote} />
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
 
      {/* Body */}
      <div className="px-6 pb-9 space-y-4">
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
 
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-text">
            <span>
              {rate.split("=")[0].trim()} ={" "}
              {rate.split("=")[1]?.trim()}
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
          onClick={onCancel}
          variant="outline"
          className="flex-1 p-2.5 border-input"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant={mode === "BUY" ? "default" : "red"}
          className="flex-3 p-2.5"
        >
          Confirm {mode === "BUY" ? "Purchase" : "Sale"}
        </Button>
      </div>
    </Modal>
  );
}