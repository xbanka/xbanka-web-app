"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseTrustedWallets } from "@/lib/services/trusted-wallets.service";
import { whitelistSummary } from "@/lib/trusted-wallets";
import { AddWalletModal } from "./add-wallet-modal";

export const WHITELIST_HREF = "/account?tab=security&view=whitelist";

/** Wallet page, Crypto tab: where the customer's trusted wallets stand. */
export function WhitelistShortcut() {
  const [adding, setAdding] = useState(false);
  const { data, isPending, isError } = UseTrustedWallets();
  // Stay out of the way while loading, or if the list route is not deployed.
  if (isPending || isError) return null;
  const wallets = data ?? [];
  const empty = wallets.length === 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card-background p-5 sm:flex-row sm:items-center max-sm:p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal-border bg-teal-light">
        {empty ? (
          <Wallet className="h-5 w-5 text-Green" />
        ) : (
          <ShieldCheck className="h-5 w-5 text-Green" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-6 text-card-text">
          {empty ? "No wallets on your whitelist yet" : "Withdrawal whitelist"}
        </p>
        <p className="text-xs leading-5 text-text">
          {empty
            ? "Add a wallet you control to send crypto to it. You manage the list in Account, then Security, then Withdrawal whitelist."
            : `You can send crypto only to wallets on your whitelist. ${whitelistSummary(wallets)}`}
        </p>
      </div>
      {empty ? (
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> Add wallet
        </Button>
      ) : (
        <Button size="sm" variant="outline" asChild>
          <Link href={WHITELIST_HREF}>
            Manage whitelist <ArrowUpRight />
          </Link>
        </Button>
      )}
      {adding && <AddWalletModal onClose={() => setAdding(false)} />}
    </div>
  );
}
