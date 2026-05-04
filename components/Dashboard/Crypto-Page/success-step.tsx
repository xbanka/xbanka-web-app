import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, CheckCircle, Copy, Receipt, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ConversionResult } from "./types";
import Image from "next/image";

export function SuccessStep({
  mode,
  payAmount,
  paySymbol,
  receiveAmount,
  receiveSymbol,
  dateTime = "Apr 24, 2023, 7:18 PM",
  reference = "REF123456789",
  rate,
  fee,
  // result,
  onDone,
  onRepeat,
}: {
  mode: "BUY" | "SELL";
  payAmount: string;
  paySymbol: string;
  receiveAmount: string | number;
  receiveSymbol: string;
  rate: string;
  fee: string;
  // result: ConversionResult | null;
  reference: string;
  dateTime?: string;
  onDone: () => void;
  onRepeat: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference).catch(() => {});
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
    ...(dateTime
      ? [
          {
            label: "Date & Time",
            value: dateTime,
            valueClass: "text-card-text",
          },
        ]
      : []),
  ];

  // const secondRows = [
  //   {
  //     label: "Date & Time",
  //     value: dateTime,
  //     valueClass: "text-card-text",
  //   },
  //   {
  //     label: "You Received",
  //     value: receiveAmount,
  //     valueClass: "text-Green",
  //   },
  // ];
  return (
    <Modal className="pb-10 px-10 pt-6" onClose={onDone}>
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
            {mode === "BUY" ? "Purchase" : "Sale"} successful!
          </h3>
          <p className="text-sm font-normal leading-6 text-text">
            {mode === "BUY"
              ? `${receiveAmount} has been credited to your wallet`
              : `${receiveAmount} has been added to your Xbanka wallet`}
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

          {/* Transaction ID row with copy */}
          {dateTime && (
            <div className="flex items-center justify-between pt-3 border-t border-input text-xs">
              <span className="text-text">Date & Time</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
              >
                <span className="truncate max-w-[120px]">{dateTime}</span>
              </button>
            </div>
          )}
          {reference && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-text">Transaction ID</span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors"
              >
                <span className="truncate max-w-[120px]">{reference}</span>
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
      </div>
    </Modal>
  );
}
