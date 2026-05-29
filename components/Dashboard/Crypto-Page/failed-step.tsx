import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { RefreshCcw, X } from "lucide-react";

export function FailedStep({
  mode,
  onClose,
  onRetry,
  errorMessage
}: {
  mode: "BUY" | "SELL";
  onClose: () => void;
  onRetry: () => void;
  errorMessage?: string;
}) {
  return (
    <Modal className="p-10 space-y-0 max-sm:p-6" onClose={onClose}>
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onClose} />
      </div>
 
      <div className="flex flex-col items-center gap-5 text-center space-y-6">
        {/* Error icon */}
        <div className="w-15 h-15 rounded-full bg-[#390201] border-4 border-error-border-button flex items-center justify-center">
          <X className="w-8 h-8 text-error-text" />
        </div>
 
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">
            {mode === "BUY" ? "Purchase" : "Sale"} failed
          </h3>
          <p className="text-sm font-normal leading-6 text-text">
            We couldn't complete your {mode === "BUY" ? "purchase" : "sale"}.<br />
            {errorMessage}
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
 