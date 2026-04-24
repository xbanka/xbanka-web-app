import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ASSETS } from "../Wallet-Page/wallet-mock-data";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { UserWallet } from "../Wallet-Page/types";

export function EnterAmountStep({
  asset,
  network,
  amount,
  setAmount,
  onBack,
  onClose,
  onNext,
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
  // const fee = parseFloat(network.fee);
  const inputAmount = parseFloat(amount) || 0;
  const rate = asset?.fiatEquivalent?.rate ?? 0;
  const nairaEquiv = (inputAmount * rate).toLocaleString();
  const isValid = inputAmount > 0 && inputAmount <= numericBalance;

  const sendMax = () => {
    const max = Math.max(0, numericBalance).toFixed(2);
    setAmount(max);
  };

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
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
          <p className="text-xs text-text">≈ ₦{nairaEquiv}</p>
        </div>

        <div className="border border-input bg-border rounded-[20px] p-5">
          {/* Balance row */}
          <div className="flex items-center justify-between border-b border-input p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {asset?.currency[0]}
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
          {/* <div className="flex items-center justify-between text-xs p-3">
            <div className="flex items-center gap-2 text-text">
              <span className="text-[12px] font-normal leading-5.5">Network fee</span>
              <Info className="w-5 h-5" />
            </div>
            <span className="text-card-text font-medium text-sm leading-5">
              — {network.fee} {asset.symbol}
            </span>
          </div> */}
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
            // disabled={!isValid}
            // variant={isValid ? "default" : "disabled"}
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
