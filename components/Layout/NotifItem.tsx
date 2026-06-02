import { timeAgo } from "@/lib/formatDate";
import {
  getNotificationColor,
  getNotificationIcon,
} from "@/lib/getNotificationIcon";
import { Notification } from "@/lib/types/notification-types";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ShieldCheck, Bell } from "lucide-react";

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
}: {
  n: Notification;
  onClick: () => void;
}) {
  const Icon = getNotificationIcon(n);
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 py-4 px-4 rounded-lg cursor-pointer transition-colors bg-border",
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
          </span>
        </div>

        <p className="text-[12px] font-normal text-text mt-1">{n.message}</p>
      </div>
    </div>
  );
}
