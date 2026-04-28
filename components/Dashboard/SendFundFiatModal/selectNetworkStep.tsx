import { Button } from "@/components/ui/button";
import { ModalHeader } from "@/components/ui/modal-header";
import { CoinAvatar } from "../Wallet-Page/coin-avatar";
import { Modal } from "@/components/ui/Modal";
import { ASSETS, NETWORKS } from "../Wallet-Page/wallet-mock-data";
import { cn } from "@/lib/utils";

export function SelectNetworkStep({ asset, selectedNetworkId, onNetworkChange, onBack, onClose, onNext }: {
  asset: typeof ASSETS[0];
  selectedNetworkId: string | null;
  onNetworkChange: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const networks = NETWORKS[asset.id] ?? [];
  return (
    <Modal onClose={onClose}>
      <ModalHeader onBack={onBack} onClose={onClose} step="select_network" />
 
      <div className="space-y-3 mt-4">
        {/* Chosen asset display */}
        <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-3">
          <CoinAvatar color={asset.color} symbol={asset.symbol} size={36} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-text">{asset.name}</p>
            <p className="text-xs text-text">{asset.balance} {asset.symbol}</p>
          </div>
        </div>
 
        <p className="text-xs font-medium text-card-text">Select Network</p>
 
        <div className="space-y-2">
          {networks.map((n) => {
            const active = selectedNetworkId === n.id;
            return (
              <button key={n.id} onClick={() => onNetworkChange(n.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                  active ? "border-Green bg-Green/5" : "border-border hover:border-border-active"
                )}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-card-text">{n.name}</p>
                  <p className="text-xs text-text mt-0.5">Fee ≈ {n.fee} {asset.symbol}</p>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  active ? "border-Green" : "border-text")}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-Green" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
 
      <div className="flex gap-3 mt-6">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>Back</Button>
        <Button size="lg" className="flex-1" disabled={!selectedNetworkId}
          variant={selectedNetworkId ? "default" : "disabled"} onClick={onNext}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}