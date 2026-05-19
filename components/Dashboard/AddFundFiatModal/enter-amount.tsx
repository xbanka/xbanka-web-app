import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { bankColor, bankInitials, QUICK_AMOUNTS } from "@/lib/wallet-page";
import { ChevronRight } from "lucide-react";

export function EnterAmountStep({
  amount,
  setAmount,
  sourceLabel,
  sourceName,
  onBack,
  onClose,
  onContinue,
}: {
  amount: string;
  setAmount: (v: string) => void;
  sourceLabel: string;
  sourceName: string;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const isValid = numeric >= 1000;
  const sourceBankName = sourceLabel?.split(/\s+/)[0] || sourceLabel || "";

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Add Funds"
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-6 space-y-8 max-sm:px-5 max-sm:pb-6 max-sm:pt-2 max-sm:space-y-6">
        <div className="space-y-10 max-sm:space-y-6">
          {/* Funding from */}
          <div className="space-y-2">
            <span className="text-sm font-medium leading-5 text-text">
              Funding from
            </span>
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-input">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                    bankColor(sourceBankName),
                  )}
                >
                  {bankInitials(sourceBankName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-5 text-card-text truncate max-sm:text-[13px]">
                    {sourceLabel}
                  </p>
                  <p className="text-xs text-text mt-2 font-normal leading-5.5 truncate max-sm:mt-1 max-sm:text-[12px]">
                    {sourceName}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text shrink-0" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Amount input */}
            <div className="space-y-2">
              <span className="text-sm font-medium leading-5 text-text">
                Amount
              </span>
              <div className="flex items-center gap-2 py-3 px-4 border rounded-xl border-input h-17.5 max-sm:h-15 max-sm:px-3">
                <span className="text-2xl font-bold text-card-text max-sm:text-xl">
                  ₦
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(raw ? Number(raw).toLocaleString() : "");
                  }}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-card-text outline-none placeholder:text-text/30 min-w-0 max-sm:text-xl"
                />
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] text-text mt-2 max-sm:mt-1">
                <span className="font-normal text-xs leading-4.5 max-sm:text-[11px]">
                  Minimum transfer: ₦1,000
                </span>
                <span className="font-normal text-xs leading-4.5 bg-input-background py-2.5 px-4 rounded-lg shrink-0 max-sm:py-1.5 max-sm:px-2.5 max-sm:text-[11px]">
                  ₦30,000 remaining today
                </span>
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 overflow-x-auto pb-1 max-sm:-mx-1 max-sm:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.toLocaleString())}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-xs font-normal leading-6 border transition-colors shrink-0 max-sm:px-3 max-sm:py-2",
                    amount === q.toLocaleString()
                      ? "border-Green bg-Green/10 text-Green"
                      : "border-input text-text hover:border-border-active",
                  )}
                >
                  ₦{q.toLocaleString()}
                </button>
              ))}
            </div>
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
          <Button
            size="lg"
            className="flex-3"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
