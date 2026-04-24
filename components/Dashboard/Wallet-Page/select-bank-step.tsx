import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectWithRadioButton } from "@/components/ui/select-with-radio-button";
import { UseFundFiatWalletBank, UseGetBankAcounts } from "@/lib/services/wallet.service";
import { cn } from "@/lib/utils";
import { SAVED_BANKS } from "@/lib/wallet-page";
import { Plus } from "lucide-react";
import { BankAccount } from "../Account-Page/types";

export function SelectBankStep({
  selectedId,
  onSelect,
  onBack,
  onClose,
  onContinue,
  onAddNew,
  linkedBanks,
  loading,
  error
}: {
  selectedId: string | null;
  linkedBanks: BankAccount[]
  onSelect: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onAddNew: () => void;
  loading: boolean;
  error: any
}) {
  // const {mutate, isPending, error} = UseFundFiatWalletBank()
  // const {data, isPending, error} = UseGetBankAcounts()
  // const linkedBanks = data?.data?.data
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6"
        title="Select Bank Account"
        onBack={onBack}
        onClose={onClose}
      />

      <div className="space-y-8 px-10 pb-10">
        <div className="space-y-4">
          {linkedBanks?.map((b: BankAccount) => {
            const active = selectedId === b.id;
            return (
              <SelectWithRadioButton
                active={active}
                desc={b.accountName}
                altIcon={b.bankName[0]}
                id={b.id}
                label={b.bankName + " " + b.accountNumber}
                onSelect={onSelect}
              />
            );
          })}
          {/* Add new */}
          <button
            onClick={onAddNew}
            className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-border hover:border-border-active transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-border flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-text" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-text">
                Use a new bank account
              </p>
              <p className="text-xs text-text">
                Link another account to your wallet
              </p>
            </div>
          </button>
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
