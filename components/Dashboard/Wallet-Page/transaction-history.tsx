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
import { useState } from "react";
import { toLowerCase } from "zod";

export function TransactionHistory({
  isCrypto = false,
}: {
  isCrypto?: boolean;
}) {
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

  const filteredData =
    transactionHistory?.data?.data?.items?.filter((item: TransactionTypes) => {
      const matchesSearch =
        item?.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.reference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filter.toLowerCase() === "all" ||
        item.status?.toLowerCase() === filter.toLowerCase();

      const matchesTransactionType =
        selectedType.toLowerCase() === "all" ||
        item.type?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesStatus && matchesTransactionType;
    }) || [];

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
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text border-b border-border">
                <th className="text-left pb-2 font-medium">Date & Time</th>
                <th className="text-left pb-2 font-medium">Type</th>
                <th className="text-left pb-2 font-medium">Asset</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Note</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((tx, i) => (
                <tr key={i} className="hover:bg-border/20 transition-colors">
                  <td className="py-2.5">
                    <p className="text-card-text font-medium">{tx.date}</p>
                    <p className="text-text">{tx.time}</p>
                  </td>
                  <td className="py-2.5 text-card-text">{tx.type}</td>
                  <td className="py-2.5 text-card-text">{(tx as any).asset}</td>
                  <td
                    className={`py-2.5 font-medium ${(tx as any).amount?.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                  >
                    {(tx as any).amount}
                  </td>
                  <td className="py-2.5 text-text font-mono">{tx.ref}</td>
                  <td className="py-2.5">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
