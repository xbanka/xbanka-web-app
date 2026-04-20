"use client";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { MARKET } from "@/lib/MockData";
import { useGetMarketPrices } from "@/lib/services/wallet.service";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { CryptoMarketOverview } from "./types";

export function MarketOverview() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState();
  const {
    data: marketPrices,
    error: marketPricesError,
    isError: marketPricesIsError,
    isPending: marketPricesPending,
  } = useGetMarketPrices();
  console.log("marketPrices", marketPrices);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://backend.xbankang.com/wallets/market-stream",
    );

    eventSource.onopen = () => {
      console.log("SSE connected");
    };

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);

      // try {
      //   const update = JSON.parse(event.data);
      // } catch (err) {
      //   console.error("Invalid SSE data", err);
      // }

      queryClient.setQueryData(["market-prices"], (oldData: any) => {
        if (!oldData) return oldData;

        return oldData.map((item: any) =>
          item.symbol === update.symbol ? { ...item, ...update } : item,
        );
      });
    };

    // eventSource.onerror = () => {
    //   eventSource.close();
    // };

    eventSource.onerror = (err) => {
      console.error("SSE error", err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const columns = [
    {
      key: "symbol",
      header: "Assets",
      render: (item: CryptoMarketOverview) => (
        <div className="flex items-center">
          <div></div>
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
      render: (item: CryptoMarketOverview) => <span>{item.priceUsd}</span>,
    },
    {
      key: "changePercent24h",
      header: "24h Change",
      render: (item: CryptoMarketOverview) => (
        <span className="">{item.changePercent24h}</span>
      ),
    },
    {
      key: "id",
      header: "Action",
      render: (item: CryptoMarketOverview) => (
        <span className="">Trade</span>
        // <span className="font-medium text-gray-700">
        //   ₦{Number(item.amount).toLocaleString()}
        // </span>
      ),
    },
  ];

  return (
    <div className="bg-card-background border border-border rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-text">
          Market Overview
        </h3>
        <div className="flex gap-1 text-xs">
          {["Favourites", "Hot", "Gainers", "Losers", "New", "Turnovers"].map(
            (t) => (
              <button
                key={t}
                className={`px-2 py-1 rounded-md transition-colors ${t === "Favourites" ? "bg-Green/10 text-Green font-medium" : "text-text hover:text-card-text"}`}
              >
                {t}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTableLayout
          data={marketPrices?.data || []}
          columns={columns}
          isError={marketPricesIsError}
          isLoading={marketPricesPending}
          errorMessage={marketPricesError?.message}
          rowKey={(item) => item.id}
          itemsPerPage={6}
          // pageTotal={transactionHistory?.data?.data?.meta.totalPages}
          currentPage={page}
          onPageChange={() => setPage(page)}
          emptyMessage="No transaction history available."
        />
      </div>
    </div>
  );
}
