import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";

export function SuccessStep({
  onDone,
  onAddAnother,
}: {
  onDone: () => void;
  onAddAnother: () => void;
}) {
  return (
    <Modal onClose={onDone} className="text-center pb-0">
      <div className="flex justify-end pt-6">
        <CloseBtn onClose={onDone} />
      </div>
 
      <div className="flex flex-col items-center gap-5 pb-10">
        {/* Success icon */}
        <Image src={"/badge 2.svg"} alt="badge" width={60} height={60} unoptimized />
 
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