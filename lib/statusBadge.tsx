export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-[#037508] border-[#012E03] text-[#A6F4C5]",
    "In Progress": "bg-blue-500/10 text-blue-400",
    Pending: "bg-[#3E2E00] border-[#A27D00] text-[#FEC84B]",
    Failed: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-normal capitalize ${map[status] ?? "bg-border text-text"}`}>
      {status?.toLowerCase()}
    </span>
  );
}

export function CryptoHistoryStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();
  const map: Record<string, string> = {
    completed: "bg-green-success-light text-green-success-text",
    pending: "bg-yellow-warning-light text-yellow-warning-text",
    failed: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex shrink-0 whitespace-nowrap px-2 py-0.5 rounded-sm text-xs font-normal capitalize ${map[normalizedStatus] ?? "bg-border text-text"}`}>
      {status?.toLowerCase()}
    </span>
  );
}

export function TransactionHistoryStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();
  const map: Record<string, string> = {
    completed: "bg-[#037508] border-badge-border-green text-[#A6F4C5]",
    pending: "bg-[#3E2E00] border-[#A27D00] text-[#FEC84B]",
    failed: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex shrink-0 whitespace-nowrap px-2 py-0.5 border rounded-full text-xs font-normal capitalize ${map[normalizedStatus] ?? "bg-border text-text"}`}>
      {status?.toLowerCase()}
    </span>
  );
}
