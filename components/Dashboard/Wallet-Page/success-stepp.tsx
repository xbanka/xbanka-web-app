import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle, CheckCircle, Copy, Info, X } from "lucide-react";
import { useState } from "react";
import { ASSETS } from "./wallet-mock-data";

export function SuccessStep({ amount, asset, network, txHash, onDone, onViewHistory }: {
  amount: string;
  asset: typeof ASSETS[0];
  network: { id: string; name: string; shortName: string; fee: string };
  txHash: string;
  onDone: () => void;
  onViewHistory: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const fee = parseFloat(network.fee);
  const total = (parseFloat(amount) + fee).toFixed(2);
  const nairaTotal = (parseFloat(total) * 1600).toLocaleString();
  const shortTx = `${txHash.slice(0, 5)}...${txHash.slice(-4)}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
 
  const copy = () => {
    navigator.clipboard.writeText(txHash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  return (
    <Modal onClose={onDone}>
      {/* Close button */}
      <button onClick={onDone}
        className="absolute top-5 right-6 w-7 h-7 rounded-lg flex items-center justify-center text-text hover:bg-border hover:text-card-text transition-colors">
        <X className="w-4 h-4" />
      </button>
 
      <div className="pt-10 pb-4 flex flex-col items-center gap-5 text-center">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-Green flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
 
        <div>
          <h3 className="text-xl font-bold text-card-text">
            {amount} {asset.symbol} Sent Successfully
          </h3>
          <p className="text-sm text-text mt-1">Your wallet has been credited</p>
        </div>
 
        {/* Transaction receipt */}
        <div className="w-full bg-background border border-border rounded-xl divide-y divide-border text-left">
          {/* Amount */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Amount</span>
            <span className="font-semibold text-card-text">{amount}.00 {asset.symbol}</span>
          </div>
          {/* Network fee */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Network</span>
            <span className="font-medium text-card-text">{network.fee} {asset.symbol}</span>
          </div>
          {/* Network label with info */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <div className="flex items-center gap-1.5 text-text">
              <span>Network</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-border text-card-text">
              {network.name}
            </span>
          </div>
          {/* Date & Time */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Date & Time</span>
            <span className="font-medium text-card-text">{dateStr} • {timeStr}</span>
          </div>
          {/* Transaction ID */}
          <div className="flex items-center justify-between px-4 py-3 text-xs">
            <span className="text-text">Transaction ID</span>
            <button onClick={copy} className="flex items-center gap-1.5 font-medium text-card-text hover:text-Green transition-colors">
              <span>{shortTx}</span>
              {copied
                ? <CheckCircle className="w-3.5 h-3.5 text-Green" />
                : <Copy className="w-3.5 h-3.5 text-text" />
              }
            </button>
          </div>
          {/* Total Deducted — highlighted row */}
          <div className="flex items-start justify-between px-4 py-3 bg-Green/5 rounded-b-xl">
            <span className="text-xs text-text">Total Deducted</span>
            <div className="text-right">
              <p className="text-sm font-bold text-Green">{total} {asset.symbol}</p>
              <p className="text-[10px] text-text mt-0.5">≈ ₦{nairaTotal}</p>
            </div>
          </div>
        </div>
 
        {/* Actions */}
        <div className="w-full space-y-3">
          <Button size="lg" className="w-full" onClick={onDone}>Done</Button>
          <button onClick={onViewHistory}
            className="w-full text-sm text-Green hover:underline transition-colors py-1">
            View Transaction History
          </button>
        </div>
 
        {/* Security note */}
        <div className="flex items-center gap-1.5 text-xs text-text">
          <AlertTriangle className="w-3 h-3 text-text shrink-0" />
          <span>Secured by Xbanka</span>
        </div>
      </div>
    </Modal>
  );
}