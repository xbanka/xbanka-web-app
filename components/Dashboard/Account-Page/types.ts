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
  Icon?: LucideIcon;
  action: string;
  label: string;
  status?: string;
  ip?: string;
  location?: string;
  lastTime?: string;
  date?: string;
}

export interface DeviceDetails {
  id: string;
  userId: string;
  deviceId: string;
  name: string; // e.g., "MacIntel"
  type: "mobile" | "desktop" | "tablet"; // Added common types based on "mobile"
  isTrusted: boolean;
  verificationToken: string | null;
  verificationTokenExpiresAt: string | null;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  location: string | null;
  isRevoked: boolean;
  expiresAt: string;
  lastActiveAt: string;
  createdAt: string;
  device: DeviceDetails; // Nested device object
}