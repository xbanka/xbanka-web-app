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

interface UserDropdownProps {
  name?: string;
  uid?: string;
  tier?: number;
  avatarInitials?: string;
  onLogout?: () => void;
}

const MENU_ITEMS = [
  { icon: User, label: "My Profile", href: "#" },
  { icon: ShieldCheck, label: "Security", href: "#" },
  { icon: BadgeCheck, label: "Verification Status", href: "#" },
  { icon: Gift, label: "Refer & Earn", href: "#" },
  { icon: Star, label: "Rewards", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
];

const TIER_COLORS: Record<number, string> = {
  1: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  2: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  3: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function UserDropdown({
  name = "CoolJoe",
  uid = "22345678",
  tier = 2,
  avatarInitials = "CJ",
  onLogout,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
          <div className="w-8 h-8 rounded-full bg-Green flex items-center justify-center text-white text-xs font-bold">
            {avatarInitials}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card-background" />
        </div>

        {/* Name + uid */}
        <div className="hidden sm:block text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-card-text leading-none truncate max-w-[80px]">
              {name}
            </p>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${TIER_COLORS[tier] ?? TIER_COLORS[1]}`}
            >
              Tier {tier}
            </span>
          </div>
          <p className="text-[10px] text-text mt-0.5">UID: {uid}</p>
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
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-Green flex items-center justify-center text-white text-sm font-bold">
                  {avatarInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-card-text">{name}</p>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${TIER_COLORS[tier] ?? TIER_COLORS[1]}`}
                  >
                    Tier {tier}
                  </span>
                </div>
                <p className="text-xs text-text mt-0.5">UID: {uid}</p>
              </div>
            </div>

            {/* Online status row */}
            <div className="flex items-center gap-1.5 mt-3">
              <Wifi className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </div>

          {/* Menu items */}
          <nav className="py-1.5">
            {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-border hover:text-card-text transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </a>
            ))}
          </nav>

          {/* Divider + Logout */}
          <div className="border-t border-border py-1.5">
            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-error-text hover:bg-error-text/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
