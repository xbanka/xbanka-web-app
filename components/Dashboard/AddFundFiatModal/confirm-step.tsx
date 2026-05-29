import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { bankColor, bankInitials } from "@/lib/wallet-page";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

export function ConfirmStep({
  amount,
  sourceLabel,
  accountName,
  fee,
  onBack,
  onClose,
  onConfirm,
}: {
  amount: string;
  sourceLabel: string;
  accountName: string;
  fee: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const feeNum = parseFloat(fee) || 0;
  const total = (numeric + feeNum).toLocaleString();
  const sourceBankName = sourceLabel?.split(/\s+/)[0] || sourceLabel || "";

  return (
    <Modal
      className="px-12 pt-8 pb-8 space-y-6 max-sm:px-6 max-sm:pb-6 max-sm:pt-6 max-sm:space-y-5"
      onClose={onClose}
    >
      <div className="space-y-5 max-sm:space-y-4">
        {/* Icon */}
        <div className="flex justify-center mb-3 max-sm:mb-1">
          <div className="w-15 h-15 max-sm:w-12 max-sm:h-12 rounded-full border p-2 bg-[#042F2E] border-[#0F766E] flex items-center justify-center">
            <ArrowLeftRight className="w-8 h-8 text-Green max-sm:w-6 max-sm:h-6" />
          </div>
        </div>
        <div className="font-semibold text-center text-2xl leading-8 text-card-text max-sm:text-xl max-sm:leading-7">
          Confirm Transaction
        </div>
      </div>

      <div className="space-y-4 max-sm:space-y-3">
        <div className="rounded-[20px] bg-border p-4 space-y-3 max-sm:p-3">
          <div className="pb-3 space-y-1.5">
            {/* Amount */}
            <p className="text-base font-normal leading-6 text-text text-center max-sm:text-sm">
              Amount to Fund
            </p>
            <p className="text-2xl font-semibold leading-8 text-card-text text-center max-sm:text-xl max-sm:leading-7">
              ₦{amount}
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            {[
              { label: "From", value: sourceLabel, isAccount: true },
              { label: "Account name", value: accountName },
              { label: "Fee", value: `₦${feeNum.toFixed(2)}` },
              {
                label: "Total Debit",
                value: `₦${total}`,
                bold: true,
                green: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-medium text-xs leading-5 text-text shrink-0">
                  {row.label}
                </span>
                {row.isAccount ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0",
                        bankColor(sourceBankName),
                      )}
                    >
                      {bankInitials(sourceBankName).slice(0, 1)}
                    </div>
                    <span className="font-medium text-card-text truncate">
                      {sourceLabel}
                    </span>
                  </div>
                ) : (
                  <span
                    className={cn(
                      "font-medium text-right truncate",
                      row.green ? "text-Green" : "text-card-text",
                      row.bold && "font-semibold",
                    )}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 text-xs text-text max-sm:gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-Green shrink-0 mt-0.5" />
          <span className="font-normal leading-4.6 max-sm:text-[11px] max-sm:leading-4">
            Funds will be debited directly from your selected bank account.
          </span>
        </div>
      </div>

      <div className="flex gap-3 max-sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button size="lg" className="flex-2" onClick={onConfirm}>
          Confirm Funding
        </Button>
      </div>
    </Modal>
  );
}
