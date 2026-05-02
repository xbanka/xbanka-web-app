import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, CheckCircle, Copy } from "lucide-react";
import { useState } from "react";
import { ConversionResult } from "./types";

export function SuccessStep({
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  rate,
  fee,
  result,
  onDone,
  onRepeat,
}: {
  mode: "BUY" | "SELL";
  payAmount: string;
  paySymbol: string;
  receiveAmount: string;
  receiveSymbol: string;
  rate: string;
  fee: string;
  result: ConversionResult | null;
  onDone: () => void;
  onRepeat: () => void;
}) {
  const [copied, setCopied] = useState(false);
 
  const copy = () => {
    if (!result?.transactionId) return;
    navigator.clipboard.writeText(result.transactionId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  const rows = [
    {
      label: mode === "BUY" ? "You Paid" : "Asset Sold",
      value: `${payAmount} ${paySymbol}`,
      valueClass: "text-card-text",
    },
    {
      label: "You Received",
      value: receiveAmount,
      valueClass: "text-Green",
    },
    {
      label: "Rate",
      value: rate || "—",
      valueClass: "text-card-text",
    },
    {
      label: "Fee",
      value: fee === "0 Fee" || fee === "O Fee" ? "₦0.00" : fee,
      valueClass: "text-card-text",
    },
    ...(result?.dateTime
      ? [
          {
            label: "Date & Time",
            value: result.dateTime,
            valueClass: "text-card-text",
          },
        ]
      : []),
  ];
 
  return (
    <Modal className="pb-10 px-10 pt-6" onClose={onDone}>
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
 
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Success badge */}
        <div className="w-16 h-16 rounded-full bg-Green/10 border border-Green/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-Green" />
        </div>
 
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {mode === "BUY" ? "Purchase" : "Sale"} successful!
          </h3>
          <p className="text-sm font-normal leading-6 text-text">
            {mode === "BUY"
              ? `${receiveAmount} has been credited to your wallet`
              : `${receiveAmount} has been added to your Xbanka wallet`}
          </p>
        </div>
 
        {/* Receipt */}
        <div className="w-full bg-border border border-input rounded-[20px] p-1 divide-y divide-input text-left">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between px-4 py-3 text-xs"
            >
              <span className="text-text">{r.label}</span>
              <span className={`font-medium ${r.valueClass}`}>{r.value}</span>
            </div>
          ))}
 
          {/* Transaction ID row with copy */}
          {result?.transactionId && (
            <div className="flex items-center justify-between px-4 py-3 text-xs">
              <span className="text-text">Transaction ID</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
              >
                <span className="truncate max-w-[120px]">
                  {result.transactionId}
                </span>
                {copied ? (
                  <CheckCircle className="w-3.5 h-3.5 text-Green flex-shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text flex-shrink-0" />
                )}
              </button>
            </div>
          )}
        </div>
 
        {/* Actions */}
        <div className="w-full space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onRepeat}
            >
              {mode === "BUY" ? "Buy again" : "Sell again"}
            </Button>
            <Button size="lg" className="flex-1" onClick={onDone}>
              Done
            </Button>
          </div>
        </div>
 
        <div className="flex items-center gap-1.5 text-xs text-text">
          <AlertTriangle className="w-3 h-3 text-text shrink-0" />
          <span>Secured by Xbanka</span>
        </div>
      </div>
    </Modal>
  );
}