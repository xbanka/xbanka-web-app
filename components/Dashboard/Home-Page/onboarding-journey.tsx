import { ONBOARDING_STEPS } from "@/lib/MockData";
import { CheckCircle } from "lucide-react";

export function OnboardingJourney() {
  return (
    <div className="bg-card-background border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-card-text text-sm">Complete your Onboarding Journey</h3>
          <p className="text-xs text-text mt-0.5">Unlock full access to Xbanka features</p>
        </div>
        <span className="text-xs text-text bg-border px-2 py-1 rounded-full">1 of 4 completed</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ONBOARDING_STEPS.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 border transition-colors
              ${s.status === "done" ? "border-green-500/30 bg-green-500/5" :
                s.status === "active" ? "border-Green bg-Green/5" :
                  "border-border bg-background"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-text uppercase tracking-wide">{s.step}</span>
              {s.status === "done" && <CheckCircle className="w-4 h-4 text-green-500" />}
              {s.status === "active" && (
                <span className="w-2 h-2 rounded-full bg-Green animate-pulse" />
              )}
            </div>
            <p className={`text-sm font-semibold mb-1 ${s.status === "locked" ? "text-text" : "text-card-text"}`}>
              {s.title}
            </p>
            <p className="text-xs text-text leading-relaxed mb-3">{s.desc}</p>
            {s.status === "active" && (
              <button
                className="w-full bg-Green text-white text-xs font-semibold py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue →
              </button>
            )}
            {s.status === "done" && (
              <p className="text-xs text-green-500 font-medium">Account created</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}