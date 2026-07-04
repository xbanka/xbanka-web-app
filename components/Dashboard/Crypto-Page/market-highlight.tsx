"use client";

import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { getCoinImage } from "@/lib/coin-images";
import { formatPrice, formatToTwoDecimals } from "@/lib/marketFormat";
import { useGetMarketPrices } from "@/lib/services/wallet.service";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CryptoMarketOverview } from "../Home-Page/types";

type HighlightTab = "trending" | "new";
type MarketMode = "spot" | "futures";
type MarketPricesCache = {
  data?: {
    items?: CryptoMarketOverview[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const sortMarketItems = (
  items: CryptoMarketOverview[],
  tab: HighlightTab,
) => {
  const sorted = [...items];

  if (tab === "new") {
    return sorted.sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    );
  }

  return sorted.sort(
    (a, b) =>
      a.rank - b.rank ||
      Math.abs(b.changePercent24h) - Math.abs(a.changePercent24h),
  );
};

export function MarketHighlight() {
  const [tab, setTab] = useState<HighlightTab>("trending");
  const [mode, setMode] = useState<MarketMode>("spot");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const limit = 10;

  const {
    data: marketPrices,
    error: marketPricesError,
    isError: marketPricesIsError,
    isPending: marketPricesPending,
  } = useGetMarketPrices(page, limit);

  const marketItems = useMemo(
    () => sortMarketItems(marketPrices?.data?.items ?? [], tab),
    [marketPrices, tab],
  );

  const seeAllHref = `/market?tab=${mode}&filter=${
    tab === "new" ? "new" : "all"
  }`;

  useEffect(() => {
    const eventSource = new EventSource(
      "https://backend.xbankang.com/wallets/market-stream",
    );

    eventSource.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data) as Partial<CryptoMarketOverview>;
        const symbol = update.symbol?.toUpperCase();

        if (!symbol) return;

        queryClient.setQueriesData<MarketPricesCache>(
          { queryKey: ["market-prices"] },
          (oldData) => {
            if (!oldData?.data?.items) return oldData;

            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: oldData.data.items.map((item: CryptoMarketOverview) =>
                  item.symbol.toUpperCase() === symbol
                    ? { ...item, ...update }
                    : item,
                ),
              },
            };
          },
        );
      } catch (err) {
        console.error("Invalid SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  const columns = [
    {
      key: "symbol",
      header: "Assets",
      className: "w-[130px]",
      render: (item: CryptoMarketOverview) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-card-background">
            <Image
              src={getCoinImage(item.symbol)}
              alt={item.symbol}
              width={32}
              height={32}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-normal leading-6 text-card-text">
              {item.name}
            </p>
            <p className="text-xs font-medium leading-5 text-text">
              {item.symbol}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "priceUsd",
      header: "Price",
      className: "w-[70px]",
      render: (item: CryptoMarketOverview) => (
        <span className="font-400 text-sm leading-6 text-card-text">
          ${formatPrice(item.priceUsd)}
        </span>
      ),
    },
    {
      key: "changePercent24h",
      header: "24h Change",
      className: "w-[90px]",
      render: (item: CryptoMarketOverview) => {
        const isNegative = item.changePercent24h < 0;

        return (
          <div
            className={`flex items-center gap-1 font-medium ${
              isNegative ? "text-red-500" : "text-Green"
            }`}
          >
            {isNegative ? (
              <ArrowDownRight size={20} />
            ) : (
              <ArrowUpRight size={20} />
            )}
            <span>{formatToTwoDecimals(item.changePercent24h)}%</span>
          </div>
        );
      },
    },
    {
      key: "id",
      header: "Action",
      className: "w-[70px]",
      render: (item: CryptoMarketOverview) => (
        <Link
          href={`/crypto?tab=buy&mode=buy&coin=${encodeURIComponent(
            item.symbol,
          )}`}
          className="text-sm font-normal leading-6 text-Green hover:underline"
        >
          Trade
        </Link>
      ),
    },
  ];

  return (
    <DashboardCard className="lg:col-span-2 p-4 max-sm:p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-text">
          Market Highlight
        </h3>
        <Link href={seeAllHref} className="text-xs text-Green hover:underline">
          See all
        </Link>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1">
          {(["trending", "new"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              aria-pressed={tab === t}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-Green/10 text-Green"
                  : "text-text hover:text-card-text"
              }`}
            >
              {t === "trending" ? "Trending" : "Newly Listed"}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(["spot", "futures"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setPage(1);
              }}
              aria-pressed={mode === m}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-border text-card-text"
                  : "text-text hover:text-card-text"
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTableLayout
          data={marketItems}
          columns={columns}
          isError={marketPricesIsError}
          isLoading={marketPricesPending}
          errorMessage={marketPricesError?.message}
          rowKey={(item) => item.id}
          itemsPerPage={limit}
          pageTotal={marketPrices?.data?.meta.totalPages}
          currentPage={page}
          onPageChange={setPage}
          emptyMessage="No market data available."
        />
      </div>
    </DashboardCard>
  );
}
