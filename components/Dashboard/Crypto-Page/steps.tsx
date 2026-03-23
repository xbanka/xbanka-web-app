import { DashboardCard } from "@/components/Layout/DashboardCard";
import { HOW_TO_STEPS } from "@/lib/MockData";

export function HowTo({ action = "buy" }: { action?: string }) {
  return (
    <DashboardCard className="">
      <h3 className="text-[16px] font-medium leading-6 text-card-text text-center">
        How to {action} crypto on Xbanka
      </h3>
      <div className="bg-border grid grid-cols-2 sm:grid-cols-4 gap-3 p-3">
        {HOW_TO_STEPS.map((s) => (
          <div key={s.n} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-[36px] p-1 bg-[#012E03] text-card-text flex items-center justify-center text-xs font-bold shrink-0">
              {s.n}
            </div>
            <div>
              <p className="text-[14px] font-medium leading-5 text-card-text">{s.title}</p>
              <p className="text-[12px] font-normal text-text leading-5.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}