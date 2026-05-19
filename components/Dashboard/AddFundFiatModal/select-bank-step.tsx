import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { SelectWithRadioButton } from "@/components/ui/select-with-radio-button";
import { bankColor, bankInitials } from "@/lib/wallet-page";
import { Plus } from "lucide-react";
import { BankAccount } from "../Account-Page/types";

const maskAccount = (accountNumber: string) =>
  accountNumber?.length > 4
    ? `${"*".repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`
    : accountNumber;

export function SelectBankStep({
  selectedId,
  onSelect,
  onBack,
  onClose,
  onContinue,
  onAddNew,
  linkedBanks,
  loading,
  error,
}: {
  selectedId: string | null;
  linkedBanks: BankAccount[];
  onSelect: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onContinue: () => void;
  onAddNew: () => void;
  loading: boolean;
  error: any;
}) {
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Select Bank Account"
        onBack={onBack}
        onClose={onClose}
      />

      <div className="space-y-8 px-10 pb-10 max-sm:px-5 max-sm:pb-6 max-sm:space-y-6">
        <div className="space-y-4 max-sm:space-y-3">
          {linkedBanks?.length === 0 && !loading && (
            <div className="text-sm text-text">
              No linked bank accounts found.
            </div>
          )}
          {linkedBanks?.map((b: BankAccount, index: number) => {
            const active = selectedId === b.id;
            return (
              <SelectWithRadioButton
                key={b.id}
                active={active}
                desc={b.accountName}
                altIcon={bankInitials(b.bankName)}
                altIconColor={bankColor(b.bankName)}
                id={b.id}
                label={`${b.bankName}- ${maskAccount(b.accountNumber)}`}
                badge={index === 0 ? "Default" : undefined}
                onSelect={onSelect}
              />
            );
          })}
          {/* Add new */}
          <button
            onClick={onAddNew}
            className="w-full flex items-center gap-3 p-3.5 max-sm:p-3 rounded-xl border border-dashed border-border hover:border-border-active transition-colors text-left"
          >
            <div className="w-10 h-10 max-sm:w-11 max-sm:h-11 rounded-full border-2 border-dashed border-Green/60 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-Green" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-card-text max-sm:text-[13px]">
                Use a new bank account
              </p>
              <p className="text-xs text-text max-sm:text-[12px] mt-1">
                Link another account to your wallet
              </p>
            </div>
          </button>
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
