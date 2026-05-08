import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoinAvatar } from "../Wallet-Page/coin-avatar";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { ModalHeader } from "@/components/ui/modal-header";
import { UseGetCryptoWallet } from "@/lib/services/wallet.service";
import { getCurrencyHeader, UserWallet } from "../Wallet-Page/types";

export function SelectAssetStep({
  selectedId,
  onSelect,
  onClose,
  onNext,
}: {
  selectedId?: UserWallet | null;
  onSelect: (asset: UserWallet) => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, error, isPending, isError } = UseGetCryptoWallet();
  const wallets = data?.data?.data || [];
  const filtered = wallets.filter(
    (a: UserWallet) =>
      a.currency.toLowerCase().includes(search.toLowerCase())
      // a.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8 max-sm:px-6"
        title="Send Crypto"
        subtitle="Transfer assets to external wallets or XBanka users."
        onBack={onClose}
        onClose={onClose}
      />
      <div className="px-8 pb-3 max-sm:px-6">
        <ProgressBar step="select_asset" />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-8 max-sm:px-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-placeholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset"
              className="w-full h-10 pl-9 pr-4 text-sm border border-input rounded-xl bg-transparent text-card-text placeholder:text-placeholder outline-none focus:border-border-active transition-colors"
            />
          </div>

          {/* Asset list */}
          <div className="space-y-4">
            {filtered.map((asset: UserWallet) => {
              const active = selectedId?.id === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors max-sm:gap-2 max-sm:p-3",
                    active
                      ? "border-Green bg-Green/5"
                      : "border-border hover:border-border-active",
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:gap-2">
                    <CoinAvatar
                      symbol={asset.currency}
                      size={40}
                    />
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="min-w-0 flex-1 border-r border-input pr-6 max-sm:pr-2">
                        <div className="flex min-w-0 items-center gap-3 max-sm:gap-2">
                          <p className="truncate text-sm font-medium leading-5 text-card-text max-sm:text-[13px]">
                            {getCurrencyHeader(asset.currency)}
                          </p>
                          <span className="shrink-0 text-[10px] font-semibold px-2 rounded border border-input bg-background text-text max-sm:px-1.5">
                            {asset.currency}
                          </span>
                        </div>
                        {/* <p className="text-xs text-text mt-0.5">
                          {asset.wallet}
                        </p> */}
                      </div>
                      <div className="min-w-[82px] shrink-0 px-6 text-left max-sm:min-w-[64px] max-sm:px-2">
                        <p className="truncate text-sm font-semibold text-card-text max-sm:text-[13px]">
                          {asset.balance} {asset.currency}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-text max-sm:text-[11px]">
                          ₦{asset.fiatEquivalent?.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Radio */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                      active ? "border-Green" : "border-text",
                    )}
                  >
                    {active && (
                      <div className="w-2.5 h-2.5 rounded-full bg-Green" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            Back
          </Button>
          <Button disabled={!selectedId} variant={selectedId ? "default" : "disabled"} size="lg" className="flex-3" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
