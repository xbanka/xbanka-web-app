"use client";
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
      render: () => (
        <span className="font-normal text-sm leading-6 text-card-text"> - </span>
      ),
    },
    {
      key: "note",
      header: "Action",
      render: () => <span className="font-normal text-sm leading-6 text-Green">Trade</span>,
    },
  ];
  return (
    <div className="space-y-4">
      {/* My Holdings */}
      <div className="bg-card-background border border-border rounded-2xl p-5 max-sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-text text-[16px] leading-6 max-sm:text-[20px] max-sm:leading-8">
            My Holdings
          </h3>
          <span className="border rounded-[36px] px-2 bg-background border-input text-xs text-text max-sm:px-4 max-sm:py-1 max-sm:text-[16px]">
            {wallets.length} Assets
          </span>
        </div>
        <div className="hidden overflow-x-auto md:block">
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
        <div className="rounded-2xl bg-border p-4 md:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_76px_72px] gap-2 border-b border-input px-4 py-3 text-[16px] font-medium leading-6 text-text">
            <span>Assets</span>
            <span>Balance</span>
            <span className="text-right">Action</span>
          </div>

          {isPending && (
            <div className="py-8 text-center text-text">Loading...</div>
          )}
          {isError && (
            <div className="py-8 text-center text-error-text">
              {error?.message}
            </div>
          )}
          {!isPending && !isError && wallets.length === 0 && (
            <div className="py-8 text-center text-text">
              No holdings available.
            </div>
          )}
          {!isPending &&
            !isError &&
            wallets.map((wallet: UserWallet) => (
              <div
                key={wallet.id}
                className="grid grid-cols-[minmax(0,1fr)_76px_72px] items-center gap-2 border-b border-input px-4 py-4 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-card-background" />
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-medium leading-6 text-card-text">
                      {getCurrencyHeader(wallet.currency)}
                    </p>
                    <p className="truncate text-[15px] font-medium leading-6 text-text">
                      {wallet.currency}
                    </p>
                  </div>
                </div>
                <p className="text-[17px] font-medium leading-6 text-card-text">
                  {wallet.balance ?? "0.00"}
                </p>
                <button className="text-right text-[17px] font-medium leading-6 text-Green">
                  Trade
                </button>
              </div>
            ))}
        </div>
      </div>

      <TransactionHistory tableType="CRYPTO" isCrypto />
    </div>
  );
}
