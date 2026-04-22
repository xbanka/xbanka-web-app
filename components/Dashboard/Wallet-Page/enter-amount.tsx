import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { QUICK_AMOUNTS } from "@/lib/wallet-page";
import { ChevronRight } from "lucide-react";

export function EnterAmountStep({
  amount,
  setAmount,
  sourceLabel,
  sourceColor,
  sourceName,
  onBack,
  onClose,
  onContinue,
}: {
  amount: string;
  setAmount: (v: string) => void;
  sourceLabel: string;
  sourceColor: string;
  sourceName: string;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const numeric = parseFloat(amount.replace(/,/g, "")) || 0;
  const isValid = numeric >= 1000;

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Add Funds"
        onBack={onBack}
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-6 space-y-8">
        <div className="space-y-10">
          {/* Funding from */}
          <div className="space-y-2">
            <span className="text-sm font-medium leading-5 text-text">Funding from</span>
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl border border-input">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-[36px] p-2 flex items-center justify-center text-white text-[9px] font-bold",
                    sourceColor,
                  )}
                >
                  {sourceLabel[0]}
                </div>
                <div>
                  <p className="text-sm font-medium leading-5 text-card-text">
                    {sourceLabel}
                  </p>
                  <p className="text-xs text-text mt-2 font-normal leading-5.5">
                    {sourceName}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-text" />
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Amount input */}
            <div className="">
              <div className="flex items-center gap-2 py-3 px-4 border rounded-xl border-input h-17.5">
                <span className="text-2xl font-bold text-card-text">₦</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(raw ? Number(raw).toLocaleString() : "");
                  }}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-card-text outline-none placeholder:text-text/30 min-w-0"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-text mt-2">
                <span className="font-normal text-xs leading-4.5">Minimum transfer: ₦1,000</span>
                <span className="font-normal text-xs leading-4.5 bg-input-background py-2.5 px-4 rounded-lg">₦30,000 remaining today</span>
              </div>
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.toLocaleString())}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-xs font-normal leading-6 border transition-colors",
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

        <div className="flex gap-4">
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
