import { DashboardCard } from "@/components/Layout/DashboardCard";
import { List, Lock, Mail, Phone, ShieldCheck, Smartphone } from "lucide-react";
import { SecurityOverviewCard } from "./security-overview-card";

export function SecurityTab() {
  const securityItems = [
    { icon: Lock,         label: "Password",             status: "Set",         statusColor: "text-text", note: "" },
    { icon: Mail,         label: "Email",                status: "Active",      statusColor: "text-text", note: "" },
    { icon: Smartphone,        label: "Phone",                status: "Active",      statusColor: "text-text", note: "" },
    { icon: Phone,   label: "Google Authenticator", status: "Not enabled", statusColor: "text-yellow-500", note: "" },
    { icon: Lock,         label: "Whitelist",            status: "Not Configured", statusColor: "text-text", note: "" },
  ];
 
  const authItems = [
    { icon: Lock,       label: "Login Password",       desc: "Used to log in to your account", status: "Password Set", action: "Change", statusColor: "text-green-500" },
    { icon: Lock,       label: "Transaction PIN",      desc: "Required for withdrawals and transfers", status: "PIN Set", action: "Change", statusColor: "text-green-500" },
    { icon: Mail,       label: "Email Authentication", desc: "", status: "eyebiokin****", action: "Change", statusColor: "text-green-500" },
    { icon: Phone,      label: "SMS Authentication",   desc: "", status: "+234 708 946 205*", action: "Change", statusColor: "text-green-500" },
    { icon: ShieldCheck, label: "Google Authenticator", desc: "Highly recommended for account security", status: "Not configured", action: "Enable", statusColor: "text-text" },
  ];
 
  const devices = [
    { name: "Samsung S21", added: "Added Nov 21, 2025" },
    { name: "Lenovo R123", added: "Added Nov 21, 2025" },
  ];
 
  const sessions = [
    { os: "Mac OS", ip: "IP: 193.89.11", location: "Lagos, Nigeria", time: "" },
    { os: "Mobile App", ip: "", location: "Lagos, Nigeria", time: "2 hrs ago" },
  ];
 
  return (
    <div className="space-y-5">
      {/* Security health */}
      <DashboardCard className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-[16px] font-medium leading-6 text-card-text">Security Overview</h3>
          <p className="text-[14px] font-medium leading-5.5 text-text">Your account security health is at 80%. Good</p>
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
        <h3 className="text-[16px] font-medium leading-6 text-card-text">Authentication</h3>
        <div className="space-y-3">
          {authItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-border gap-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 p-2 rounded-lg bg-[#042F2E] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-Green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-text">{item.label}</p>
                    {item.desc && <p className="text-xs text-text">{item.desc}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium ${item.statusColor}`}>{item.status}</span>
                  <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${
                    item.action === "Enable"
                      ? "border-Green text-Green hover:bg-Green/10"
                      : "border-border text-card-text hover:bg-border"
                  }`}>
                    {item.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>
 
      {/* Trusted Devices */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-card-text">Trusted Devices</h3>
        <div className="space-y-2">
          {devices.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-border flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-text" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-text">{d.name}</p>
                  <p className="text-xs text-text">{d.added}</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-mainRed hover:bg-mainRed/10 border border-mainRed/30 px-3 py-1.5 rounded-lg transition-colors">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
 
      {/* Active Sessions */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-card-text">Active Sessions</h3>
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-Green/10 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-Green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-text">{s.os}</p>
                  <p className="text-xs text-text">{[s.ip, s.location, s.time].filter(Boolean).join(" • ")}</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-mainRed hover:bg-mainRed/10 border border-mainRed/30 px-3 py-1.5 rounded-lg transition-colors">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
 
      {/* Withdrawal Security */}
      <div className="bg-card-background border border-border rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-card-text">Withdrawal Security</h3>
        <div className="space-y-2">
          {[
            {
              title: "Withdrawal Whitelist",
              desc: "When enabled, withdrawals to your trusted bank accounts or crypto addresses will bypass standard 2FA and email verification; however, if suspicious activity is detected, enhanced security checks may still apply.",
              status: "Not configured",
              action: "Configure",
            },
            {
              title: "Manage Crypto Withdrawal Limits",
              desc: "Daily Withdrawal Amount: 500,000 USDT. Monthly Withdrawal Amount: No Limit",
              status: "Not configured",
              action: "Set Up",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-4 bg-background border border-border rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-text">{item.title}</p>
                <p className="text-xs text-text mt-1 leading-relaxed">{item.desc}</p>
                <p className="text-xs text-text mt-1">{item.status}</p>
              </div>
              <button className="text-xs font-semibold text-Green border border-Green/30 hover:bg-Green/10 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}