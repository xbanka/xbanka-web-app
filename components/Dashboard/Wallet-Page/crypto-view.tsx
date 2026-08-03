"use client";
import { TransactionHistory } from "./transaction-history";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import {
  UseGetCryptoWallet,
  useGetMarketPrices,
} from "@/lib/services/wallet.service";
import { getCurrencyHeader, UserWallet } from "./types";
import { CoinIcon } from "@/components/ui/coin-icon";
import { formatCryptoBalance, formatToTwoDecimals } from "@/lib/marketFormat";
import { CryptoMarketOverview } from "../Home-Page/types";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { useEffect } from "react";

export function CryptoView() {
  const { data, error, isPending, isError } = UseGetCryptoWallet();

  // The wallet endpoint carries no price movement, so pull 24h change from the
  // market feed and key it by symbol. A limit high enough to cover every listed
  // asset means a held coin is only missing here if it isn't quoted at all.
  const { data: marketPrices } = useGetMarketPrices(1, 100);

  const changeBySymbol = useMemo(() => {
    const items: CryptoMarketOverview[] = marketPrices?.data?.items ?? [];
    return new Map(
      items.map((item) => [item.symbol.toUpperCase(), item.changePercent24h]),
    );
  }, [marketPrices]);

  const wallets =
    data?.data?.data?.slice()?.sort((a: UserWallet, b: UserWallet) => {
      const aBalance = Number(a.balance);
      const bBalance = Number(b.balance);

      // Wallets with balance > 0 come first
      if (aBalance > 0 && bBalance === 0) return -1;
      if (aBalance === 0 && bBalance > 0) return 1;

      // Optional: sort non-zero balances descending
      return bBalance - aBalance;
    }) || [];

  useEffect(() => {
    if (window.location.hash === "#transactions") {
      document
        .getElementById("transactions")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const columns = [
    {
      key: "currency",
      header: "Assets",
      render: (item: UserWallet) => (
        <div className="flex items-center gap-2">
          <div className="bg-card-background h-8 w-8 rounded-full">
            <CoinIcon currency={item.currency} size={32} />
          </div>
          <div>
            <p className="font-normal text-sm leading-6 text-card-text">
              {getCurrencyHeader(item.currency)}
            </p>
            <p className="font-medium text-xs leading-5 text-text">
              {item.currency}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      render: (item: UserWallet) => (
        <span className="font-normal text-sm leading-6 text-card-text">
          {formatCryptoBalance(item.balance)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: UserWallet) => (
        <span className="font-normal text-sm leading-6 text-card-text">
          {item?.fiatEquivalent?.amount ?? "-"}
        </span>
      ),
    },
    {
      key: "change",
      header: "24h Change",
      render: (item: UserWallet) => {
        const change = changeBySymbol.get(item.currency?.toUpperCase());

        if (change === undefined) {
          return (
            <span className="font-normal text-sm leading-6 text-card-text">
              -
            </span>
          );
        }

        const isNegative = change < 0;

        return (
          <span
            className={`flex items-center gap-1 font-normal text-sm leading-6 ${
              isNegative ? "text-error-text" : "text-Green"
            }`}
          >
            {isNegative ? (
              <ArrowDownRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" />
            )}
            {formatToTwoDecimals(change)}%
          </span>
        );
      },
    },
    {
      key: "note",
      header: "Action",
      render: (item: UserWallet) => (
        <Link href={`/crypto?tab=buy&mode=buy&coin=${item.currency}`}>
          <span className="font-normal text-sm leading-6 text-Green">
            Trade
          </span>
        </Link>
      ),
    },
  ];
  return (
    <div className="space-y-4">
      {/* My Holdings */}
      <div className="bg-card-background border border-border rounded-2xl p-5 max-sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-card-text text-[16px] leading-6 max-sm:text-[16px] max-sm:leading-6">
            My Holdings
          </h3>
          <span className="border rounded-[36px] px-2 bg-background border-input text-xs text-text max-sm:px-3 max-sm:py-1 max-sm:text-[12px]">
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
          <div className="grid grid-cols-[minmax(0,1fr)_76px_72px] gap-2 border-b border-input px-4 py-3 text-[12px] font-medium leading-5 text-text">
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
                  <div className="min-w-0 flex items-center gap-2">
                    <div className="bg-card-background h-8 w-8 rounded-full">
                      <CoinIcon currency={wallet.currency} size={32} />
                    </div>
                    <div>
                      <p className="truncate text-[13px] font-medium leading-5 text-card-text">
                        {getCurrencyHeader(wallet.currency)}
                      </p>
                      <p className="truncate text-[12px] font-medium leading-5 text-text">
                        {wallet.currency}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="truncate text-[13px] font-medium leading-5 text-card-text">
                  {formatCryptoBalance(wallet.balance)}
                </p>
                <Link
                  href={`/crypto?tab=buy&mode=buy&coin=${wallet.currency}`}
                  className="text-right text-[13px] font-medium leading-5 text-Green"
                >
                  Trade
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div id="transactions">
        <TransactionHistory tableType="CRYPTO" />
      </div>
    </div>
  );
}
