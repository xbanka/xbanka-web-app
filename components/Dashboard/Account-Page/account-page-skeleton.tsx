import { DashboardCard } from "@/components/Layout/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountPageSkeleton() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-pulse">
      {/* Sub-nav tabs */}
      <div className="flex gap-6 border-b border-border pb-2.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Profile header */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-17.5 h-17.5 rounded-full shrink-0" />
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </DashboardCard>

      {/* Deposit & Withdrawal Account */}
      <DashboardCard className="space-y-4">
        <div className="pb-4 border-b border-border">
          <Skeleton className="h-5 w-56" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x lg:divide-border">
          {/* Funding account */}
          <div className="space-y-4 lg:pr-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>

            <div className="bg-border rounded-lg p-5 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-44 rounded-md" />
              <Skeleton className="h-10 w-44 rounded-md" />
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Withdrawal account */}
          <div className="space-y-4 lg:pl-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
              <Skeleton className="h-10 w-48 rounded-md mt-2" />
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Personal Information */}
      <DashboardCard className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-border p-5 rounded-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
