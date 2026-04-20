import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { QUICK_AMOUNTS } from "@/lib/wallet-page";
import { ChevronRight } from "lucide-react";

export function EnterAmountStep({
  amount, setAmount, sourceLabel, sourceColor, sourceName,
  onBack, onClose, onContinue,
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
    <Modal onClose={onClose}>
      <ModalHeader title="Add Funds" onBack={onBack} onClose={onClose} />
 
      {/* Funding from */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-text">Funding from</span>
        <div className="flex items-center gap-2">
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold", sourceColor)}>
            {sourceLabel[0]}
          </div>
          <span className="text-xs font-semibold text-card-text">{sourceLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-text" />
        </div>
      </div>
 
      {/* Amount input */}
      <div className="bg-background border border-border rounded-xl p-4 mb-4">
        <p className="text-xs text-text mb-2">Amount</p>
        <div className="flex items-center gap-2">
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
          <span>Minimum transfer: ₦1,000</span>
          <span>₦30,000 remaining today</span>
        </div>
      </div>
 
      {/* Quick amounts */}
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_AMOUNTS.map((q) => (
          <button key={q} onClick={() => setAmount(q.toLocaleString())}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              amount === q.toLocaleString()
                ? "border-Green bg-Green/10 text-Green"
                : "border-border text-text hover:border-border-active"
            )}
          >
            ₦{q.toLocaleString()}
          </button>
        ))}
      </div>
 
      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button size="lg" className="flex-1" disabled={!isValid}
          variant={isValid ? "default" : "disabled"} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}