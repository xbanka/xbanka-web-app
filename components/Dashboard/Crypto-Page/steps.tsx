import { HOW_TO_STEPS } from "@/lib/MockData";

export function HowTo({ action = "buy" }: { action?: string }) {
  return (
    <div className="bg-card-background border border-border rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-card-text mb-4 text-center">
        How to {action} crypto on Xbanka
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {HOW_TO_STEPS.map((s) => (
          <div key={s.n} className="flex flex-col items-center text-center gap-2">
            <div className="w-8 h-8 rounded-full bg-Green flex items-center justify-center text-white text-xs font-bold shrink-0">
              {s.n}
            </div>
            <p className="text-xs font-semibold text-card-text">{s.title}</p>
            <p className="text-[10px] text-text leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}