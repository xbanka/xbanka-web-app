export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-[#037508] border-[#012E03] text-[#A6F4C5]",
    "In Progress": "bg-blue-500/10 text-blue-400",
    Pending: "bg-[#3E2E00] border-[#A27D00] text-[#FEC84B]",
    Failed: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 border rounded-full text-xs font-medium ${map[status] ?? "bg-border text-text"}`}>
      {status}
    </span>
  );
}