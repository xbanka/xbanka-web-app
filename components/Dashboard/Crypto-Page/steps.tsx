import { DashboardCard } from "@/components/Layout/DashboardCard";
import { HOW_TO_STEPS } from "@/lib/MockData";

export function HowTo({ action = "buy" }: { action?: string }) {
  return (
    <DashboardCard className="max-sm:p-4">
      <h3 className="text-[16px] font-medium leading-6 text-card-text text-center max-sm:text-[14px] max-sm:leading-5">
        How to {action} crypto on Xbanka
      </h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 bg-border p-3 sm:grid-cols-4 max-sm:p-4">
        {HOW_TO_STEPS.map((s) => (
          <div
            key={s.n}
            className="flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <div className="w-10 h-10 rounded-[36px] p-1 bg-[#012E03] text-card-text flex items-center justify-center text-xs font-bold shrink-0 max-sm:h-8 max-sm:w-8 max-sm:text-[11px]">
              {s.n}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium leading-5 text-card-text max-sm:text-[12px] max-sm:leading-4">
                {s.title}
              </p>
              <p className="text-[12px] font-normal text-text leading-5.5 max-sm:text-[11px] max-sm:leading-5">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
