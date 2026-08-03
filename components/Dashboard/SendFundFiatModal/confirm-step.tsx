import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { BankLogo } from "@/components/ui/bank-logo";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

export function ConfirmStep({
  amount,
  sourceLabel,
  accountName,
  fee,
  note,
  bankName,
  bankCode,
  onBack,
  onClose,
  onConfirm,
}: {
  amount: string;
  sourceLabel: string;
  accountName: string;
  fee: string;
  note?: string;
  /** Full bank name, for logo lookup. Falls back to parsing `sourceLabel`. */
  bankName?: string;
  /** CBN bank code — the most reliable key for the logo lookup. */
  bankCode?: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const feeNum = parseFloat(fee) || 0;
  const total = (numeric + feeNum).toLocaleString();
  // `sourceLabel` is "<bank name> <account number>", so strip the trailing
  // account number when no explicit bankName was passed.
  const sourceBankName =
    bankName || sourceLabel?.replace(/\s*\d+\s*$/, "").trim() || sourceLabel || "";

  const rows: {
    label: string;
    value: string;
    isAccount?: boolean;
    muted?: boolean;
  }[] = [
    { label: "From", value: sourceLabel, isAccount: true },
    { label: "Account name", value: accountName },
    { label: "Fee", value: `₦${feeNum.toFixed(2)}` },
    { label: "Note", value: note?.trim() || "---------", muted: !note?.trim() },
  ];

  return (
    <Modal
      className="pt-6 space-y-8 max-sm:px-5 max-sm:pt-5 max-sm:pb-6 max-sm:space-y-6"
      onClose={onClose}
    >
      <div className="space-y-6 max-sm:space-y-4">
        {/* Icon */}
        <div className="flex justify-center mb-4 max-sm:mb-2">
          <div className="w-15 h-15 max-sm:w-14 max-sm:h-14 rounded-full border-2 border-[#0F766E] bg-transparent flex items-center justify-center">
            <ArrowLeftRight className="w-7 h-7 text-Green max-sm:w-6 max-sm:h-6" />
          </div>
        </div>
        <div className="font-semibold text-center text-2xl leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
          Review &amp; Confirm Transaction
        </div>
      </div>

      <div className="space-y-4 max-sm:space-y-3">
        <div className="rounded-[20px] bg-border p-4 space-y-4 max-sm:p-3.5 max-sm:space-y-3">
          <div className="pb-2 space-y-2 text-center">
            <p className="text-base font-normal leading-6 text-text max-sm:text-sm">
              Amount
            </p>
            <p className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
              ₦{amount}
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-medium text-xs leading-5 text-text shrink-0">
                  {row.label}
                </span>
                {row.isAccount ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <BankLogo
                      bankName={sourceBankName}
                      bankCode={bankCode}
                      size={16}
                    />
                    <span className="font-medium text-card-text truncate">
                      {row.value}
                    </span>
                  </div>
                ) : (
                  <span
                    className={cn(
                      "font-medium text-right truncate max-sm:text-[12px]",
                      row.muted ? "text-text tracking-widest" : "text-card-text",
                    )}
                  >
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-input flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-xs leading-5 text-text">
              Amount
            </span>
            <span className="font-semibold text-Green text-sm max-sm:text-[13px]">
              ₦{total}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-text">
          <AlertTriangle className="w-4 h-4 text-Green shrink-0" />
          <span className="font-normal leading-4.6 max-sm:text-[11px]">
            Funds will be debited directly from your selected bank account.
          </span>
        </div>
      </div>

      <div className="flex gap-4 max-sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button size="lg" className="flex-3" onClick={onConfirm}>
          Confirm &amp; Send
        </Button>
      </div>
    </Modal>
  );
}
