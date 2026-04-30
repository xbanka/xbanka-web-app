import { cn } from "@/lib/utils";
import { Tab } from "./types";

export function TabToggle({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="flex w-full rounded-lg bg-background border border-border p-1 gap-1">
      {(["select-recipient", "bank-form"] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-md py-2 px-3 text-sm font-medium leading-5 transition-all duration-150",
            active === tab
              ? "bg-[#042F2E] text-card-text rounded-sm shadow-sm"
              : "text-text hover:text-card-text"
          )}
        >
          {tab === "select-recipient" ? "Xbanka User" : "Bank Account"}
        </button>
      ))}
    </div>
  );
}