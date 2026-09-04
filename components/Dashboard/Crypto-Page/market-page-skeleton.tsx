import { Skeleton } from "@/components/ui/skeleton";

const MARKET_ROWS = 8;

/** Placeholder for {@link MarketPage}. */
export function MarketPageSkeleton() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-pulse">
      <Skeleton className="h-7 w-32" />

      {/* Tab row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b border-border">
          <div className="px-4 pb-2.5 border-b-2 border-border">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="px-4 pb-2.5 border-b-2 border-transparent">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="px-4 pb-2.5 border-b-2 border-transparent">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* All / New + search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex gap-1 bg-background border border-border rounded-lg p-0.5 shrink-0">
            <Skeleton inset className="h-7 w-14 rounded-md" />
            <Skeleton inset className="h-7 w-14 rounded-md" />
          </div>
          <Skeleton className="h-9 flex-1 rounded-lg sm:w-40 sm:flex-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card-background border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border px-4 py-4">
          <Skeleton className="h-3.5 w-3.5 shrink-0" />
          <Skeleton className="h-3 w-16 flex-1" />
          <Skeleton className="h-3 w-14 shrink-0" />
          <Skeleton className="h-3 w-20 shrink-0" />
          <Skeleton className="h-3 w-14 shrink-0" />
        </div>

        {Array.from({ length: MARKET_ROWS }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
          >
            <Skeleton className="h-3.5 w-3.5 shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20 shrink-0" />
            <Skeleton className="h-4 w-16 shrink-0" />
            <Skeleton className="h-9 w-20 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
