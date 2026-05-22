import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseGetCryptoWallet } from "@/lib/services/wallet.service";
import { getCurrencyHeader, UserWallet } from "../Wallet-Page/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorLayout } from "@/components/ui/error-layout";
import { CoinAvatar } from "../Wallet-Page/coin-avatar";

const formatNaira = (amount?: number) =>
  typeof amount === "number"
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(amount)
    : "₦0.00";

const walletLabel = (index: number) => {
  const labels = ["Primary wallet", "Trading wallet", "Savings wallet"];
  return labels[index % labels.length];
};

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
  const wallets =
    data?.data?.data?.filter(
      (wallet: UserWallet) => Number(wallet.balance) > 0,
    ) || [];
  const filtered = wallets.filter(
    (asset: UserWallet) =>
      asset.currency.toLowerCase().includes(search.toLowerCase()) ||
      getCurrencyHeader(asset.currency)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <Modal
      backdropClassName="items-end p-0 sm:items-center sm:p-4"
      className="send-crypto-sheet max-w-[560px] rounded-[24px] border-[6px] border-[#26282D] bg-card-background p-0 shadow-2xl max-sm:flex max-sm:max-h-[76vh] max-sm:max-w-[360px] max-sm:flex-col max-sm:overflow-hidden max-sm:rounded-[24px] max-sm:border-[6px]"
      onClose={onClose}
    >
      <div className="flex max-h-[86vh] flex-col px-6 pb-6 pt-6 max-sm:h-[76vh] max-sm:px-4 max-sm:pb-4 max-sm:pt-4">
        <div className="mb-6 flex shrink-0 items-start justify-between gap-5 max-sm:mb-4 max-sm:gap-3">
          <div className="min-w-0">
            <h3 className="text-[24px] font-semibold leading-8 text-card-text max-sm:text-[22px] max-sm:leading-7">
              Send Crypto
            </h3>
            <p className="mt-2 max-w-[360px] text-[16px] font-normal leading-7 text-text max-sm:text-[13px] max-sm:leading-5">
              Transfer assets to external wallets or XBanka users.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-input bg-border text-text transition-colors hover:border-border-active hover:text-card-text max-sm:h-10 max-sm:w-10"
            aria-label="Close send crypto"
          >
            <X className="h-7 w-7 max-sm:h-5 max-sm:w-5" />
          </button>
        </div>

        <div className="relative mb-5 shrink-0 max-sm:mb-4">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-placeholder max-sm:left-4 max-sm:h-4 max-sm:w-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset"
            className="h-[52px] w-full rounded-xl border-2 border-input bg-transparent pl-[52px] pr-5 text-[16px] text-card-text outline-none transition-colors placeholder:text-placeholder focus:border-border-active max-sm:h-11 max-sm:pl-11 max-sm:text-[13px]"
          />
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 max-sm:space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isPending &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_28px] items-center gap-4 rounded-xl border-2 border-input px-5 py-4 max-sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_22px] max-sm:gap-2 max-sm:px-3 max-sm:py-3"
              >
                <div className="flex min-w-0 items-center gap-4 border-r-2 border-input pr-4 max-sm:gap-2 max-sm:pr-2">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-border max-sm:h-8 max-sm:w-8" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded bg-border max-sm:w-20" />
                    <Skeleton className="h-3 w-20 rounded bg-border max-sm:w-16" />
                  </div>
                </div>
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-4 w-24 rounded bg-border max-sm:w-16" />
                  <Skeleton className="h-3 w-20 rounded bg-border max-sm:w-14" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full bg-border max-sm:h-5 max-sm:w-5" />
              </div>
            ))}

          {isError && <ErrorLayout message={error?.message} />}

          {!isPending && !isError && filtered.length === 0 && (
            <div className="py-8 text-center text-text">
              No crypto assets found.
            </div>
          )}

          {!isPending &&
            !isError &&
            filtered.map((asset: UserWallet, index: number) => {
              const active = selectedId?.id === asset.id;
              return (
                <button
                  key={asset.id}
                  onClick={() => onSelect(asset)}
                  className={cn(
                    "grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_28px] items-center gap-4 rounded-xl border-2 p-3 text-left transition-colors max-sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_22px] max-sm:gap-2 max-sm:px-3 max-sm:py-3",
                    active
                      ? "border-Green bg-[#06362F]"
                      : "border-input bg-transparent hover:border-border-active",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-4 border-r-2 border-input pr-4 max-sm:gap-2 max-sm:pr-2">
                    <CoinAvatar currency={asset.currency} size={40} />
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-3 max-sm:gap-1.5">
                        <p className="truncate text-[16px] font-semibold leading-6 text-card-text max-sm:text-[13px] max-sm:leading-5">
                          {getCurrencyHeader(asset.currency)}
                        </p>
                        <span className="shrink-0 rounded-md border-2 border-input bg-background px-2 py-0.5 text-[13px] font-medium leading-5 text-text max-sm:px-1.5 max-sm:py-0 max-sm:text-[11px]">
                          {asset.currency}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[14px] font-normal leading-5 text-text max-sm:mt-0.5 max-sm:text-[12px] max-sm:leading-4">
                        {walletLabel(index)}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-semibold leading-6 text-card-text max-sm:text-[13px] max-sm:leading-5">
                      {asset.balance} {asset.currency}
                    </p>
                    <p className="mt-1 truncate text-[14px] font-normal leading-5 text-text max-sm:mt-0.5 max-sm:text-[12px] max-sm:leading-4">
                      {formatNaira(asset.fiatEquivalent?.amount)}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 max-sm:h-5 max-sm:w-5",
                        active ? "border-Green" : "border-text",
                      )}
                    >
                      {active && (
                        <div className="h-3 w-3 rounded-full bg-Green max-sm:h-2.5 max-sm:w-2.5" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>

        <div className="mt-6 grid shrink-0 grid-cols-[0.95fr_1.55fr] gap-5 max-sm:mt-4 max-sm:grid-cols-[0.9fr_1.35fr] max-sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-14 rounded-xl border-2 border-input bg-transparent text-[16px] font-semibold text-card-text hover:bg-border/50 max-sm:h-11 max-sm:text-[14px]"
            onClick={onClose}
          >
            Back
          </Button>
          <Button
            disabled={!selectedId}
            variant={selectedId ? "default" : "disabled"}
            size="lg"
            className="h-14 rounded-xl border-2 border-abstract-green bg-Green text-[16px] font-semibold text-white hover:bg-Green/90 disabled:border-border max-sm:h-11 max-sm:text-[14px]"
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
