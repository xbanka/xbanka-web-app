import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { RefreshCcw, XCircle } from "lucide-react";

export function FailedStep({
  mode,
  onClose,
  onRetry,
}: {
  mode: "BUY" | "SELL";
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <Modal className="pb-10 px-10 pt-6" onClose={onClose}>
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onClose} />
      </div>
 
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
 
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {mode === "BUY" ? "Purchase" : "Sale"} failed
          </h3>
          <p className="text-sm font-normal leading-6 text-text">
            We couldn't complete your {mode === "BUY" ? "purchase" : "sale"}.
            Your balance has not been affected.
          </p>
        </div>
 
        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="flex-3"
            onClick={onRetry}
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    </Modal>
  );
}
 