import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, Info, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { UserWallet } from "../Wallet-Page/types";
import { RecipientXbankaUsersTypes } from "./types";
import { TRANSACTION_FEE } from "./crypto-modal-types";

export function EnterAmountStep({
  asset,
  network,
  amount,
  setAmount,
  onBack,
  onClose,
  onNext
}: {
  asset?: UserWallet | null;
  network: string | null;
  amount: string;
  setAmount: (v: string) => void;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const numericBalance = asset?.balance ?? 0;
  const inputAmount = parseFloat(amount) || 0;
  const rate = asset?.fiatEquivalent?.rate ?? 0;
  const nairaEquiv = (inputAmount * rate).toLocaleString();
  const totalDeduction = inputAmount + TRANSACTION_FEE;
  const isValid = inputAmount > 0 && totalDeduction <= numericBalance;

  const sendMax = () => {
    const max = Math.max(0, numericBalance - TRANSACTION_FEE).toFixed(2);
    setAmount(max);
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8 "
        title="Send Crypto"
        subtitle="Transfer assets to external wallets or XBanka users."
        onBack={onBack}
        onClose={onClose}
      />
      <div className="px-8 pb-3">
        <ProgressBar step="enter_amount" />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-8">
        {/* Big amount display */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent text-4xl font-bold text-card-text outline-none text-center w-48 placeholder:text-text/30"
            />
            <span className="text-xl font-semibold text-text">
              {asset?.currency}
            </span>
          </div>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1 text-xs font-normal text-text px-3 py-1.5 bg-input-background rounded-lg">
              ≈ ₦{nairaEquiv}
            </span>
          </div>
        </div>

        <div className="border border-input bg-border rounded-[20px] p-2">
          {/* Balance row */}
          <div className="flex items-center justify-between border-b border-input p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-Green/10 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-Green" />
              </div>
              <div>
                <p className="text-[12px] font-normal leading-5.5 text-text">
                  Available balance
                </p>
                <p className="text-sm font-medium leading-5 text-card-text">
                  {asset?.balance} {asset?.currency}
                </p>
              </div>
            </div>
            <button
              onClick={sendMax}
              className="text-sm font-medium leading-5.5 text-Green hover:underline transition-colors"
            >
              Send max
            </button>
          </div>

          {/* Network fee */}
          <div className="flex items-center justify-between text-xs p-3">
            <div className="flex items-center gap-2 text-text">
              <span className="text-[12px] font-normal leading-5.5">
                Network fee
              </span>
              <Info className="w-4 h-4" />
            </div>
            <span className="text-card-text font-medium text-sm leading-5">
              ~{TRANSACTION_FEE} {asset?.currency}
            </span>
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-text">
          <AlertTriangle className="w-4 h-4 text-text shrink-0" />
          <span className="text-[12px] font-normal leading-4.5">
            Secure end-to-end encryption
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            size="lg"
            className="flex-3"
            disabled={!isValid}
            variant={isValid ? "default" : "disabled"}
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
