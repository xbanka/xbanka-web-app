import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { Link, X } from "lucide-react";

export function LinkingStep({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} className="text-center pb-0">
      <div className="flex justify-end pt-6">
        <CloseBtn onClose={onClose} />
      </div>

      <div className="flex flex-col items-center gap-5 pb-10">
        <Spinner icon={Link} size={64} />
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
