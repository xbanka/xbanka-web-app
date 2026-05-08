"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hiddenOnMobile?: boolean;
}

interface DataTableLayoutProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  emptyMessage?: string;
  itemsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  className?: string;
  pageTotal?: number;
}

export function DataTableLayout<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "No data available.",
  itemsPerPage = 10,
  totalCount,
  onPageChange,
  currentPage,
  isLoading = false,
  isError = false,
  errorMessage = "Failed to load data.",
  className,
  pageTotal
}: DataTableLayoutProps<T>) {
  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;
  const totalItems = totalCount ?? data?.length;
  const totalPages = pageTotal ? pageTotal : Math.ceil(totalItems / itemsPerPage);

  const paginatedData = !onPageChange
    ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : data;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const generatePageButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Filter columns for mobile (show only non-hidden columns)
  const visibleColumns = columns.filter((col) => !col.hiddenOnMobile);
  const formatMobileRequestId = (value: unknown) => {
    const text = String(value ?? "");
    return text.length > 25 ? `${text.slice(0, 20)}.....` : text;
  };
  const getRecordValue = (item: T, key: string) =>
    (item as Record<string, unknown>)[key];

  return (
    <div
      className={cn(
        "w-full max-w-full bg-border border border-border p-3 rounded-lg",
        className
      )}
    >
      <div className="hidden md:flex w-full rounded-lg">
        <div className="relative w-full overflow-x-auto rounded-lg">
          <div className="min-w-full">
            <Table className={cn("w-full table-fixed", isLoading || isError ? "pointer-events-none" : "")}>
              <TableHeader>
                <TableRow className="">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key as string}
                      className={`truncate font-medium py-1.5 px-4 text-[12px] border-b border-[#374151] leading-5 text-text ${
                        col.className ?? ""
                      }`}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading State */}
                {isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-6 text-gray-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {/* Error State */}
                {!isLoading && isError && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-6 text-error-text"
                    >
                      {errorMessage}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && paginatedData?.length === 0 && (
                  <TableRow className="border-none">
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-card-text text-[14px] font-medium leading-5 py-6"
                    >
                      <Image className="mx-auto mb-1" alt="frame" width={96} height={122} src={"/Frame.svg"}/>
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  paginatedData?.map((item) => (
                    <TableRow
                      key={rowKey(item)}
                      className="text-left text-card-text font-normal text-sm cursor-pointer hover:bg-border/90 transition-colors"
                    >
                      {columns.map((col) => (
                        <TableCell
                          className={cn(
                            "py-0.5 border-b border-input leading-6 px-4 text-left whitespace-nowrap overflow-hidden text-ellipsis",
                            col.className
                          )}
                          key={col.key as string}
                        >
                          {col.render
                            ? col.render(item)
                            : (item as never)[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      {/* MOBILE CARD VIEW */}
      <div className="md:hidden">
        {isLoading && (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        )}

        {!isLoading && isError && (
          <div className="p-6 text-center text-red-500">{errorMessage}</div>
        )}

        {!isLoading && !isError && paginatedData?.length === 0 && (
          <div className="p-6 text-center text-card-text text-[14px] font-medium leading-4.5">
            {emptyMessage}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4 p-0 sm:p-4">
            {paginatedData?.map((item) => (
              <div
                key={rowKey(item)}
                className="w-full min-w-0 space-y-3 rounded-[10px] border border-border bg-card-background p-4 shadow-sm"
              >
                {/* Main top row */}
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[12px] text-text font-medium">
                      Request ID
                    </span>
                    <span className="truncate text-[15px] font-semibold text-card-text">
                      {formatMobileRequestId(
                        getRecordValue(item, "requestId") ??
                          getRecordValue(item, "id"),
                      )}
                    </span>
                  </div>

                  {/* Status (rendered with your existing badge colors) */}
                  <div>
                    {columns.find((c) => c.key === "status")?.render?.(item)}
                  </div>
                </div>

                {/* Other fields */}
                <div className="space-y-2 border-t border-input pt-2">
                  {visibleColumns
                    .filter(
                      (col) =>
                        col.key !== "status" &&
                        col.key !== "actions" &&
                        col.key !== "requestId"
                    )
                    .map((col) => (
                      <div
                        key={col.key as string}
                        className="flex min-w-0 items-start justify-between gap-3"
                      >
                        <span className="shrink-0 text-[12px] text-text font-medium">
                          {col.header}
                        </span>
                        <span className="min-w-0 max-w-[62%] text-right text-[14px] font-medium text-card-text [&_*]:min-w-0">
                          {col.render
                            ? col.render(item)
                            : getRecordValue(item, col.key as string)}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Actions Button */}
                <div className="pt-2">
                  {columns.find((c) => c.key === "actions")?.render?.(item)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t mt-2">
          <p className="font-medium text-[12px] leading-4 text-[#606368]">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            {generatePageButtons().map((p, i) =>
              p === "..." ? (
                <span key={i} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  key={i}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className={`${ p !== page && "border-none"} "w-6 h-6 p-2 rounded-[6px] font-normal text-[12px] leading-4" `}
                  onClick={() => handlePageChange(p as number)}
                >
                  {p}
                </Button>
              )
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant={page === totalPages ? "outline" : "ghost"}
              className="border border-[#E5E3E3]"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant={page === totalPages ? "outline" : "ghost"}
              className="border border-[#E5E3E3]"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
