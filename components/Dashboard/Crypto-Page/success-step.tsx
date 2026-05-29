import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Receipt,
  RefreshCcw,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { formatCurrencyAmount } from "@/lib/formatCurrencyAmount";
import { DetailBox } from "./detail-box";

export function SuccessStep({
  mode,
  dateTime = "Apr 24, 2023, 7:18 PM",
  result,
  onDone,
  onRepeat,
}: {
  mode: "BUY" | "SELL";
  result: ConversionResult | null;
  dateTime?: string;
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
      label: mode === "BUY" ? "You paid" : "Asset Sold",
      value: `${payAmount} ${paySymbol}`,
      valueClass: "text-card-text",
    },
    {
      label: "You received",
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
  ];

  return (
    <Modal
      className="pb-10 px-10 pt-6 max-sm:pb-6 max-sm:px-5 max-sm:pt-4"
      onClose={onDone}
    >
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>

      <div className="flex flex-col items-center gap-6 text-center space-y-4">
        {/* Success badge */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center">
          <Image src={"badge 2.svg"} alt="checkmark" width={60} height={60} />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {mode === "BUY" ? "Sale" : "Purchase"} successful!
          </h3>
          <p className="text-sm font-normal leading-6 text-text">
            {mode === "BUY"
              ? `You sold ${result?.debitAmount} ${result?.debitCurrency} and received ${result?.creditAmount} ${result?.creditCurrency}`
              : `${result?.creditAmount} ${result?.creditCurrency} has been credited to your wallet`}
          </p>
        </div>

        {/* Receipt */}
        <div className="w-full bg-border rounded-[20px] space-y-3 p-4 text-left">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-text font-medium text-xs leading-5">
                {r.label}
              </span>
              <span className={`font-normal text-sm leading-6 ${r.valueClass}`}>
                {r.value}
              </span>
            </div>
          ))}

          {dateTime && (
            <div className="flex items-center justify-between pt-3 border-t border-input text-xs">
              <span className="text-text">Date & Time</span>
              <span className="font-normal text-sm leading-6 text-card-text truncate max-w-30">
                {dateTime}
              </span>
            </div>
          )}
          {reference && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text">Transaction ID</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
              >
                <span className="truncate max-w-30">{reference}</span>
                {copied ? (
                  <CheckCircle className="w-3.5 h-3.5 text-Green shrink-0" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text shrink-0" />
                )}
              </button>
            </div>
          )}
          {!nairaAsset && (
            <DetailBox
              label="NGN received"
              value={`${result?.creditAmount ?? ""} ${result?.creditCurrency ?? ""}`}
            />
          )}
          {nairaAsset && (
            <DetailBox
              label="You paid"
              value={`${result?.debitAmount ?? ""} ${result?.debitCurrency ?? ""}`}
            />
          )} 
          {nairaAsset && (
            <DetailBox
              label="You received"
              value={`${result?.creditAmount ?? ""} ${result?.creditCurrency ?? ""}`}
            />
          )} 
        </div>

        {/* Transaction ID row with copy */}
        {dateTime && (
          <div className="flex items-center justify-between pt-3 border-t border-input text-xs">
            <span className="text-text">Date & Time</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
            >
              <span className="truncate max-w-30">{dateTime}</span>
            </button>
          </div>
        )}

        {result?.transactionId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-text">Transaction ID</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
            >
              <span className="truncate max-w-30">
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
      <div className="w-full space-y-6">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 text-card-text"
            // onClick={onRepeat}
          >
            <Receipt className="w-4 h-4 text-text" />
            View Receipt
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 bg-[#042F2E] border-[#0F766E] text-Green"
            onClick={onRepeat}
          >
            <RefreshCcw className="w-4 h-4" />
            {mode === "BUY" ? "Buy again" : "Sell again"}
          </Button>
        </div>
        <Button size="lg" className="w-full" onClick={onDone}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
