"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CryptoMarketOverview } from "../Home-Page/types";
import { formatPrice, formatToTwoDecimals } from "@/lib/marketFormat";
import { useGetMarketPrices } from "@/lib/services/wallet.service";
import { useQueryClient } from "@tanstack/react-query";

// const MARKET_DATA = [
//   { pair: "Bitcoin / USDT", price: "92,300", change: "+3.21%", up: true },
//   { pair: "Ethereum / USDT", price: "87,500", change: "+4.15%", up: true },
//   { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
//   { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
//   { pair: "Tether / USDT", price: "76,800", change: "-2.78%", up: false },
// ];

export function MarketHighlight() {
  const [tab, setTab] = useState<"trending" | "new">("trending");
  const [mode, setMode] = useState<"spot" | "futures">("spot");

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;
  const {
    data: marketPrices,
    error: marketPricesError,
    isError: marketPricesIsError,
    isPending: marketPricesPending,
  } = useGetMarketPrices(page, limit);
  console.log("marketPrices", marketPrices);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://backend.xbankang.com/wallets/market-stream ",
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
      className: "w-[100px]",
      render: (item: CryptoMarketOverview) => (
        <div className="flex items-center gap-2">
          <div className="bg-card-background h-8 w-8 rounded-full"></div>
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
      className: "w-[70px]",
      render: (item: CryptoMarketOverview) => {
        const changeValue = item.changePercent24h;
        const isNegative = changeValue < 0;
        return (
          <div
            className={`flex items-center gap-1 font-medium ${isNegative ? "text-red-500" : "text-Green"}`}
          >
            {/* Down arrow for negative, Up arrow for positive */}
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
      className: "w-[70px]",
      render: (item: CryptoMarketOverview) => (
        <span className="text-sm leading-6 text-Green font-normal">Trade</span>
      ),
    },
  ];
  return (
    <DashboardCard className="lg:col-span-2 p-4 max-sm:p-3.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-text">
          Market Highlight
        </h3>
        <button className="text-xs text-Green hover:underline">See all</button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {(["trending", "new"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors capitalize ${tab === t ? "bg-Green/10 text-Green" : "text-text hover:text-card-text"}`}
            >
              {t === "trending" ? "Trending" : "Newly Listed"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["spot", "futures"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[10px] rounded-lg font-medium transition-colors capitalize ${mode === m ? "bg-border text-card-text" : "text-text"}`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTableLayout
          data={marketPrices?.data.items || []}
          columns={columns}
          isError={marketPricesIsError}
          isLoading={marketPricesPending}
          errorMessage={marketPricesError?.message}
          rowKey={(item) => item.id}
          itemsPerPage={5}
          pageTotal={marketPrices?.data?.meta.totalPages}
          currentPage={page}
          onPageChange={() => setPage(page)}
          emptyMessage="No transaction history available."
        />
      </div>
      {/* <div className="space-y-0">
        <div className="grid grid-cols-3 text-[10px] text-text pb-1.5 border-b border-border mb-1">
          <span>Assets</span>
          <span className="text-center">Price</span>
          <span className="text-right">24h Change</span>
        </div>
        {MARKET_DATA.map((c, i) => (
          <div
            key={i}
            className="grid grid-cols-3 py-2 text-xs hover:bg-border/20 rounded-lg px-1 transition-colors"
          >
            <span className="text-card-text font-medium truncate">
              {c.pair.split(" / ")[0]}
              <span className="text-text">/{c.pair.split(" / ")[1]}</span>
            </span>
            <span className="text-card-text text-center">{c.price}</span>
            <span
              className={`text-right font-medium flex items-center justify-end gap-0.5 ${c.up ? "text-green-500" : "text-red-500"}`}
            >
              {c.up ? (
                <ArrowUp className="w-2.5 h-2.5" />
              ) : (
                <ArrowDown className="w-2.5 h-2.5" />
              )}
              {c.change}
            </span>
          </div>
        ))}
        
      </div> */}
    </DashboardCard>
  );
}
