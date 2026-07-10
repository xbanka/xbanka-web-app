import { Button } from "@/components/ui/button";
import { RateLocked } from "./rate-locked";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";
import { ModalHeader } from "@/components/ui/modal-header";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getCoinImage } from "@/lib/coin-images";

function CurrencyPill({ symbol }: { symbol: string }) {
  const isNaira = symbol === "NGNX" || symbol === "NGN";
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="h-5 w-5 flex items-center justify-center rounded-full overflow-hidden">
        {isNaira ? (
          <div className="h-5 w-5 rounded-full bg-Green border border-[#5EEAD4] flex items-center  justify-center text-white text-[10px] font-bold">
            ₦
          </div>
        ) : (
          <Image
            src={getCoinImage(symbol)}
            alt={symbol}
            width={20}
            height={20}
            className="rounded-full"
          />
        )}
      </div>
      <span className="text-xs font-semibold text-card-text">{symbol}</span>
    </div>
  );
}

export function ConfirmStep({
  mode,
  isConvert,
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
  isConvert?: boolean;
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

  // Strip the trailing currency symbol — the pill already shows it.
  const stripSymbol = (value: string | null) =>
    value ? value.replace(receiveSymbol, "").trim() : "";

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
  const rateChanged =
    showUpdatedBanner && previousAmount && previousAmount !== receiveAmount;

  const confirmTitle = isConvert
    ? "Confirm Conversion"
    : mode === "BUY"
      ? "Confirm Purchase"
      : "Confirm Sale";

  const confirmCta = isConvert
    ? "Confirm Conversion"
    : `Confirm ${mode === "BUY" ? "Purchase" : "Sale"}`;

  return (
    <Modal onClose={onCancel} className="p-0">
      {/* Header */}
      <ModalHeader
        className="px-10 py-6 max-sm:px-4 max-sm:py-4"
        title={confirmTitle}
        onClose={onCancel}
      />

      {/* Body */}
      <div className="px-10 pb-10 pt-6 space-y-8 max-sm:px-4 max-sm:pb-5 max-sm:pt-4">
        <div className="space-y-6 max-sm:space-y-5">
          <RateLocked key={rate} seconds={30} onExpire={onRefreshQuote} />

          {showUpdatedBanner && (
            <div className="rounded-lg border border-yellow-warning-border bg-yellow-warning-light px-4 py-3 text-xs font-normal leading-4.5 text-yellow-warning-text flex items-center gap-4">
              <AlertTriangle className="w-4 h-4 text-yellow-warning-text shrink-0" />
              Rate has changed significantly. Please review the new amounts
              before confirming.
            </div>
          )}

          {isConvert ? (
            /* ── Convert: stacked full-width boxes ───────────────── */
            <div className="space-y-3">
              <div className="bg-card-secondary border border-[#34373D] rounded-xl py-4 px-5 max-sm:py-3.5 max-sm:px-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-normal leading-4.5 text-text mb-2">
                    You Convert
                  </p>
                  <p className="text-2xl max-sm:font-[400] max-sm:leading-[24px] max-sm:text-[16px] font-bold leading-8 text-card-text wrap-break-word max-sm:text-xl">
                    {formatAmount(payAmount)}
                  </p>
                </div>
                <CurrencyPill symbol={paySymbol} />
              </div>

              <div className="bg-card-secondary border border-[#34373D] rounded-xl py-4 px-5 max-sm:py-3.5 max-sm:px-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-normal leading-4.5 text-text mb-2">
                    You Get
                  </p>
                  {isValidAmount ? (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold max-sm:font-medium max-sm:leading-[24px] max-sm:text-[16px] leading-8 text-[#A6F4C5] wrap-break-word max-sm:text-xl">
                        {stripSymbol(receiveAmount)}
                      </p>
                      {rateChanged && (
                        <p className="text-xs text-text line-through">
                          Was {stripSymbol(previousAmount)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="h-7 w-32 bg-border rounded animate-pulse" />
                  )}
                </div>
                <CurrencyPill symbol={receiveSymbol} />
              </div>

              <div className="space-y-2 text-sm max-sm:text-xs pt-1">
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
          ) : (
            /* ── Buy / Sell: side-by-side boxes ──────────────────── */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 items-stretch">
                <div className="bg-card-secondary border border-[#34373D] rounded-xl py-4 px-5 max-sm:py-3.5 max-sm:px-4 flex flex-col">
                  <p className="text-sm max-sm:text-xs font-normal leading-5 text-text mb-2">
                    {mode === "BUY" ? "You Pay" : "You Sell"}
                  </p>
                  <p className="text-base font-normal leading-6 text-card-text wrap-break-word">
                    {paySymbol ? `${paySymbol} ` : ""}
                    {formatAmount(payAmount)}
                  </p>
                </div>
                <div className="bg-card-secondary border border-[#34373D] rounded-xl py-4 px-5 max-sm:py-3.5 max-sm:px-4 flex flex-col">
                  <p className="text-sm max-sm:text-xs font-normal leading-5 text-text mb-2">
                    You Receive
                  </p>
                  {isValidAmount ? (
                    <div className="space-y-1">
                      <p className="text-base font-normal leading-6 text-[#A6F4C5] wrap-break-word">
                        {receiveAmount}
                      </p>
                      {rateChanged && (
                        <p className="text-xs text-text line-through">
                          {previousAmount}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="h-7 w-[60%] bg-border rounded animate-pulse" />
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
          )}
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
          <Button
            onClick={onConfirm}
            className="flex-2 py-3 font-semibold max-sm:text-[14px] max-sm:leading-[22px] max-sm:font-medium"
          >
            {confirmCta}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
