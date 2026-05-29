"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { CryptoSelectField } from "@/components/ui/crypto-select";
import { Input } from "@/components/ui/input";
import { SelectFieldWithValue } from "@/components/ui/select-with-value";
import { formatDate } from "@/lib/formatDate";
import { formatTo12Hour } from "@/lib/formatTime";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { TransactionHistoryStatusBadge } from "@/lib/statusBadge";
import { transactionHistoryType } from "@/lib/transactionHistoryType";
import { TransactionTypes } from "@/lib/types/transaction-types";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface TransactionHistoryProps {
  isCrypto?: boolean;
  tableType?: "FIAT" | "CRYPTO" | "GIFTCARD";
}

export function TransactionHistory({ tableType }: TransactionHistoryProps) {
  const [filter, setFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 4;
  const tabs = ["All", "Pending", "Completed", "In Progress", "Failed"];
  const {
    data: transactionHistory,
    isPending,
    isError,
    error,
  } = UseGetTransactionHistory(page, limit, tableType);

  const transactions = transactionHistory?.data?.data?.items || [];

  const filteredData = useMemo(() => {
    return (
      transactions?.filter((item: TransactionTypes) => {
        const searchStr = searchQuery.toLowerCase();
        const matchesSearch =
          item?.type?.toLowerCase().includes(searchStr) ||
          item?.reference?.toLowerCase().includes(searchStr) ||
          item?.currency?.toLowerCase().includes(searchStr) ||
          item?.status?.toLowerCase().includes(searchStr) ||
          item?.note?.toLowerCase().includes(searchStr) ||
          item?.category?.toLowerCase().includes(searchStr) ||
          String(item?.amount).includes(searchStr);
        const matchesStatus =
          filter.toLowerCase() === "all" ||
          item.status?.toLowerCase() === filter.toLowerCase();

        const matchesTransactionType =
          selectedType === "ALL" ||
          item.type?.toLowerCase() === selectedType.toLowerCase();

        return matchesStatus && matchesTransactionType && matchesSearch;
      }) || []
    );
  }, [transactions, filter, selectedType, searchQuery]);

  const columns = [
    {
      key: "createdAt",
      header: "Date & Time",
      render: (item: TransactionTypes) => (
        <div>
          <span>{formatDate(item.createdAt)}</span>
          <p className="font-medium text-xs leading-5 text-text">
            {formatTo12Hour(item.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Transaction Type",
      render: (item: TransactionTypes) => <span>{item.type}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: TransactionTypes) => (
        <span className="">{item.amount}</span>
      ),
    },
    {
      key: "reference",
      header: "Reference ID",
      render: (item: TransactionTypes) => (
        <span className="">{item.reference}</span>
        // <span className="font-medium text-gray-700">
        //   ₦{Number(item.amount).toLocaleString()}
        // </span>
      ),
    },
    {
      key: "note",
      header: "Note",
      render: (item: TransactionTypes) => <span className="">{item.note}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item: TransactionTypes) => (
        <TransactionHistoryStatusBadge status={item.status} />
      ),
    },
  ];

  const cryptoColumns = [
    {
      key: "createdAt",
      header: "Date & Time",
      render: (item: TransactionTypes) => (
        <div>
          <span>{formatDate(item.createdAt)}</span>
          <p className="font-medium text-xs leading-5 text-text">
            {formatTo12Hour(item.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Transaction Type",
      render: (item: TransactionTypes) => <span>{item.type}</span>,
    },
    {
      key: "currency",
      header: "Asset",
      render: (item: TransactionTypes) => <span>{item.currency}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: TransactionTypes) => (
        <span className="font-medium">{item.amount}</span>
      ),
    },
    {
      key: "reference",
      header: "Reference ID",
      render: (item: TransactionTypes) => (
        <span className="font-medium text-gray-700">{item.reference}</span>
        // <span className="font-medium text-gray-700">
        //   ₦{Number(item.amount).toLocaleString()}
        // </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: TransactionTypes) => (
        <TransactionHistoryStatusBadge status={item.status} />
      ),
    },
  ];

  useEffect(() => {
    setPage(1);
  }, [tableType, searchQuery, filter, selectedType]);

  return (
    <DashboardCard className="">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-medium text-card-text text-[16px] leading-6">
          Transaction History
        </h3>
      </div>

      {/* Status tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2 cursor-pointer text-[14px] leading-5 font-medium whitespace-nowrap border-b-2 transition-colors ${
                filter === t
                  ? "border-Green pb-2 text-card-text"
                  : "border-none text-text hover:text-card-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 min-w-0 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
            <Input
              placeholder="Search by name or email"
              className="pl-8 pr-3 w-full sm:w-62.5 truncate"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="shrink-0 w-30 sm:w-auto">
            <SelectFieldWithValue
              placeholder="Transaction Type"
              options={[
                { value: "ALL", label: "All" },
                { value: "DEPOSIT", label: "DEPOSIT" },
                { value: "WITHDRAWAL", label: "WITHDRAWAL" },
              ]}
              value={selectedType}
              onChange={(value) => {
                setSelectedType(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* {tableType === "CRYPTO" ? (
          <DataTableLayout
            data={cryptoTransactions}
            columns={cryptoColumns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(item) => item.id}
            itemsPerPage={limit}
            pageTotal={transactionHistory?.data?.data?.meta.totalPages}
            currentPage={page}
            onPageChange={setPage}
            emptyMessage="No transaction history available."
          />
        ) : tableType === "FIAT" ? (
          <DataTableLayout
            data={fiatTransactions}
            columns={columns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(item) => item.id}
            itemsPerPage={limit}
            pageTotal={transactionHistory?.data?.data?.meta.totalPages}
            currentPage={page}
            onPageChange={setPage}
            emptyMessage="No transaction history available."
          />
        ) : (
          <DataTableLayout
            data={filteredData}
            columns={columns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(item) => item.id}
            itemsPerPage={limit}
            pageTotal={transactionHistory?.data?.data?.meta.totalPages}
            currentPage={page}
            onPageChange={setPage}
            emptyMessage="No transaction history available."
          />
        )} */}
        <DataTableLayout
          data={filteredData}
          columns={tableType === "CRYPTO" ? cryptoColumns : columns}
          isError={isError}
          isLoading={isPending}
          errorMessage={error?.message}
          rowKey={(item) => item.id}
          itemsPerPage={limit}
          pageTotal={transactionHistory?.data?.data?.meta.totalPages}
          currentPage={page}
          onPageChange={setPage}
          emptyMessage="No transaction history available."
        />
      </div>
    </DashboardCard>
  );
}
