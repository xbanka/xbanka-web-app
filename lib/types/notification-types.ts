import { LucideIcon } from "lucide-react";

type NotifType = "green" | "red" | "amber" | "blue" | "gray";
 
export interface Notification {
  id: string;
  icon: LucideIcon;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}
 
export interface NotifGroup {
  label: string;
  items: Notification[];
}
 
export type Tab = "all" | "transactions" | "activities";

export const iconStyles: Record<NotifType, string> = {
  green: "bg-Green/10 text-Green",
  red:   "bg-red-500/10 text-red-500",
  amber: "bg-amber-500/10 text-amber-500",
  blue:  "bg-blue-500/10 text-blue-500",
  gray:  "bg-input/30 text-placeholder",
};