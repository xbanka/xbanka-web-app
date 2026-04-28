export function BankAccountSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-background)] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-[var(--color-border)] rounded" />
            <div className="h-5 w-20 bg-[var(--color-border)] rounded-full" />
          </div>
          <div className="h-4 w-32 bg-[var(--color-border)] rounded" />
          <div className="h-3 w-40 bg-[var(--color-border)] rounded" />
          <div className="h-3 w-28 bg-[var(--color-border)] rounded" />
        </div>
      ))}
    </div>
  );
}