"use client";
import { DashboardCard } from "@/components/Layout/DashboardCard";
import {
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SecurityOverviewCard } from "./security-overview-card";
import LittleCards from "./little-cards";
import {
  UseGetActiveSessions,
  UseGetRegisteredDevices,
} from "@/lib/services/sessions.service";
import { DeviceDetails, UserSession } from "./types";
import { formatRelativeTime } from "@/lib/formatTime";
import { useState } from "react";
import { CreatePinModal } from "./create-pin-modal";
import { UpdatePinModal } from "./update-pin-modal";
import {
  useDisable2FA,
  useEnable2FA,
  useRequestOtp,
} from "@/lib/services/security.service";
import { ChangePasswordModal } from "../Wallet-Page/change-password-modal";
import { useUserStore } from "@/store/user.store";
import { Enable2faModal } from "./enable2fa-modal";
import { RemoveDeviceModal } from "./remove-device-modal";
import { RemoveSessionModal } from "./remove-session-modal";
import { UseProfileUser } from "@/lib/services/profile.service";

export function SecurityTab() {
  const hasPin = false; // Replace with actual logic to check if the user has set a PIN
  const hasPassword = true;
  const whiteList = false;
  const userData = useUserStore((state) => state.user);
  const [openCreatePin, setOpenCreatePin] = useState(false);
  const [openUpdatePin, setOpenUpdatePin] = useState(false);
  const [enable2faModal, setEnable2faModal] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [removeSessionModal, setRemoveSessionModal] = useState(false);
  const [removeDeviceModal, setRemoveDeviceModal] = useState(false);
  
  const [removeDeviceId, setRemoveDeviceId] = useState<string | null>(null);
   const {
    data: profile,
    error: profileError,
    isPending: profilePending,
  } = UseProfileUser();

  const {
    mutate: DisableTwoFactorMutate,
    isPending: DisableTwoFactorPending,
    error: DisableTwoFactorError,
  } = useDisable2FA();

  const {
    data: ActiveSessionsData,
    isPending: ActiveSessionsPending,
    error: ActiveSessionsError,
  } = UseGetActiveSessions();

  const activeSessions = ActiveSessionsData ? ActiveSessionsData.data : [];
  const {
    data: RegisteredDevicesData,
    isPending: RegisteredDevicesPending,
    error: RegisteredDevicesError,
  } = UseGetRegisteredDevices();

  const securityItems = [
    {
      icon: Lock,
      label: "Password",
      status: hasPassword,
      statusLabel: hasPassword ? "Set" : "Not enabled",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Mail,
      label: "Email",
      status: profile?.data?.isEmailVerified,
      statusLabel: profile?.data?.isEmailVerified ? "Active" : "Not enabled",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Smartphone,
      label: "Phone",
      status: profile?.data?.phoneNumber && profile?.data?.phoneNumber !== "",
      statusLabel: (profile?.data?.phoneNumber && profile?.data?.phoneNumber !== "") ? "Active" : "Not enabled",
      statusColor: "text-text",
      note: "",
    },
    {
      icon: Phone,
      label: "Google Authenticator",
      status: profile?.data?.isTwoFactorEnabled,
      statusLabel: profile?.data?.isTwoFactorEnabled ? "Active" : "Not enabled",
      statusColor: "text-yellow-500",
      note: "",
    },
    {
      icon: Lock,
      label: "Whitelist",
      status: false,
      statusLabel: whiteList ? "Active" : "Not Configured",
      statusColor: "text-text",
      note: "",
    },
  ];

  const handleChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleAuthAction = (item: any) => {
    if (item.isSet) {
      setOpenUpdatePin(true);
    } else {
      setOpenCreatePin(true);
    }
  };

  const handle2faModal = () => {
    setEnable2faModal(true);
  };

  const handleModal = (id: string) => {
    setRemoveDeviceModal(true);
    setRemoveDeviceId(id);
    console.log("Device ID to remove:", id);
  };

  const handleSessionModal = (id: string) => {
    setRemoveSessionModal(true);
    setRemoveDeviceId(id);
    console.log("session ID to remove:", id);
  };

  const authItems = [
    {
      icon: Lock,
      label: "Login Password",
      desc: "Used to log in to your account",
      isSet: hasPassword, // always true
      action: hasPassword ? "Change" : "Set Password",
      status: hasPassword ? "Password set" : "",
      onClick: handleChangePassword,
    },
    {
      icon: Lock,
      label: "Transaction PIN",
      desc: "Required for withdrawals and transfers",
      isSet: userData?.hasTransactionPin,
      action: userData?.hasTransactionPin ? "Change" : "Set PIN",
      status: userData?.hasTransactionPin ? "PIN set" : "",
      key: "pin",
      onClick: (item: any) => handleAuthAction(item),
    },
    {
      icon: Mail,
      label: "Email Authentication",
      isSet: true,
      status: "eyebiokin****",
      action: "Change",
    },
    {
      icon: Phone,
      label: "SMS Authentication",
      isSet: true,
      status: "+234 708 946 205*",
      action: "Change",
    },
    {
      icon: ShieldCheck,
      label: "Google Authenticator",
      desc: "Highly recommended for account security",
      isSet: userData?.isTwoFactorEnabled,
      action: userData?.isTwoFactorEnabled ? "Disable" : "Enable",
      status: userData?.isTwoFactorEnabled ? "" : "Not configured",
      onClick: () => handle2faModal(),
    },
  ];

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
                statusLabel={item.statusLabel}
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
                description={item?.desc}
                isSet={item.isSet}
                status={item.status}
                key={i}
                label={item.label}
                onClick={() => item.onClick?.(item)}
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
          {RegisteredDevicesData?.data?.map((d: DeviceDetails, i: number) => {
            // const Icon = d.icon;
            return (
              <LittleCards
                // Icon={Icon}
                action={"Remove"}
                date={d.createdAt}
                key={i}
                label={d.name}
                onClick={() => handleModal(d?.id)}
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
          {activeSessions.map((s: UserSession, i: number) => {
            // const Icon = s.icon;
            return (
              <LittleCards
                // Icon={Icon}
                action={s.isRevoked ? "Revoked" : "Revoke"}
                location={s.location ? s.location : "Unknown location"}
                ip={s.ipAddress}
                lastTime={formatRelativeTime(s.lastActiveAt)}
                key={i}
                label={s.device.type[0].toUpperCase() + s.device.type.slice(1)}
                onClick={() => handleSessionModal(s?.id)}
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
                // desc={item.desc}
                key={i}
                label={item.title}
              />
            );
          })}
        </div>
      </DashboardCard>
      {openCreatePin && (
        <CreatePinModal
          open={openCreatePin}
          handleClose={() => setOpenCreatePin(false)}
        />
      )}

      {openUpdatePin && (
        <UpdatePinModal
          open={openUpdatePin}
          handleClose={() => setOpenUpdatePin(false)}
        />
      )}

      {openChangePassword && (
        <ChangePasswordModal
          open={openChangePassword}
          handleClose={() => setOpenChangePassword(false)}
        />
      )}

      {enable2faModal && (
        <Enable2faModal
          open={enable2faModal}
          onClose={() => setEnable2faModal(false)}
        />
      )}

      {/* Remove Device Modal */}
      {removeDeviceModal && (
        <RemoveDeviceModal
          open={removeDeviceModal}
          onClose={() => setRemoveDeviceModal(false)}
          deviceId={removeDeviceId ?? ""}
        />
      )}

      {removeSessionModal && (
        <RemoveSessionModal
          open={removeSessionModal}
          deviceId={removeDeviceId ?? ""}
          onClose={() => setRemoveSessionModal(false)}
        />
      )}
    </div>
  );
}
