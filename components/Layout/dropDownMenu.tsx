"use client";
import { useEffect, useRef, useState } from "react";
import {
  User,
  ShieldCheck,
  BadgeCheck,
  Gift,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Wifi,
} from "lucide-react";
import { MENU_ITEMS } from "@/lib/nav";
import { useUserStore } from "@/store/user.store";
import { useUserProfile } from "@/lib/services/onboarding.service";
import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { shortenUid } from "@/lib/shortenuid";

interface UserDropdownProps {
  name?: string;
  uid?: string;
  tier?: number;
  avatarInitials?: string;
  onLogout?: () => void;
}

const TIER_COLORS: Record<number, string> = {
  1: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  2: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function UserDropdown({
  tier = 2,
  avatarInitials = "CJ",
  onLogout,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const userData = useUserStore((state) => state.user);

  const { data, isPending, error } = UseProfileUser();
  const {
    data: verificationData,
    isPending: verificationPending,
    error: verificationError,
  } = UseVerificationStatus();
  console.log("user Profle data", data, verificationData);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* ── Trigger ──────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-border transition-colors cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-white text-xs font-bold">
            {avatarInitials}
          </div>
        </div>

        {/* Name + uid */}
        <div className="hidden sm:block text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-medium text-card-text leading-5 truncate">
              {userData?.firstName}
            </p>
          </div>
          <p className="text-[12px] font-normal leading-5.5 text-text max-w-28 truncate">
            UID: {shortenUid(userData?.userId)}
          </p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-placeholder transition-transform duration-200 hidden sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-[43.75px] bg-Green flex items-center justify-center text-white text-sm font-semibold">
            CJ
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[14px] font-medium leading-5.5 text-card-text">
              CoolJoe
            </p>
            <p className="text-[12px] font-normal text-text leading-5.5">UID: 22345678</p>
          </div>
        </div> */}

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50 rounded-2xl border border-border bg-card-background shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* User header */}
          <div className="border-b border-border px-6 pt-6 pb-3">
            <div className="bg-border py-2 px-2.75 rounded-xl flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-Green flex items-center justify-center text-white text-sm font-bold">
                  {avatarInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-text">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-text mt-0.5">
                    UID: {shortenUid(userData?.userId)}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${TIER_COLORS[tier] ?? TIER_COLORS[1]}`}
                  >
                    Tier {verificationData?.data?.tierLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="mb-6">
            {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-6 font-normal text-[14px] leading-6 py-3 text-sm hover:text-text hover:bg-border text-card-text transition-colors"
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span>{label}</span>
              </a>
            ))}
          </nav>

          {/* Divider + Logout */}
          <div className="border-t border-border p-6">
            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="font-normal leading-6 py-3 px-6 border cursor-pointer rounded-xl border-disabled-background text-center gap-3 w-full text-sm text-error-text hover:bg-border transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
