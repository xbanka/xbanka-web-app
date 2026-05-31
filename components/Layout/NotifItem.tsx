import { iconStyles, Notification } from "@/lib/types/notification-types";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function NotifItem({ n }: { n: Notification }) {
  const Icon = n.icon;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          iconStyles[n.type],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[13px] font-semibold text-card-text leading-snug">
            {n.title}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-placeholder shrink-0 pt-0.5">
            {n.time}
            {n.unread && (
              <span className="w-1.5 h-1.5 rounded-full bg-Green inline-block" />
            )}
          </span>
        </div>

        <p className="text-[12px] text-text mt-0.5 leading-relaxed">{n.desc}</p>

        {n.actionLabel && (
          <button
            onClick={n.onAction}
            className="mt-1 inline-flex items-center gap-1 text-[12px] text-Green hover:opacity-80 transition-opacity"
          >
            {n.actionLabel}
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
