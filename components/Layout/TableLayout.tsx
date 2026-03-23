/* eslint-disable @typescript-eslint/no-explicit-any */
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
}: DataTableLayoutProps<T>) {
  const [localPage, setLocalPage] = useState(1);
  const page = currentPage ?? localPage;
  const totalItems = totalCount ?? data?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  return (
    <div
      className={cn(
        "w-full max-w-full border border-border rounded-lg",
        className
      )}
    >
      <div className="hidden md:block w-full rounded-lg">
        <div className="relative w-full overflow-x-auto rounded-lg">
          <div className=" min-w-full">
            <Table className={cn("w-full table-fixed", isLoading || isError ? "pointer-events-none" : "")}>
              <TableHeader>
                <TableRow className="bg-[#FAFAFA]">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key as string}
                      className={`truncate font-medium py-2 px-5 text-[12px] leading-4 text-[#606368] ${
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
                      className="text-center py-6 text-red-500"
                    >
                      {errorMessage}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && paginatedData?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-[#111827] text-[14px] font-medium leading-4.5 py-6"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  paginatedData?.map((item) => (
                    <TableRow
                      key={rowKey(item)}
                      className="hover:bg-gray-50 text-left text-[#111827] text-[14px] font-medium leading-4.5"
                    >
                      {columns.map((col) => (
                        <TableCell
                          className={cn(
                            "py-4.75 px-5 text-left whitespace-nowrap overflow-hidden text-ellipsis",
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
          <div className="p-6 text-center text-[#111827] text-[14px] font-medium leading-4.5">
            {emptyMessage}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4 p-4">
            {paginatedData?.map((item) => (
              <div
                key={rowKey(item)}
                className="bg-white border border-[#E5E7EB] rounded-[10px] p-4 shadow-sm space-y-3"
              >
                {/* Main top row */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-[#606368] font-medium">
                      Request ID
                    </span>
                    <span className="text-[15px] font-semibold text-[#111827]">
                      {(item as any).requestId ?? (item as any).id}
                    </span>
                  </div>

                  {/* Status (rendered with your existing badge colors) */}
                  <div>
                    {columns.find((c) => c.key === "status")?.render?.(item)}
                  </div>
                </div>

                {/* Other fields */}
                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
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
                        className="flex justify-between items-start"
                      >
                        <span className="text-[12px] text-[#606368] font-medium">
                          {col.header}
                        </span>
                        <span className="text-[14px] font-medium text-[#111827] text-right">
                          {col.render
                            ? col.render(item)
                            : (item as any)[col.key]}
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
