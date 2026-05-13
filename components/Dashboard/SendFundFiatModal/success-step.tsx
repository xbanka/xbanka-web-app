import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";
import { TransactionDescriptionField } from "@/components/ui/transaction-description-field";

export function SuccessStep({
  amount,
  onDone,
  onAddMore,
  name,
  bank,
  fee,
  date,
  reference,
  message
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
  return (
    <Modal className="pt-6" onClose={onDone}>
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center space-y-6">
        <Image src={"/badge 2.svg"} alt="badge" width={60} height={60} />
        <div className="space-y-2">
          {/* <h3 className="text-2xl font-semibold leading-8 text-card-text">
            ₦{amount} Added Successfully
          </h3> */}
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {message}
          </h3>
          <p className="text-base font-normal leading-6 text-text">Your wallet has been credited</p>
        </div>
        <div className="space-y-3 rounded-[20px] bg-border p-4 w-full">
          { name && <TransactionDescriptionField label="Recipient" value={name} />}
          { bank && <TransactionDescriptionField label="Bank" value={bank} />}
          { amount && <TransactionDescriptionField label="Amount" value={amount} />}
          { fee && <TransactionDescriptionField label="Fee" value={fee} />}
          { date && <TransactionDescriptionField className="pt-3 border-t border-input" label="Date" value={date} />}
          { reference && <TransactionDescriptionField label="Reference" value={reference} />}
        </div>
        <div className="w-full space-y-3">
          {/* <Button size="lg" className="w-full" onClick={onDone}>
            Done
          </Button> */}
          <Button size="lg" className="w-full bg-none" onClick={onDone}>
            View Transaction History
          </Button>
          <button
            onClick={onAddMore}
            className="w-full text-sm text-Green hover:underline transition-colors py-1"
          >
            Add more funds
          </button>
        </div>
      </div>
    </Modal>
  );
}
