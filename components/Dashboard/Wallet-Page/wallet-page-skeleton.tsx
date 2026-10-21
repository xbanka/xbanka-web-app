import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";

/** Column widths for the placeholder transaction rows, narrowest first. */
const TABLE_ROWS = 5;

/**
 * Placeholder for {@link WalletPage}: the tabs, a balance card and the
 * transaction history that every tab shows.
 */
export function WalletPageSkeleton() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Wallet tabs + portfolio total */}
      <DashboardCard className="space-y-3">
        <div className="border border-border p-1 flex items-center justify-start rounded-lg w-fit gap-0.5">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        <DashboardCard className="border-blue-border bg-blue-light">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton inset className="h-4 w-40" />
              <Skeleton inset className="h-9 w-56 max-w-full" />
              <Skeleton inset className="h-3 w-32" />
            </div>

            {/* Fiat / Crypto split */}
            <div className="flex flex-col sm:flex-row gap-4 max-sm:flex-row max-sm:w-full">
              <div className="border-l-3 border-[#004C99] bg-border px-4 py-3 space-y-2 max-sm:w-full">
                <Skeleton inset className="h-3 w-10" />
                <Skeleton inset className="h-4 w-24" />
              </div>
              <div className="border-l-3 border-border-active bg-border px-4 py-3 space-y-2 max-sm:w-full">
                <Skeleton inset className="h-3 w-14" />
                <Skeleton inset className="h-4 w-24" />
              </div>
            </div>
          </div>
        </DashboardCard>
      </DashboardCard>

      {/* Transaction history */}
      <DashboardCard>
        <Skeleton className="h-5 w-44" />

        {/* Status tabs + search + type filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-22 max-sm:hidden" />
            <Skeleton className="h-4 w-12 max-sm:hidden" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-9 flex-1 rounded-lg sm:w-62.5 sm:flex-none" />
            <Skeleton className="h-9 w-30 rounded-lg shrink-0 sm:w-24" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Header row */}
          <div className="flex items-center gap-4 border-b border-border pb-3">
            <Skeleton className="h-3 w-20 flex-1" />
            <Skeleton className="h-3 w-28 shrink-0 max-md:hidden" />
            <Skeleton className="h-3 w-16 shrink-0" />
            <Skeleton className="h-3 w-24 shrink-0 max-lg:hidden" />
            <Skeleton className="h-3 w-14 shrink-0 max-lg:hidden" />
            <Skeleton className="h-3 w-14 shrink-0" />
            <Skeleton className="h-3 w-20 shrink-0 max-sm:hidden" />
          </div>

          {Array.from({ length: TABLE_ROWS }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <Skeleton className="h-3.5 w-28 shrink-0 max-md:hidden" />
              <Skeleton className="h-3.5 w-16 shrink-0" />
              <Skeleton className="h-3.5 w-24 shrink-0 max-lg:hidden" />
              <Skeleton className="h-3.5 w-14 shrink-0 max-lg:hidden" />
              <Skeleton className="h-5 w-20 rounded-full shrink-0" />
              <Skeleton className="h-7 w-24 rounded-full shrink-0 max-sm:hidden" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Skeleton className="h-3.5 w-24" />
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-md" />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
