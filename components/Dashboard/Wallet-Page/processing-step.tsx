import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { LucideArrowLeftRight } from "lucide-react";

export function ProcessingStep({
  amount, sourceLabel, accountName,
}: {
  amount: string;
  sourceLabel: string;
  accountName: string;
}) {
  return (
    <Modal className="pt-6 space-y-6" onClose={() => {}}>
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner icon={LucideArrowLeftRight} size={52} />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text">Processing your request...</h3>
          <p className="text-base font-normal leading-6 text-text">This usually takes a few seconds. Please don't close this window</p>
        </div>
 
        {/* Transaction summary */}
        <div className="w-full bg-background border border-border rounded-xl p-4 space-y-3 text-left">
          <div className="flex justify-between text-xs">
            <span className="text-text">Amount</span>
            <span className="font-semibold text-Green">₦{amount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text">From</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
                {sourceLabel[0]}
              </div>
              <span className="font-medium text-card-text">{sourceLabel}</span>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text">Account name</span>
            <span className="font-medium text-card-text">{accountName}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}