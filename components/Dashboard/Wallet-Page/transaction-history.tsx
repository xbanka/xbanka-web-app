"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import { DataTableLayout } from "@/components/Layout/TableLayout";
import { Input } from "@/components/ui/input";
import { SelectFieldWithValue } from "@/components/ui/select-with-value";
import { formatCurrencyAmount } from "@/lib/formatCurrencyAmount";
import { formatDate } from "@/lib/formatDate";
import { formatTo12Hour } from "@/lib/formatTime";
import { UseGetTransactionHistory } from "@/lib/services/wallet.service";
import { TransactionHistoryStatusBadge } from "@/lib/statusBadge";
import { TransactionTypes } from "@/lib/types/transaction-types";
import { buildTransactionReceipt } from "@/lib/transactionReceipt";
import { TransactionReceiptModal } from "@/components/ui/transaction-receipt-modal";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export interface TransactionHistoryProps {
  isCrypto?: boolean;
  tableType?: "FIAT" | "CRYPTO" | "GIFTCARD";
}

export function TransactionHistory({ tableType }: TransactionHistoryProps) {
  const [filter, setFilter] = useState("All");
  // Other pages can deep-link a pre-filtered list, e.g. ?type=BILL_PAYMENT.
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState(
    () => searchParams.get("type")?.toUpperCase() || "ALL",
  );
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [receiptFor, setReceiptFor] = useState<TransactionTypes | null>(null);
  const limit = 4;
  const tabs = ["All", "Pending", "Completed", "In Progress", "Failed"];
  const {
    data: transactionHistory,
    isPending,
    isError,
    error,
  } = UseGetTransactionHistory(page, limit, tableType, debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const transactions = transactionHistory?.data?.data?.items || [];

  const filteredData = useMemo(() => {
    return (
      transactions?.filter((item: TransactionTypes) => {
        const matchesStatus =
          filter.toLowerCase() === "all" ||
          item.status?.toLowerCase() === filter.toLowerCase();

        const matchesTransactionType =
          selectedType === "ALL" ||
          item.type?.toLowerCase() === selectedType.toLowerCase();

        return matchesStatus && matchesTransactionType;
      }) || []
    );
  }, [transactions, filter, selectedType, searchQuery]);

  /**
   * The row (and, on mobile, the card) already opens the receipt — this is the
   * visible affordance that says so. It sits in its own cell on desktop and at
   * the foot of the card on mobile, where it stretches to the full width.
   */
  const receiptColumn = {
    key: "actions",
    header: "",
    className: "w-32",
    render: (item: TransactionTypes) => (
      <button
        type="button"
        onClick={(event) => {
          // The row itself opens the receipt too — without this the click
          // would run twice.
          event.stopPropagation();
          setReceiptFor(item);
        }}
        className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-Green/40 bg-Green/10 px-3 py-1.5 text-[12px] font-medium leading-4 text-Green transition-colors hover:border-Green hover:bg-Green/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Green/40 md:w-auto"
      >
        View receipt
      </button>
    ),
  };

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
        <span className="">
          {formatCurrencyAmount(item.amount, item.currency)}
        </span>
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
    receiptColumn,
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
    receiptColumn,
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
              placeholder="Search by reference id or amount"
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
                { value: "DEPOSIT", label: "Deposit" },
                { value: "WITHDRAWAL", label: "Withdrawal" },
                { value: "BILL_PAYMENT", label: "Bill payment" },
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
          onRowClick={setReceiptFor}
          emptyMessage="No transaction history available."
        />
      </div>

      {receiptFor && (
        <TransactionReceiptModal
          {...buildTransactionReceipt(receiptFor)}
          onClose={() => setReceiptFor(null)}
        />
      )}
    </DashboardCard>
  );
}
