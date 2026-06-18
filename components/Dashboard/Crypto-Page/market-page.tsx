"use client";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMarketPrices } from "@/lib/services/wallet.service";
import { CryptoMarketOverview } from "../Home-Page/types";
import { formatPrice, formatToTwoDecimals } from "@/lib/marketFormat";
import { getCoinImage } from "@/lib/coin-images";

export function MarketPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"favorites" | "spot" | "futures">("spot");
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const page = 1;
  const limit = 100;
  const {
    data: marketPrices,
    error: marketPricesError,
    isError: marketPricesIsError,
    isPending: marketPricesPending,
  } = useGetMarketPrices(page, limit);

  const items: CryptoMarketOverview[] = useMemo(
    () => marketPrices?.data?.items ?? [],
    [marketPrices],
  );

  useEffect(() => {
    const eventSource = new EventSource(
      "https://backend.xbankang.com/wallets/market-stream",
    );

    eventSource.onmessage = (event) => {
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

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) {
        next.delete(symbol);
      } else {
        next.add(symbol);
      }
      return next;
    });
  };

  const visibleCoins = useMemo(() => {
    let list = [...items];

    if (tab === "favorites") {
      list = list.filter((c) => favorites.has(c.symbol));
    }

    if (filter === "new") {
      list = list.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (c) =>
          c.symbol.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query),
      );
    }

    return list;
  }, [items, tab, filter, search, favorites]);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-card-text">Market</h1>

      {/* Tab row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b border-border overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(["favorites", "spot", "futures"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2.5 px-4 text-[14px] font-medium capitalize border-b-2 transition-colors -mb-px whitespace-nowrap
                ${tab === t ? "border-Green text-Green" : "border-transparent text-text hover:text-card-text"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* All / New + search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex gap-1 bg-background border border-border rounded-lg p-0.5 shrink-0">
            {(["all", "new"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-md text-[14px] font-medium capitalize transition-colors
                  ${filter === f ? "bg-Green text-white" : "text-text"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coin"
              className="pl-8 pr-3 h-9 text-[14px] border border-input rounded-lg bg-card-background text-card-text placeholder:text-placeholder outline-none focus:border-border-active transition-colors w-full sm:w-40"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-background border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full min-w-[460px] text-[14px]">
            <thead>
              <tr className="border-b border-border text-[14px] text-text">
                <th className="text-left px-4 py-4 font-medium w-6"></th>
                <th className="text-left px-4 py-4 font-medium">
                  <span className="flex items-center gap-1">
                    Pair <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-right px-4 py-4 font-medium">
                  <span className="flex items-center gap-1 ml-auto justify-end">
                    Last Price <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-right px-4 py-4 font-medium">
                  <span className="flex items-center gap-1 ml-auto justify-end">
                    Change <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-right px-4 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {marketPricesPending && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-text">
                    Loading market data...
                  </td>
                </tr>
              )}

              {!marketPricesPending && marketPricesIsError && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-error-text"
                  >
                    {marketPricesError?.message || "Failed to load market data."}
                  </td>
                </tr>
              )}

              {!marketPricesPending &&
                !marketPricesIsError &&
                visibleCoins.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-text"
                    >
                      {tab === "favorites"
                        ? "No favorites yet. Tap the star to add coins."
                        : "No coins found."}
                    </td>
                  </tr>
                )}

              {!marketPricesPending &&
                !marketPricesIsError &&
                visibleCoins.map((coin) => {
                  const isNegative = coin.changePercent24h < 0;
                  const isFavorite = favorites.has(coin.symbol);
                  return (
                    <tr
                      key={coin.id}
                      className="hover:bg-border/20 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(coin.symbol)}
                          aria-label={
                            isFavorite
                              ? `Remove ${coin.symbol} from favorites`
                              : `Add ${coin.symbol} to favorites`
                          }
                          className={`transition-colors hover:text-yellow-400 ${isFavorite ? "text-yellow-400" : "text-text"}`}
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            fill={isFavorite ? "currentColor" : "none"}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-card-background overflow-hidden shrink-0">
                            <Image
                              src={getCoinImage(coin.symbol)}
                              alt={coin.symbol}
                              width={28}
                              height={28}
                            />
                          </div>
                          <span className="text-[14px] font-semibold text-card-text whitespace-nowrap">
                            {coin.symbol}
                            <span className="text-text font-normal">/USDT</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-[14px] font-medium text-card-text whitespace-nowrap">
                        ${formatPrice(coin.priceUsd)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`text-[14px] font-semibold flex items-center justify-end gap-0.5 whitespace-nowrap ${isNegative ? "text-red-500" : "text-green-500"}`}
                        >
                          {isNegative ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUp className="w-3 h-3" />
                          )}
                          {formatToTwoDecimals(coin.changePercent24h)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/crypto?tab=buy&mode=buy&coin=${coin.symbol}`}
                          className="inline-block bg-Green hover:bg-Green/90 text-white text-[14px] font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
