import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Placeholder for {@link CryptoPage}. Mirrors the "Buy & Sell" tab, which is
 * where /crypto lands when no `?tab=` is set.
 */
export function CryptoPageSkeleton() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-pulse">
      {/* Main tabs */}
      <div className="flex gap-4 -mx-1 px-1">
        <div className="px-4 pb-2.5 border-b-4 border-border">
          <Skeleton inset className="h-4 w-20" />
        </div>
        <div className="px-4 pb-2.5 border-b-4 border-transparent">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="space-y-10 max-sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:gap-4">
          {/* Trade panel */}
          <DashboardCard className="lg:col-span-2 space-y-3 w-full">
            {/* Buy / Sell toggle */}
            <div className="flex gap-1 bg-card-background border border-border rounded-lg p-1 w-full">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 flex-1 rounded-lg" />
            </div>

            <div className="space-y-6">
              {/* You Pay / You Receive */}
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card-secondary flex w-full rounded-xl py-3.25 px-5 gap-6 max-sm:py-3 max-sm:px-3 max-sm:gap-2"
                >
                  <div className="flex-4 flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Skeleton inset className="h-3 w-20" />
                      <Skeleton inset className="h-3 w-28" />
                    </div>
                    <Skeleton inset className="h-6 w-32" />
                  </div>
                  <div className="flex flex-1 max-sm:flex-none max-sm:basis-[40%] items-center gap-1.5 py-4 pl-4 max-sm:py-2 max-sm:pl-2.5 border-l border-disabled-background shrink-0">
                    <Skeleton inset className="h-7 w-7 rounded-full shrink-0" />
                    <Skeleton inset className="h-4 w-16" />
                  </div>
                </div>
              ))}

              {/* Exchange rate line */}
              <Skeleton className="h-3 w-52 max-w-full" />

              {/* Get Quote + terms */}
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-2.5 w-72 max-w-full mx-auto" />
              </div>
            </div>
          </DashboardCard>

          {/* Recent Transaction */}
          <DashboardCard className="opacity-60">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-12 rounded-sm" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center gap-3 py-3 px-4 bg-border rounded-lg"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton inset className="w-10 h-10 rounded-full shrink-0" />
                    <div className="min-w-0 space-y-2">
                      <Skeleton inset className="h-4 w-24" />
                      <Skeleton inset className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <Skeleton inset className="h-4 w-16 ml-auto" />
                    <Skeleton inset className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* How to buy crypto on Xbanka */}
        <DashboardCard className="max-sm:p-4">
          <Skeleton className="h-5 w-56 max-w-full mx-auto" />

          <div className="bg-border grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2"
              >
                <Skeleton inset className="w-10 h-10 rounded-[36px] shrink-0" />
                <div className="w-full flex flex-col items-center space-y-2">
                  <Skeleton inset className="h-4 w-24 max-w-full" />
                  <Skeleton inset className="h-3 w-32 max-w-full" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
