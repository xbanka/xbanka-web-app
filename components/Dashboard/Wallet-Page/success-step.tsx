import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";

export function SuccessStep({
  amount,
  onDone,
  onAddMore,
}: {
  amount: string;
  onDone: () => void;
  onAddMore: () => void;
}) {
  return (
    <Modal className="pt-6" onClose={onDone}>
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center space-y-6">
        <Image src={"/badge 2.svg"} alt="badge" width={60} height={60} />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            ₦{amount} Added Successfully
          </h3>
          <p className="text-base font-normal leading-6 text-text">Your wallet has been credited</p>
        </div>
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onDone}>
            View Wallet
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
