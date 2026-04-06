"use client";
import { useEffect } from "react";
import { RateLocked } from "./rate-locked";
import { X } from "lucide-react";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  rate,
  fee,
  onRefreshQuote
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: "buy" | "sell";
  payAmount: string;
  paySymbol: string;
  receiveAmount: string;
  receiveSymbol: string;
  rate: string;
  fee: string;
  onRefreshQuote?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-card-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h3 className="text-base font-semibold text-card-text">
            Confirm {mode === "buy" ? "Purchase" : "Sale"} modal
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <RateLocked seconds={30} />

          {/* You Pay / You Receive */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-xl p-3">
              <p className="text-xs text-text mb-1">
                {mode === "buy" ? "You Pay" : "You Sell"}
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
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-border text-sm font-medium text-card-text hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors
              ${mode === "buy" ? "bg-Green hover:bg-Green/90" : "bg-error-text hover:bg-error-text/90"}`}
          >
            Confirm {mode === "buy" ? "Purchase" : "Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
