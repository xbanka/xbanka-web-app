export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "bg-green-500/10 text-green-500",
    "In Progress": "bg-blue-500/10 text-blue-400",
    Pending: "bg-yellow-500/10 text-yellow-500",
    Failed: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-border text-text"}`}>
      {status}
    </span>
  );
}