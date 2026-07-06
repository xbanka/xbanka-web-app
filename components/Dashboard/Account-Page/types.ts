import { LucideIcon } from "lucide-react";

export interface securityOverviewCardProps {
  label: string;
  statusColor: string;
  status: boolean;
  statusLabel: string;
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
  description?: string
  isSet?: boolean;
  onClick?: () => void;
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

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  id: string;
  isVerified: boolean;
}

export type BankStep = "details" | "confirm" | "linking" | "success";
// export type BankStep = "select" | "details" | "confirm" | "linking" | "success";
export type FundMethod = "bank" | "card" | null;
 
export interface AddBankModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface RemoveDeviceModalProps {
  open: boolean;
  onClose: () => void;
  deviceId: string;
}

export interface RevokeSessionModalProps {
  open: boolean;
  onClose: () => void;
  deviceId: string;
}

export interface MapleradBankAccount {
  id: string;
  walletId: string;
  provider: "MAPLERAD" | string; // Strict literal token with string fallback
  providerRef: string;
  network: "NUBAN" | string;    // NUBAN represents regular Nigerian bank account numbers
  accountName: string;
  address: string;              // This contains the actual bank account number string
  bankName: string;             // e.g., "Maplerad"
  bankCode: string | null;      // Nullable in case code isn't provided explicitly
  memo: string | null;
  createdAt: string;            // ISO 8601 string format
  updatedAt: string;            // ISO 8601 string format
}