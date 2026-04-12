import { DashboardCard } from "@/components/Layout/DashboardCard";
import {
  Chrome,
  Laptop,
  List,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SecurityOverviewCard } from "./security-overview-card";
import LittleCards from "./little-cards";
import { UseGetActiveSessions } from "@/lib/services/sessions.service";
import { GetRegisteredDevices } from "@/lib/actions/sessions";

export function SecurityTab() {
  const securityItems = [
    {
      icon: Lock,
      label: "Password",
      status: "Set",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Mail,
      label: "Email",
      status: "Active",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Smartphone,
      label: "Phone",
      status: "Active",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Phone,
      label: "Google Authenticator",
      status: "Not enabled",
      statusColor: "text-yellow-500",
      note: "",
    },
    {
      icon: Lock,
      label: "Whitelist",
      status: "Not Configured",
      statusColor: "text-text",
      note: "",
    },
  ];

  const authItems = [
    {
      icon: Lock,
      label: "Login Password",
      desc: "Used to log in to your account",
      status: "Password Set",
      action: "Change",
    },
    {
      icon: Lock,
      label: "Transaction PIN",
      desc: "Required for withdrawals and transfers",
      status: "PIN Set",
      action: "Change",
    },
    {
      icon: Mail,
      label: "Email Authentication",
      desc: "",
      status: "eyebiokin****",
      action: "Change",
    },
    {
      icon: Phone,
      label: "SMS Authentication",
      desc: "",
      status: "+234 708 946 205*",
      action: "Change",
    },
    {
      icon: ShieldCheck,
      label: "Google Authenticator",
      desc: "Highly recommended for account security",
      status: "Not configured",
      action: "Enable",
    },
  ];

  const devices = [
    {
      name: "Samsung S21",
      icon: Smartphone,
      action: "Remove",
      added: "Added Nov 21, 2025",
    },
    {
      name: "Lenovo R123",
      icon: Laptop,
      action: "Remove",
      added: "Added Nov 21, 2025",
    },
  ];

  const sessions = [
    {
      os: "Mac OS",
      icon: Chrome,
      ip: "IP: 193.89.11",
      location: "Lagos, Nigeria",
      time: "",
      action: "Revoke",
    },
    {
      os: "Mobile App",
      icon: Laptop,
      ip: "",
      location: "Lagos, Nigeria",
      time: "2 hrs ago",
      action: "Revoke",
    },
  ];

  const { data, isPending, error } = UseGetActiveSessions();
  const {
    data: RegisteredDevicesData,
    isPending: RegisteredDevicesPending,
    error: RegisteredDevicesError,
  } = GetRegisteredDevices();

  return (
    <div className="space-y-5">
      {/* Security health */}
      <DashboardCard className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-[16px] font-medium leading-6 text-card-text">
            Security Overview
          </h3>
          <p className="text-[14px] font-medium leading-5.5 text-text">
            Your account security health is at 80%. Good
          </p>
        </div>
        <div className="flex gap-3">
          {securityItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <SecurityOverviewCard
                icon={Icon}
                label={item.label}
                statusColor={item.statusColor}
                status={item.status}
                key={i}
              />
            );
          })}
        </div>
      </DashboardCard>

      {/* Authentication */}
      <DashboardCard className="space-y-3">
        <h3 className="text-[16px] font-medium leading-6 text-card-text">
          Authentication
        </h3>
        <div className="space-y-3">
          {authItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <LittleCards
                Icon={Icon}
                action={item.action}
                desc={item.desc}
                status={item.status}
                key={i}
                label={item.label}
              />
            );
          })}
        </div>
      </DashboardCard>

      {/* Trusted Devices */}
      <DashboardCard className="space-y-3">
        <h3 className="text-[16px] font-medium leading-6 text-card-text">
          Trusted Devices
        </h3>
        <div className="space-y-3">
          {devices.map((d, i) => {
            const Icon = d.icon;
            return (
              <LittleCards
                Icon={Icon}
                action={d.action}
                desc={d.added}
                key={i}
                label={d.name}
              />
            );
          })}
        </div>
      </DashboardCard>

      {/* Active Sessions */}
      <DashboardCard className="space-y-3">
        <h3 className="text-[16px] font-medium leading-6 text-card-text">
          Active Sessions
        </h3>
        <div className="space-y-3">
          {sessions.map((s, i) => {
            const Icon = s.icon;
            return (
              <LittleCards
                Icon={Icon}
                action={s.action}
                desc={s.location}
                key={i}
                label={s.os}
              />
            );
          })}
        </div>
      </DashboardCard>

      {/* Withdrawal Security */}
      <DashboardCard className="space-y-3">
        <h3 className="text-sm font-semibold text-card-text">
          Withdrawal Security
        </h3>
        <div className="space-y-3">
          {[
            {
              title: "Withdrawal Whitelist",
              desc: "When enabled, withdrawals to your trusted bank accounts or crypto addresses will bypass standard 2FA and email verification; however, if suspicious activity is detected, enhanced security checks may still apply.",
              status: "Not configured",
              action: "Configure",
              icon: Lock,
            },
            {
              title: "Manage Crypto Withdrawal Limits",
              desc: "Daily Withdrawal Amount: 500,000 USDT. Monthly Withdrawal Amount: No Limit",
              status: "Not configured",
              action: "Set Up",
              icon: Lock,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <LittleCards
                Icon={Icon}
                action={item.action}
                desc={item.desc}
                key={i}
                label={item.title}
              />
            );
          })}
        </div>
      </DashboardCard>
    </div>
  );
}
