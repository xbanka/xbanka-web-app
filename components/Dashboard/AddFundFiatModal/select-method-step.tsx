import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import { Building2, CreditCard, Lock } from "lucide-react";
import { SelectWithRadioButton } from "@/components/ui/select-with-radio-button";

export function SelectMethodStep({
  selected,
  onSelect,
  onClose,
  onContinue,
}: {
  selected: string;
  onSelect: (m: string) => void;
  onClose: () => void;
  onContinue: () => void;
}) {
  const methods = [
    {
      id: "bank",
      label: "Bank Account",
      desc: "Pay directly from your bank account. Takes 1-3 business days.",
      Icon: Building2,
    },
    {
      id: "card",
      label: "Debit Card",
      desc: "Use your debit card for instant funding. 1.5% fee applies.",
      Icon: CreditCard,
    },
  ];

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-10 py-6 max-sm:px-5 max-sm:py-5"
        title="Add Funds"
        subtitle="Select a funding method to add money to your wallet."
        onClose={onClose}
      />

      <div className="px-10 pb-10 pt-6 space-y-8 max-sm:px-5 max-sm:pb-6 max-sm:pt-2 max-sm:space-y-6">
        <div className="space-y-4 max-sm:space-y-3">
          {methods.map(({ id, label, desc, Icon }) => {
            const active = selected === id;
            return (
              <SelectWithRadioButton
                key={id}
                active={active}
                label={label}
                icon={Icon}
                onSelect={onSelect}
                id={id || ""}
                desc={desc}
              />
            );
          })}
          <div className="flex items-center justify-center font-normal gap-2 text-xs leading-4.5 text-text pt-1">
            <Lock className="w-4 h-4 text-text shrink-0" />
            <span>Secure, 256-bit encrypted connection</span>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!selected}
          variant={selected ? "default" : "disabled"}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
}
