"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { listFundedCryptoAddresses } from "@/lib/crypto-addresses";
import { maskAddress } from "@/lib/mask";
import { BankAccountSkeleton } from "./bank-account-skeleton";
import { CoinIcon } from "@/components/ui/coin-icon";

function AddressRow({
  currency,
  network,
  address,
}: {
  currency: string;
  network: string;
  address: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Wallet address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-input bg-border px-5 py-4 max-sm:px-4 max-sm:py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <CoinIcon currency={currency} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-medium leading-5 text-card-text">
            {currency}
            <span className="ml-2 text-xs font-normal text-text">{network}</span>
          </p>
          <p className="mt-0.5 truncate font-mono text-sm font-semibold tracking-wide text-card-text">
            {maskAddress(address)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${currency} ${network} wallet address`}
        className="shrink-0 rounded p-1 text-text transition-colors hover:bg-card-background hover:text-card-text"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-Green" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

/** Deposit addresses of the crypto wallets that hold a balance. No amounts. */
export function CryptoAddressesColumn() {
  const { data, isPending } = UseGetAllWalletBalances();
  const rows = listFundedCryptoAddresses(data?.data?.data);

  return (
    <div className="space-y-4 lg:pl-6">
      <div>
        <p className="font-medium text-sm leading-5 text-card-text">
          Crypto Wallet Addresses
        </p>
        <p className="font-normal text-xs leading-5 text-text mt-0.5">
          Addresses of the crypto wallets you hold a balance in
        </p>
      </div>

      {isPending && <BankAccountSkeleton />}

      {!isPending && rows.length === 0 && (
        <p className="py-10 text-center text-xs font-normal leading-5 text-text">
          No crypto wallet with a balance yet.
        </p>
      )}

      {!isPending && rows.length > 0 && (
        // Capped height so many addresses scroll inside the column instead of
        // stretching the page. Roughly four rows are visible.
        <div
          data-testid="crypto-address-list"
          className="max-h-80 space-y-3 overflow-y-auto pr-1 stagger"
        >
          {rows.map((row) => (
            <AddressRow key={row.id} {...row} />
          ))}
        </div>
      )}
    </div>
  );
}
