import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { TransactionDescriptionField } from "@/components/ui/transaction-description-field";

const formatAmount = (raw: string) => {
  const numeric = parseFloat(raw.replace(/,/g, ""));
  if (Number.isNaN(numeric)) return raw;
  return numeric.toLocaleString();
};

export function SuccessStep({
  amount,
  onDone,
  onAddMore,
  name,
  bank,
  fee,
  date,
  reference,
  message,
}: {
  amount: string;
  onDone: () => void;
  onAddMore: () => void;
  name: string;
  bank: string;
  fee: string;
  date: string;
  reference: string;
  message: string;
}) {
  const displayAmount = formatAmount(amount);

  return (
    <Modal
      className="pt-6 max-sm:px-5 max-sm:pt-5 max-sm:pb-6"
      onClose={onDone}
    >
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center space-y-6 max-sm:space-y-4 max-sm:gap-4">
        <Image src={"/badge 2.svg"} alt="badge" width={60} height={60} unoptimized />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
            Money sent!
          </h3>
          <p className="text-lg font-semibold leading-7 text-card-text max-sm:text-base">
            {message || (
              <>
                You&apos;ve sent{" "}
                <span className="text-card-text">₦{displayAmount}</span>
                {name ? <> to {name}</> : null}
              </>
            )}
          </p>
        </div>
        <div className="space-y-3 rounded-[20px] bg-border p-4 w-full max-sm:p-3.5">
          {name && <TransactionDescriptionField label="Recipient" value={name} />}
          {bank && (
            <TransactionDescriptionField label="Bank" value={bank} isAccount />
          )}
          {amount && (
            <TransactionDescriptionField
              label="Amount"
              value={`₦${displayAmount}.00`}
            />
          )}
          {fee && <TransactionDescriptionField label="Fee" value={fee} />}
          {date && (
            <TransactionDescriptionField
              className="pt-3 border-t border-input"
              label="Date & Time"
              value={date}
            />
          )}
          {reference && (
            <TransactionDescriptionField label="Reference" value={reference} />
          )}
        </div>
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onDone}>
            Done
          </Button>
          <button
            onClick={onAddMore}
            className="w-full text-sm text-Green hover:underline transition-colors py-1"
          >
            View Transaction History
          </button>
        </div>
      </div>
    </Modal>
  );
}
