"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, MoreHorizontal, Plus, ShieldCheck, Wallet } from "lucide-react";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { Button } from "@/components/ui/button";
import { CoinIcon } from "@/components/ui/coin-icon";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UseTrustedWallets,
  UseTrustedWalletsSupported,
} from "@/lib/services/trusted-wallets.service";
import {
  DEFAULT_COOLING_OFF_HOURS,
  formatAddedDate,
  formatUnlockTime,
  isCoolingOff,
  networkName,
  readApiError,
  shortAddress,
  TrustedWallet,
  TrustedWalletsSupported,
} from "@/lib/trusted-wallets";
import { AddWalletModal } from "./add-wallet-modal";
import { WalletDetailModal } from "./wallet-detail-modal";
import { WalletStatusBadge } from "./shared";

function StatusCell({ wallet }: { wallet: TrustedWallet }) {
  return (
    <div className="space-y-1">
      <WalletStatusBadge status={wallet.status} />
      {isCoolingOff(wallet) && (
        <p className="text-xs text-text">
          Unlocks {formatUnlockTime(wallet.unlocksAt, { withYear: false })}
        </p>
      )}
    </div>
  );
}

function DestinationCell({ wallet }: { wallet: TrustedWallet }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CoinIcon currency={wallet.currency} size={36} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-5 text-card-text">
          {wallet.label}
        </p>
        <p className="truncate text-xs leading-5 text-text">
          {shortAddress(wallet.address)}
        </p>
      </div>
    </div>
  );
}

function TypeCell({
  wallet,
  supported,
}: {
  wallet: TrustedWallet;
  supported?: TrustedWalletsSupported;
}) {
  return (
    <div>
      <p className="text-sm leading-5 text-card-text">{wallet.currency}</p>
      <p className="text-xs leading-5 text-text">
        {networkName(wallet.network, supported)}
      </p>
    </div>
  );
}

export function WhitelistPage() {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isPending, isError, error } = UseTrustedWallets();
  const { data: supported } = UseTrustedWalletsSupported();
  const wallets = data ?? [];
  // Looked up by id so a rename shows as soon as the list refetches.
  const open = wallets.find((w) => w.id === openId) ?? null;
  const coolingHours = supported?.coolingOffHours ?? DEFAULT_COOLING_OFF_HOURS;

  const columns = [
    {
      key: "label",
      header: "Destination",
      render: (w: TrustedWallet) => <DestinationCell wallet={w} />,
    },
    {
      key: "network",
      header: "Type",
      render: (w: TrustedWallet) => <TypeCell wallet={w} supported={supported} />,
    },
    {
      key: "createdAt",
      header: "Added",
      render: (w: TrustedWallet) => (
        <span className="text-sm text-card-text">
          {formatAddedDate(w.createdAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (w: TrustedWallet) => <StatusCell wallet={w} />,
    },
    {
      key: "actions",
      header: "",
      render: (w: TrustedWallet) => (
        <button
          type="button"
          aria-label={`Open ${w.label}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpenId(w.id);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-input text-text hover:text-card-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => router.push("/account?tab=security")}
          className="inline-flex items-center gap-1 text-sm text-Green hover:underline"
        >
          <ChevronLeft className="h-4 w-4" /> Security
        </button>
        <h2 className="text-2xl font-semibold leading-8 text-card-text">
          Withdrawal whitelist
        </h2>
        <p className="text-sm leading-6 text-text">
          Choose the crypto wallets you can send to. Anything not on this list
          is blocked.
        </p>
      </div>

      <DashboardCard className="flex items-center gap-4 space-y-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal-border bg-teal-light">
          <ShieldCheck className="h-5 w-5 text-Green" />
        </div>
        <div className="min-w-0">
          <p className="text-[16px] font-medium leading-6 text-card-text">
            Whitelist is on
          </p>
          <p className="text-sm leading-6 text-text">
            Crypto sends go only to the wallets below. Adding or removing one
            needs your PIN and 2FA code.
          </p>
        </div>
      </DashboardCard>

      <DashboardCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-[16px] font-medium leading-6 text-card-text">
              Trusted wallets
            </h3>
            {!isPending && !isError && (
              <span className="rounded-full border border-input bg-background px-2.5 py-0.5 text-xs text-text">
                {wallets.length} {wallets.length === 1 ? "wallet" : "wallets"}
              </span>
            )}
          </div>
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus /> Add wallet
          </Button>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-teal-border bg-teal-light px-4 py-3 text-xs leading-5 text-teal-text">
          <Info className="h-4 w-4 shrink-0" />
          New wallets wait {coolingHours} hours before first use. Adding or
          removing one needs your PIN and 2FA code.
        </div>

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-error-text">
            {readApiError(error).message}
          </p>
        ) : wallets.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-light">
              <Wallet className="h-5 w-5 text-Green" />
            </div>
            <p className="text-sm font-medium text-card-text">
              No wallets on your whitelist yet
            </p>
            <p className="max-w-sm text-xs leading-5 text-text">
              Add a wallet you control to send crypto to it.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden rounded-xl bg-border p-2 md:block">
              <DataTableLayout
                data={wallets}
                columns={columns}
                rowKey={(w) => w.id}
                itemsPerPage={20}
                onRowClick={(w) => setOpenId(w.id)}
              />
            </div>
            <div className="space-y-2 md:hidden">
              {wallets.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setOpenId(w.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-border p-3 text-left"
                >
                  <DestinationCell wallet={w} />
                  <div className="shrink-0 text-right">
                    <StatusCell wallet={w} />
                    <p className="mt-1 text-xs text-text">
                      {w.currency} · {networkName(w.network, supported)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </DashboardCard>

      {adding && <AddWalletModal onClose={() => setAdding(false)} />}
      {open && (
        <WalletDetailModal wallet={open} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
