import { timeAgo } from "@/lib/formatDate";
import {
  getNotificationColor,
  getNotificationIcon,
  getNotificationStatusLabel,
} from "@/lib/getNotificationIcon";
import { CryptoHistoryStatusBadge } from "@/lib/statusBadge";
import { Notification } from "@/lib/types/notification-types";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ShieldCheck, Bell, Trash2 } from "lucide-react";

const notificationIcons = {
  SUCCESS: ArrowDown,
  WARNING: ArrowUp,
  SECURITY: ShieldCheck,
  INFO: Bell,
};

const notificationColors = {
  SUCCESS: "bg-green-900 text-green-400",
  WARNING: "bg-red-900 text-red-400",
  SECURITY: "bg-green-900 text-green-400",
  INFO: "bg-blue-900 text-blue-400",
};

export function NotifItem({
  n,
  onClick,
  onDismiss,
}: {
  n: Notification;
  onClick: () => void;
  onDismiss?: () => void;
}) {
  const Icon = getNotificationIcon(n);
  const statusLabel = getNotificationStatusLabel(n);
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-3 py-4 px-4 rounded-lg cursor-pointer transition-colors bg-border",
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          getNotificationColor(n),
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
            {timeAgo(n.createdAt)}
            {!n.isRead && (
              <span className="w-1.5 h-1.5 rounded-full bg-Green" />
            )}
            {onDismiss && (
              <button
                type="button"
                aria-label="Remove notification"
                onClick={(event) => {
                  // Don't let the row's mark-as-read handler fire too.
                  event.stopPropagation();
                  onDismiss();
                }}
                // Always visible on touch, where there is no hover to reveal it.
                className="ml-0.5 rounded p-1 text-placeholder opacity-0 transition-opacity hover:bg-card-background hover:text-error-text focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </span>
        </div>

        <p className="text-[12px] font-normal text-text mt-1">{n.message}</p>

        {statusLabel && (
          <div className="mt-2">
            <CryptoHistoryStatusBadge status={statusLabel} />
          </div>
        )}
      </div>
    </div>
  );
}
