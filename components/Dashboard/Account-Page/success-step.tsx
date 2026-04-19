import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, X } from "lucide-react";

export function SuccessStep({
  onDone,
  onAddAnother,
}: {
  onDone: () => void;
  onAddAnother: () => void;
}) {
  return (
    <Modal onClose={onDone} className="text-center">
      <button
        onClick={onDone}
        className="absolute top-5 right-6 w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
 
      <div className="flex flex-col items-center gap-5 py-10">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full border-[3px] border-Green flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-Green" strokeWidth={2.5} />
        </div>
 
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-card-text">Bank account added</h3>
          <p className="text-sm text-text">
            Your account is now linked and ready to use
          </p>
        </div>
 
        <div className="w-full space-y-3 mt-2">
          <Button size="lg" className="w-full" onClick={onDone}>
            Done
          </Button>
          <button
            onClick={onAddAnother}
            className="w-full text-sm text-Green hover:underline py-1 transition-colors"
          >
            Add another account
          </button>
        </div>
      </div>
    </Modal>
  );
}