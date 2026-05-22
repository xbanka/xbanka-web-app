import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { bankColor, bankInitials } from "@/lib/wallet-page";
import Image from "next/image";

export function SuccessStep({
  amount,
  sourceLabel,
  accountName,
  onDone,
  onAddMore,
}: {
  amount: string;
  sourceLabel?: string;
  accountName?: string;
  onDone: () => void;
  onAddMore: () => void;
}) {
  const sourceBankName = sourceLabel?.split(/\s+/)[0] || sourceLabel || "";

  return (
    <Modal
      className="pt-6 max-sm:px-5 max-sm:pt-5 max-sm:pb-6"
      onClose={onDone}
    >
      <div className="flex justify-end mb-2">
        <CloseBtn onClose={onDone} />
      </div>
      <div className="flex flex-col items-center gap-5 text-center space-y-6 max-sm:space-y-4 max-sm:gap-4">
        <Image src={"/badge 2.svg"} alt="badge" width={60} height={60} />
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
            ₦{amount} Added Successfully
          </h3>
          <p className="text-base font-normal leading-6 text-text max-sm:text-sm">
            Your wallet has been credited
          </p>
        </div>

        {(sourceLabel || accountName) && (
          <div className="w-full rounded-[20px] bg-border p-4 space-y-3 text-left max-sm:p-3.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-medium text-text">Amount</span>
              <span className="font-semibold text-Green">
                ₦{amount}.00
              </span>
            </div>
            {sourceLabel && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-text shrink-0">From</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0",
                      bankColor(sourceBankName),
                    )}
                  >
                    {bankInitials(sourceBankName).slice(0, 1)}
                  </div>
                  <span className="font-medium text-card-text truncate">
                    {sourceLabel}
                  </span>
                </div>
              </div>
            )}
            {accountName && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-text shrink-0">
                  Account name
                </span>
                <span className="font-medium text-card-text truncate">
                  {accountName}
                </span>
              </div>
            )}
          </div>
        )}

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
