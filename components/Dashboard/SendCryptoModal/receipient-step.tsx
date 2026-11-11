import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinIcon } from "@/components/ui/coin-icon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Plus, Search, Wallet } from "lucide-react";
import { ProgressBar } from "../Wallet-Page/progress-bar";
import { ModalHeader } from "@/components/ui/modal-header";
import { RecipientXbankaUsersTypes, XbankaUser } from "./types";
import { UseGetActiveXbankaUsers } from "@/lib/services/send-fiat.service";
import {
  UseTrustedWallets,
  UseTrustedWalletsSupported,
} from "@/lib/services/trusted-wallets.service";
import { xbankaUserName } from "@/lib/xbankaUserName";
import {
  canSendTo,
  formatUnlockTime,
  isCoolingOff,
  networkName,
  readApiError,
  shortAddress,
  TrustedWallet,
  walletsForCurrency,
} from "@/lib/trusted-wallets";
import { WalletStatusBadge } from "../TrustedWallets/shared";
import { AddWalletModal } from "../TrustedWallets/add-wallet-modal";
import { CoolingOffModal } from "../TrustedWallets/cooling-off-modal";
import { StateIcon } from "../TrustedWallets/shared";

type RecipientTab = "saved" | "xbanka";

// Crypto leaves XBanka only to a saved (trusted) wallet. The free address
// field is gone: once the backend turns on ENFORCE_TRUSTED_WALLETS a send
// without trustedWalletId is refused. XBanka-to-XBanka sends are internal and
// stay as they were.
export function RecipientStep({
  currency,
  selectedWalletId,
  onBack,
  onClose,
  onNext,
}: {
  currency?: string;
  selectedWalletId?: string | null;
  onBack: () => void;
  onClose: () => void;
  onNext: (data: {
    type: "trusted-wallet" | "xbanka-user";
    wallet?: TrustedWallet;
    name?: string;
    user?: RecipientXbankaUsersTypes;
  }) => void;
}) {
  const [tab, setTab] = useState<RecipientTab>("saved");
  const [selectedId, setSelectedId] = useState(selectedWalletId ?? null);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [cooling, setCooling] = useState<TrustedWallet | null>(null);

  const { data: users } = UseGetActiveXbankaUsers();
  const trusted = UseTrustedWallets();
  const { data: supported } = UseTrustedWalletsSupported();

  const wallets = walletsForCurrency(trusted.data ?? [], currency);
  const selected = wallets.find((w) => w.id === selectedId && canSendTo(w));

  const query = search.toLowerCase().trim();
  const filteredUsers: XbankaUser[] = query
    ? (users?.data ?? []).filter(
        (user: XbankaUser) =>
          user.xbId?.toLowerCase()?.includes(query) ||
          user.profile?.firstName?.toLowerCase()?.includes(query) ||
          user.profile?.lastName?.toLowerCase()?.includes(query) ||
          user.email?.toLowerCase()?.includes(query),
      )
    : [];

  if (adding)
    return (
      <AddWalletModal
        initialCurrency={currency}
        onClose={() => setAdding(false)}
      />
    );
  if (cooling)
    return (
      <CoolingOffModal
        label={cooling.label}
        unlocksAt={cooling.unlocksAt}
        onClose={() => setCooling(null)}
      />
    );

  const noWallets =
    tab === "saved" &&
    !trusted.isPending &&
    !trusted.isError &&
    wallets.length === 0;

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8"
        title="Send Crypto"
        subtitle="Send to a wallet you've registered."
        onBack={onBack}
        onClose={onClose}
      />
      <div className="px-8 pb-3">
        <ProgressBar step="recipient" skipNetwork={tab === "saved"} />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-6">
        <div className="flex gap-1 border-b border-border" role="tablist">
          {(
            [
              ["saved", "Saved wallets"],
              ["xbanka", "XBanka user"],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "pb-2 px-3 text-xs font-medium border-b-2 transition-colors -mb-px",
                tab === id
                  ? "border-Green text-Green"
                  : "border-transparent text-text hover:text-card-text",
              )}
            >
              {text}
            </button>
          ))}
        </div>

        {tab === "saved" && noWallets && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <StateIcon tone="info">
              <Wallet className="h-6 w-6" />
            </StateIcon>
            <h4 className="text-lg font-semibold text-card-text">
              {currency
                ? `Add a ${currency} wallet to send ${currency}`
                : "Add a wallet to send crypto"}
            </h4>
            <p className="text-sm text-text">
              You can only send to wallets you&apos;ve registered.
            </p>
          </div>
        )}

        {tab === "saved" && !noWallets && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-card-text">Send to</span>
              {currency && (
                <span className="text-text">
                  Showing wallets that support {currency}
                </span>
              )}
            </div>
            {trusted.isPending &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            {trusted.isError && (
              <div className="space-y-2 py-4 text-center">
                <p className="text-sm text-error-text">
                  {readApiError(trusted.error).message}
                </p>
                <button
                  type="button"
                  onClick={() => trusted.refetch()}
                  className="text-xs font-medium text-Green hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
            <div
              role="radiogroup"
              aria-label="Saved wallets"
              className="max-h-[260px] space-y-3 overflow-y-auto"
            >
              {wallets.map((w) => {
                const usable = canSendTo(w);
                const active = usable && selectedId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-disabled={!usable}
                    onClick={() =>
                      usable
                        ? setSelectedId(w.id)
                        : isCoolingOff(w) && setCooling(w)
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-border-active bg-teal-light"
                        : "border-border",
                      usable ? "hover:border-border-active" : "opacity-60",
                    )}
                  >
                    <CoinIcon currency={w.currency} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-card-text">
                        {w.label}
                      </p>
                      <p className="truncate text-xs text-text">
                        {networkName(w.network, supported)} ·{" "}
                        {shortAddress(w.address)}
                      </p>
                    </div>
                    {usable ? (
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                          active ? "border-Green" : "border-text",
                        )}
                      >
                        {active && (
                          <div className="h-2.5 w-2.5 rounded-full bg-Green" />
                        )}
                      </div>
                    ) : (
                      <div className="shrink-0 space-y-1 text-right">
                        <WalletStatusBadge status={w.status} />
                        {isCoolingOff(w) && (
                          <p className="text-[11px] text-text">
                            Available from{" "}
                            {formatUnlockTime(w.unlocksAt, { withYear: false })}
                          </p>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-Green hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Add a wallet
            </button>
          </div>
        )}

        {tab === "xbanka" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or XBanka ID"
                className="h-10 w-full rounded-xl border border-input bg-transparent pl-9 pr-4 text-base text-card-text outline-none transition-colors placeholder:text-placeholder focus:border-border-active md:text-sm"
              />
            </div>
            <div className="max-h-[200px] space-y-2 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() =>
                    onNext({
                      type: "xbanka-user",
                      user: {
                        id: user.id,
                        name: xbankaUserName(user),
                        uid: user.xbId,
                      },
                      name: xbankaUserName(user),
                    })
                  }
                  className="w-full rounded-xl p-3 text-left transition-colors hover:bg-background"
                >
                  <p className="text-sm font-medium text-card-text">
                    {xbankaUserName(user)}
                  </p>
                  <p className="text-xs text-text">{user.xbId}</p>
                </button>
              ))}
              {query && filteredUsers.length === 0 && (
                <p className="py-2 text-center text-sm text-text">
                  No XBanka users match your search.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={noWallets ? onClose : onBack}
          >
            {noWallets ? "Cancel" : "Back"}
          </Button>
          {noWallets ? (
            <Button size="lg" className="flex-3" onClick={() => setAdding(true)}>
              Add a wallet
            </Button>
          ) : (
            <Button
              size="lg"
              className="flex-3"
              disabled={tab !== "saved" || !selected}
              variant={tab === "saved" && selected ? "default" : "disabled"}
              onClick={() =>
                selected &&
                onNext({ type: "trusted-wallet", wallet: selected, name: selected.label })
              }
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
