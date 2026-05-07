import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { UseGetFiatWalletSavedCards } from "@/lib/services/wallet.service";
import { cn } from "@/lib/utils";
import { SAVED_CARDS } from "@/lib/wallet-page";
import { Plus } from "lucide-react";

export function SelectCardStep({
  selectedId,
  onSelect,
  onBack,
  onClose,
  onContinue,
  onAddNew,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onAddNew: () => void;
}) {
  const {
    data: savedCardsData,
    error: savedCardsError,
    isPending: savedCardsPending,
  } = UseGetFiatWalletSavedCards();
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Select Debit Card"
        onBack={onBack}
        onClose={onClose}
      />

      <div className="space-y-8 px-10 pb-10">
        <div className="space-y-4">
          {/* {SAVED_CARDS.map((c) => {
            const active = selectedId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                  active
                    ? "border-border-active bg-[#042F2E]"
                    : "border-border hover:border-border-active",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                    c.color,
                  )}
                >
                  {c.bank[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-card-text">
                      {c.masked}
                    </p>
                    {c.isDefault && (
                      <span className="text-xs font-normal leading-4.5 px-2 py-0.5 rounded-sm bg-background text-[#C2C7CF] border border-input">
                        Default
                      </span>
                    )}
                    <span className="text-[10px] text-text">{c.type}</span>
                  </div>
                  <p className="text-xs text-text mt-0.5">
                    {c.name} · Exp {c.expiry}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                    active ? "border-Green" : "border-text",
                  )}
                >
                  {active && <div className="w-2 h-2 rounded-full bg-Green" />}
                </div>
              </button>
            );
          })} */}
          <h1>No saved cards at the moment</h1>

          {/* Add new card */}
          <button
            onClick={onAddNew}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-[#0F766E] bg-card-background hover:border-border-active transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full border border-[#0F766E] bg-[#042F2E] p-2 text-[#5EEAD4] flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-[#5EEAD4]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-5 text-card-text">
                Add a new card
              </p>
              <p className="text-xs font-normal leading-5.5 text-text">
                Link a new debit card to your wallet
              </p>
            </div>
          </button>
        </div>

        <div className="flex gap-4 mt-6">
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
            disabled={!selectedId}
            variant={selectedId ? "default" : "disabled"}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
