export function StatusLogo({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-[#012E03] text-[#A6F4C5]",
    "In Progress": "bg-blue-500/10 text-blue-400",
    Pending: "bg-[#3E2E00] text-[#FEC84B]",
    Failed: "bg-[#390201] text-[#FF8882]",
  };
  return (
    <span className={`inline-flex px-2 py-0.75 rounded-full text-xs font-medium ${map[status] ?? "bg-border text-text"}`}>
      {status}
    </span>
  );
}