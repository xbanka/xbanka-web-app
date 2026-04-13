"use client";
import { HOLDINGS } from "@/lib/MockData";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TransactionHistory } from "./transaction-history";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { UseGetCryptoWallet } from "@/lib/services/wallet.service";
import { getCurrencyHeader, UserWallet } from "./types";

export function CryptoView() {
  const { data, error, isPending, isError } = UseGetCryptoWallet();
  const wallets = data?.data?.data || [];

  const columns = [
    {
      key: "currency",
      header: "Assets",
      render: (item: UserWallet) => <div>
        <p className="font-normal text-sm leading-6 text-card-text">{getCurrencyHeader(item.currency)}</p>
        <p className="font-medium text-xs leading-5 text-text">{item.currency}</p>
        </div>,
    },
    {
      key: "balance",
      header: "Balance",
      render: (item: UserWallet) => <span className="font-normal text-sm leading-6 text-card-text">{item.balance}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: UserWallet) => <span className="font-normal text-sm leading-6 text-card-text">{item?.fiatEquivalent?.amount ?? "-"}</span>,
    },
    {
      key: "chznge",
      header: "24h Change",
      render: (item: UserWallet) => (
        <span className="font-normal text-sm leading-6 text-card-text"> - </span>
      ),
    },
    {
      key: "note",
      header: "Action",
      render: (item: UserWallet) => <span className="font-normal text-sm leading-6 text-Green">Trade</span>,
    },
  ];
  return (
    <div className="space-y-4">
      {/* My Holdings */}
      <div className="bg-card-background border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-text text-[16px] leading-6">My Holdings</h3>
          <span className="border rounded-[36px] px-2 bg-background border-input text-xs text-text">{wallets.length} Assets</span>
        </div>
        <div className="overflow-x-auto">
          <DataTableLayout
            data={wallets}
            columns={columns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(item) => item.id}
            itemsPerPage={10}
            emptyMessage="No holdings available."
          />
        </div>
      </div>

      <TransactionHistory tableType="CRYPTO" isCrypto />
    </div>
  );
}
