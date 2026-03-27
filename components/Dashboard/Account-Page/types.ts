import { LucideIcon } from "lucide-react";

export interface securityOverviewCardProps {
  label: string;
  statusColor: string;
  status: string;
  icon: LucideIcon;
  key: string | number;
}

export interface littleCardProps {
  key: number;
  Icon: LucideIcon;
  action: string;
  label: string;
  desc: string;
  status?: string;
}
