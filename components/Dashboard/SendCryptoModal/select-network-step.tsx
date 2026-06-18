import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CRYPTO_NETWORKS } from "../Wallet-Page/wallet-mock-data";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { ModalHeader } from "@/components/ui/modal-header";
import { AlertTriangle, Search, Wallet } from "lucide-react";
import { useState } from "react";
import { UserWallet } from "../Wallet-Page/types";
import { UseActiveNetworksCrypto } from "@/lib/services/wallet.service";
import { ErrorLayout } from "@/components/ui/error-layout";
import { Skeleton } from "@/components/ui/skeleton";

// Standard token-label, chain name and (static) estimated arrival per network code.
const NETWORK_META: Record<
  string,
  { label: string; chain: string; time: string }
> = {
  ETH: { label: "ERC-20", chain: "Ethereum network", time: "3-5 mins" },
  TRX: { label: "TRC-20", chain: "Tron network", time: "1-3 mins" },
  BSC: { label: "BEP-20", chain: "BNB smart chain", time: "~3 mins" },
  SOL: { label: "Solana", chain: "Solana network", time: "~1 min" },
  MATIC: { label: "Polygon", chain: "Polygon network", time: "~2 mins" },
  BTC: { label: "Bitcoin", chain: "Bitcoin network", time: "10-30 mins" },
};

export function SelectNetworkStep({
  asset,
  selectedNetworkId,
  onNetworkChange,
  onBack,
  onClose,
  onNext,
}: {
  asset?: UserWallet | null;
  selectedNetworkId: string | null;
  onNetworkChange: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const [search, setSearch] = useState("");
  const { data, isPending, error } = UseActiveNetworksCrypto();

  const networks =
    asset?.currency && data?.data?.data?.[asset.currency]?.networks
      ? data.data.data[asset.currency].networks
      : [];
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
        <ProgressBar step="select_network" />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-8">
        <div className="space-y-4 mt-4">
          {/* Chosen asset display */}
          {/* <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-3">
            <CoinAvatar color={asset.color} symbol={asset.symbol} size={36} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-text">
                {asset.name}
              </p>
              <p className="text-xs text-text">
                {asset.balance} {asset.symbol}
              </p>
            </div>
          </div> */}
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
          <div className="space-y-4">
            {!isPending && networks.map((network: any) => {
              const active = selectedNetworkId === network.networkCode;
              const meta = NETWORK_META[network.networkCode] ?? {
                label: network.networkName,
                chain: network.networkCode,
                time: "",
              };
              return (
                <button
                  key={network.networkCode}
                  onClick={() => onNetworkChange(network.networkCode)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors",
                    active
                      ? "border-border-active bg-[#042F2E]"
                      : "border-border hover:border-border-active",
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                    <Wallet size={22} className="text-[#0C9A8E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-text">
                      {meta.label}
                    </p>
                    <p className="text-xs text-text mt-0.5 truncate">
                      {meta.chain}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-card-text">
                      ~{network.withdrawalFee} {asset?.currency}
                    </p>
                    {meta.time && (
                      <p className="text-xs text-text mt-0.5">{meta.time}</p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ml-1",
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
            {
              isPending && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-colors animate-pulse"
                    >
                      <Skeleton className="rounded-[360px] p-1.5 h-10 w-10 bg-border mx-auto" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-4 w-1/2 rounded mb-2" />
                        <Skeleton className="h-3 w-1/3 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
            {
              !isPending && error && (
                <ErrorLayout message={error.message} />
              )
            }
            {!isPending && !error && networks.length === 0 && (
              <p className="text-center text-sm text-text">No networks available for this asset.</p>
            )}
          </div>
        </div>

        <div className="bg-[#3E2E00] border border-[#A27D00] px-4 py-3 text-[#FEC84B] rounded-lg flex items-center gap-4">
          <AlertTriangle size={16} className="text-[#FEC84B]" />
          <p className="text-[#FEC84B] font-normal text-[12px] leading-4.5">
            Make sure the recipient's wallet supports this network. Sending to
            the wrong network may result in permanent loss of funds.
          </p>
        </div>

        <div className="flex gap-4">
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
            disabled={!selectedNetworkId}
            variant={selectedNetworkId ? "default" : "disabled"}
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
