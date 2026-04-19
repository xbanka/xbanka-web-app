import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";

export function LinkingStep({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} className="text-center">
      <button
        onClick={onClose}
        className="absolute top-5 right-6 w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
 
      <div className="flex flex-col items-center gap-5 py-10">
        <Spinner size={64} />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-card-text">
            Linking your account
          </h3>
          <p className="text-sm text-text">
            This usually takes a few seconds. Please don't close this window
          </p>
        </div>
      </div>
    </Modal>
  );
}