import { iconStyles, Notification } from "@/lib/types/notification-types";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function NotifItem({ n, onClick }: { n: Notification | any | [any]; onClick: () => void }) {
  const Icon = n.icon;
  return (
    <div className="flex items-start gap-3 py-3 px-4 bg-border last:border-b-0 rounded-lg">
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          // iconStyles[n.type],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[14px] font-medium text-card-text leading-5">
            {n.title}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-placeholder shrink-0 pt-0.5">
            {n.time}
            {n.unread && (
              <span className="w-1.5 h-1.5 rounded-full bg-Green inline-block" />
            )}
          </span>
        </div>

        <p className="text-[12px] font-normal text-text mt-1">{n.desc}</p>

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
