"use client";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { useGetMarketPrices } from "@/lib/services/wallet.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CryptoMarketOverview } from "./types";
import { formatPrice, formatToTwoDecimals } from "@/lib/marketFormat";
import { getCoinImage } from "@/lib/coin-images";
import Image from "next/image";

const MARKET_TABS = [
  "Favourites",
  "Hot",
  "Gainers",
  "Losers",
  "New",
  "Turnovers",
] as const;

type MarketTab = (typeof MARKET_TABS)[number];

const sortByTab = (
  items: CryptoMarketOverview[],
  tab: MarketTab,
): CryptoMarketOverview[] => {
  const sorted = [...items];
  switch (tab) {
    case "Hot":
      return sorted.sort((a, b) => a.rank - b.rank);
    case "Gainers":
      return sorted.sort((a, b) => b.changePercent24h - a.changePercent24h);
    case "Losers":
      return sorted.sort((a, b) => a.changePercent24h - b.changePercent24h);
    case "New":
      return sorted.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    case "Turnovers":
      return sorted.sort((a, b) => b.priceUsd - a.priceUsd);
    case "Favourites":
    default:
      return sorted;
  }
};

export function MarketOverview() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<MarketTab>("Favourites");
  const [marketType, setMarketType] = useState<"Spot" | "Futures">("Spot");
  const limit = 6;
  const {
    data: marketPrices,
    error: marketPricesError,
    isError: marketPricesIsError,
    isPending: marketPricesPending,
  } = useGetMarketPrices(page, limit);
  const marketItems = sortByTab(
    marketPrices?.data.items ?? [],
    activeTab,
  ).slice(0, 6);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://backend.xbankang.com/wallets/market-stream",
    );

    eventSource.onopen = () => {
      console.log("SSE connected");
    };

    eventSource.onmessage = (event) => {
      console.log("NEW SSE MESSAGE", event.data);
      try {
        const update = JSON.parse(event.data);

        queryClient.setQueryData(
          ["market-prices", page, limit],
          (oldData: any) => {
            if (!oldData?.data?.items) return oldData;

            return {
              ...oldData,
              data: {
                ...oldData.data,
                items: oldData.data.items.map((item: any) =>
                  item.symbol === update.symbol ? { ...item, ...update } : item,
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
  }, [queryClient, page, limit]);

  const columns = [
    {
      key: "symbol",
      header: "Assets",
      // className: "w-[200px]",
      render: (item: CryptoMarketOverview) => (
        <div className="flex items-center gap-2 ">
          <div className="bg-card-background h-8 w-8 rounded-full">
            <Image
              src={getCoinImage(item.symbol)}
              alt={item.symbol}
              width={32}
              height={32}
            />
          </div>
          <div>
            <p className="font-normal text-[14px] leading-6 text-card-text">
              {item.name}
            </p>
            <p className="font-medium text-xs leading-5 text-text">
              {item.symbol}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "priceUsd",
      header: "Price",
      render: (item: CryptoMarketOverview) => (
        <span className="font-400 text-sm leading-6 text-card-text">
          ${formatPrice(item.priceUsd)}
        </span>
      ),
    },
    {
      key: "changePercent24h",
      header: "24h Change",
      render: (item: CryptoMarketOverview) => {
        const changeValue = item.changePercent24h;
        const isNegative = changeValue < 0;
        return (
          <div
            className={`flex items-center gap-1 font-medium ${isNegative ? "text-error-text" : "text-Green"}`}
          >
            <span>
              {isNegative ? (
                <ArrowDownRight size={20} />
              ) : (
                <ArrowUpRight size={20} />
              )}
            </span>
            <span>{formatToTwoDecimals(item.changePercent24h)}%</span>
          </div>
        );
      },
    },
    {
      key: "id",
      header: "Action",
      render: () => (
        <Link href={"/crypto"}><span  className="font-normal text-sm leading-6 text-Green">Trade</span></Link>
      ),
    },
  ];
  const totalPages = marketPrices?.data?.meta.totalPages ?? 1;
  const pageButtons: (number | string)[] =
    totalPages <= 6
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : page <= 3
        ? [1, 2, 3, 4, "...", totalPages]
        : page >= totalPages - 2
          ? [
              1,
              "...",
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [1, "...", page - 1, page, page + 1, "...", totalPages];
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="bg-card-background border border-border rounded-2xl p-5 flex flex-col max-sm:p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-semibold text-card-text max-sm:text-[18px] max-sm:leading-7">
          Market Overview
        </h3>
        <Link
          href="/crypto"
          className="flex shrink-0 items-center gap-2 text-xs font-medium text-Green hover:underline max-sm:text-[12px] max-sm:leading-6"
        >
          View more <ArrowUpRight className="h-4 w-4 max-sm:h-5 max-sm:w-5" />
        </Link>
      </div>
      <div className="mb-4 flex gap-1 overflow-x-auto text-xs max-sm:-mx-1 max-sm:px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-sm:text-[12px]  ">
        {MARKET_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            aria-pressed={activeTab === t}
            className={`whitespace-nowrap px-2 py-1 rounded-md transition-colors max-sm:text-[12px] max-sm:leading-6 ${activeTab === t ? "bg-Green/10 text-Green font-medium" : "text-text hover:text-card-text"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <DataTableLayout
          data={marketItems}
          columns={columns}
          isError={marketPricesIsError}
          isLoading={marketPricesPending}
          errorMessage={marketPricesError?.message}
          rowKey={(item) => item.id}
          // itemsPerPage={6}
          // pageTotal={marketPrices?.data?.meta.totalPages}
          // currentPage={page}
          // onPageChange={handlePageChange}
          emptyMessage="No transaction history available."
        />
      </div>
      <div className="rounded-2xl bg-border p-4 md:hidden">
        <div className="mb-3 flex rounded-2xl bg-card-background/40 p-1 text-[16px] max-sm:text-[12px] font-medium leading-6 text-text">
          {(["Spot", "Futures"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMarketType(type)}
              aria-pressed={marketType === type}
              className={`rounded-xl px-4 py-3 transition-colors ${marketType === type ? "bg-card-background text-card-text" : ""}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1fr)_auto] gap-1 border-b border-input px-1 py-3 text-[16px] max-sm:text-[12px] font-medium leading-6 max-sm:leading-[16px] text-text">
              <span>Assets</span>
              <span>Price</span>
              <span>24h Change</span>
              <span>Action</span>
            </div>

            {marketPricesPending && (
              <div className="py-8 text-center text-text">Loading...</div>
            )}
            {marketPricesIsError && (
              <div className="py-8 text-center text-error-text">
                {marketPricesError?.message}
              </div>
            )}
            {!marketPricesPending &&
              !marketPricesIsError &&
              marketItems.map((item: CryptoMarketOverview) => {
                const isNegative = item.changePercent24h < 0;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1fr)_auto] items-center gap-1 border-b border-input px-1 py-4 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-3 ">
                      <div className="h-11 w-11 shrink-0 rounded-full bg-card-background max-sm:w-[32px] max-sm:h-[32px]">
                        <Image
                          src={getCoinImage(item.symbol)}
                          alt={item.symbol}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[16px] max-sm:text-[12px] max-sm:leading-[20px] font-medium leading-6 text-card-text">
                          {item.name}
                        </p>
                        <p className="truncate text-[16px] max-sm:text-[12px] font-medium leading-6 text-text">
                          {item.symbol}
                        </p>
                      </div>
                    </div>
                    <p className="truncate text-[16px] font-medium leading-6 text-card-text max-sm:text-[12px]">
                      ${formatPrice(item.priceUsd)}
                    </p>
                    <div
                      className={`flex min-w-0 items-center gap-1 text-[16px] max-sm:text-[12px] font-medium leading-6 ${isNegative ? "text-error-text" : "text-Green  max-sm:text-[12px]"}`}
                    >
                      {isNegative ? (
                        <ArrowDownRight className="h-5 w-5 shrink-0 max-sm:h-4 max-sm:w-4" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 shrink-0 max-sm:h-4 max-sm:w-4" />
                      )}
                      <span className="truncate">
                        {formatToTwoDecimals(item.changePercent24h)}%
                      </span>
                    </div>
                    <Link
                      href="/crypto"
                      className="text-left text-[16px] max-sm:text-[12px] font-medium leading-6 text-Green"
                    >
                      Trade
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>

        {/* {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-input pt-4">
            <p className="shrink-0 text-[12px] font-medium leading-4 text-text">
              Page {page} of {totalPages}
            </p>
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex shrink-0 gap-1">
                {pageButtons.map((pageNumber, index) =>
                  typeof pageNumber === "string" ? (
                    <span
                      key={`${pageNumber}-${index}`}
                      className="flex h-8 w-8 items-center justify-center text-[12px] text-text"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-8 w-8 rounded-md text-[12px] font-normal leading-4 transition-colors ${
                        pageNumber === page
                          ? "bg-Green text-card-text"
                          : "bg-card-background text-text"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E3E3] text-card-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E3E3] text-card-text disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
