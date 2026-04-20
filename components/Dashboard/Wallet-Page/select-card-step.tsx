import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { cn } from "@/lib/utils";
import { SAVED_CARDS } from "@/lib/wallet-page";
import { Plus } from "lucide-react";

export function SelectCardStep({
  selectedId, onSelect, onBack, onClose, onContinue, onAddNew,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onAddNew: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Select Debit Card" onBack={onBack} onClose={onClose} />
 
      <div className="space-y-2.5">
        {SAVED_CARDS.map((c) => {
          const active = selectedId === c.id;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors",
                active ? "border-Green bg-Green/5" : "border-border hover:border-border-active"
              )}
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0", c.color)}>
                {c.bank[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-card-text">{c.masked}</p>
                  {c.isDefault && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-Green/15 text-Green border border-Green/25">
                      Default
                    </span>
                  )}
                  <span className="text-[10px] text-text">{c.type}</span>
                </div>
                <p className="text-xs text-text mt-0.5">{c.name} · Exp {c.expiry}</p>
              </div>
              <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", active ? "border-Green" : "border-text")}>
                {active && <div className="w-2 h-2 rounded-full bg-Green" />}
              </div>
            </button>
          );
        })}
 
        {/* Add new card */}
        <button onClick={onAddNew}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-border hover:border-border-active transition-colors text-left">
          <div className="w-9 h-9 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 text-text" />
          </div>
          <div>
            <p className="text-sm font-semibold text-card-text">Add a new card</p>
            <p className="text-xs text-text">Link a new debit card to your wallet</p>
          </div>
        </button>
      </div>
 
      <div className="flex gap-3 mt-6">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button size="lg" className="flex-1" disabled={!selectedId}
          variant={selectedId ? "default" : "disabled"} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}