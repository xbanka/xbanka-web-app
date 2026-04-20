import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, X } from "lucide-react";

export function SuccessStep({
  amount, onDone, onAddMore,
}: {
  amount: string;
  onDone: () => void;
  onAddMore: () => void;
}) {
  return (
    <Modal onClose={onDone}>
      <button onClick={onDone}
        className="absolute top-5 right-6 w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="py-10 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full border-[3px] border-Green flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-Green" strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-card-text">₦{amount} Added Successfully</h3>
          <p className="text-sm text-text">Your wallet has been credited</p>
        </div>
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onDone}>View Wallet</Button>
          <button onClick={onAddMore} className="w-full text-sm text-Green hover:underline transition-colors py-1">
            Add more funds
          </button>
        </div>
      </div>
    </Modal>
  );
}