"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { formatDate } from "@/lib/formatDate";
import { CRYPTO_TRANSACTIONS, TRANSACTIONS } from "@/lib/MockData";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { StatusBadge } from "@/lib/statusBadge";
import { TransactionTypes } from "@/lib/types/transaction-types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export interface TransactionHistoryProps {
  isCrypto?: boolean;
  tableType?: "FIAT" | "CRYPTO" | "GIFTCARD";
}

export function TransactionHistory({
  isCrypto = false,
  tableType,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState("All");
  const [selectedType, setSelectedType] = useState("");
  const tabs = ["All", "Pending", "Completed", "In Progress", "Failed"];
  const data = isCrypto ? CRYPTO_TRANSACTIONS : TRANSACTIONS;
  const {
    data: transactionHistory,
    isPending,
    isError,
    error,
  } = UseGetTransactionHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  console.log("transactionHistory", transactionHistory);

  const transactions = transactionHistory?.data?.data?.items || [];
  const fiatTransactions = transactions.filter((tx: TransactionTypes) =>
    tableType ? tx.category === tableType : tx,
  );

  const filteredData = useMemo(() => {
    return (
      fiatTransactions?.filter((item: TransactionTypes) => {
        const searchStr = searchQuery.toLowerCase();
        const matchesSearch =
          item?.type?.toLowerCase().includes(searchStr) ||
          item?.type?.toLowerCase().includes(searchStr) ||
          item?.reference?.toLowerCase().includes(searchStr);

        const matchesStatus =
          filter.toLowerCase() === "all" ||
          item.status?.toLowerCase() === filter.toLowerCase();

        const matchesTransactionType =
          selectedType.toLowerCase() === "all" ||
          item.type?.toLowerCase() === filter.toLowerCase();

        return matchesSearch && matchesStatus && matchesTransactionType;
      }) || []
    );
  }, [fiatTransactions, filter, selectedType, searchQuery, tableType]);

  const columns = [
    {
      key: "createdAt",
      header: "Date & Time",
      render: (item: TransactionTypes) => (
        <span>{formatDate(item.createdAt)}</span>
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
      key: "note",
      header: "Note",
      render: (item: TransactionTypes) => (
        <span className="font-medium text-gray-700">{item.note}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: TransactionTypes) => <StatusBadge status={item.status} />,
    },
  ];

  const cryptoColumns = [
    {
      key: "createdAt",
      header: "Date & Time",
      render: (item: TransactionTypes) => (
        <span>{formatDate(item.createdAt)}</span>
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
      render: (item: TransactionTypes) => <StatusBadge status={item.status} />,
    },
  ];

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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-placeholder" />
            <Input
              placeholder="Search by name or email"
              className="pl-8 pr-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SelectField
            id="gender"
            placeholder="Transaction Type"
            options={[
              { value: "DEPOSIT", label: "DEPOSIT" },
              { value: "WITHDRAWAL", label: "WITHDRAWAL" },
              { value: "TRANSFER_IN", label: "TRANSFER IN" },
              { value: "TRANSFER_OUT", label: "TRANSFER OUT" },
            ]}
            value={selectedType}
            onChange={setSelectedType}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isCrypto ? (
          <DataTableLayout
            data={filteredData}
            columns={cryptoColumns}
            isError={isError}
            isLoading={isPending}
            errorMessage={error?.message}
            rowKey={(item) => item.id}
            itemsPerPage={10}
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
            itemsPerPage={10}
            pageTotal={transactionHistory?.data?.data?.meta.totalPages}
            currentPage={page}
            onPageChange={setPage}
            emptyMessage="No transaction history available."
          />
        )}
      </div>
    </DashboardCard>
  );
}
