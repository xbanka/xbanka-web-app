"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Compass } from "lucide-react";
import { MENU_ITEMS } from "@/lib/nav";
import {
  UseProfileUser,
  UseVerificationStatus,
} from "@/lib/services/profile.service";
import { shortenUid } from "@/lib/shortenuid";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutStore } from "@/store/logout.store";
import { useProductTourStore } from "@/store/product-tour.store";
import { tourForPath } from "@/lib/tours";
import { cn } from "@/lib/utils";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { getWalletTotals } from "@/lib/walletTotals";
import { useBalanceVisibility } from "@/hooks/use-balance-visibility";

interface UserDropdownProps {
  avatarInitials?: string;
}

export default function UserDropdown({}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    data: profile,
    isPending: profileDataPending,
    error: profileDataError,
  } = UseProfileUser();
  const { openModal } = useLogoutStore();
  const router = useRouter();
  const pathname = usePathname();
  const requestTour = useProductTourStore((state) => state.request);
  const avatar = profile?.data?.avatarUrl;
  const { data: balances } = UseGetAllWalletBalances();
  const { hidden: balancesHidden } = useBalanceVisibility();
  const totals = getWalletTotals(balances?.data?.data);

  const {
    data: verificationData,
    isPending: verificationPending,
    error: verificationError,
  } = UseVerificationStatus();

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
        data-tour="profile-menu"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-foreground text-xs font-bold">
            {avatar ? (
              <Image
                src={avatar}
                alt="profile"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              `${profile?.data?.firstName?.[0] || ""}${profile?.data?.lastName?.[0] || ""}` ||
              profile?.data?.email[0]
            )}
          </div>
        </div>

        {/* Name + uid */}
        <div className="hidden sm:block text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[14px] font-medium text-card-text leading-5 truncate">
              {profile?.data?.firstName}
            </p>
          </div>
          <p className="text-[12px] font-normal leading-5.5 text-text max-w-28 truncate">
            UID: {shortenUid(profile?.data?.userId)}
          </p>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-placeholder transition-transform duration-200 hidden sm:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 md:w-80 z-50 rounded-2xl border border-border bg-card-background shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* User header */}
          <div className="border-b border-border px-6 pt-6 pb-3">
            <div className="bg-border py-2 px-2.75 rounded-xl flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-Green flex items-center justify-center text-white text-sm font-bold">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="profile"
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    `${profile?.data?.firstName?.[0] || ""}${profile?.data?.lastName?.[0] || ""}` ||
                    profile?.data?.email[0]
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-text">
                  {profile?.data?.firstName} {profile?.data?.lastName}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-text mt-0.5">
                    UID: {shortenUid(profile?.data?.userId)}
                  </p>
                  {verificationData?.data?.tierLevel === 0 && (
                    <Image
                      width={60}
                      height={19}
                      alt="tier"
                      src={"/Tier0.svg"} unoptimized />
                  )}
                  {verificationData?.data?.tierLevel === 1 && (
                    <Image
                      width={60}
                      height={19}
                      alt="tier"
                      src={"/Tier1.svg"} unoptimized />
                  )}
                  {verificationData?.data?.tierLevel === 2 && (
                    <Image
                      width={60}
                      height={19}
                      alt="tier"
                      src={"/Tier2.svg"} unoptimized />
                  )}
                  {verificationData?.data?.tierLevel === 3 && (
                    <Image
                      width={60}
                      height={19}
                      alt="tier"
                      src={"/Tier3.svg"} unoptimized />
                  )}
                </div>
              </div>
            </div>
            {/* Totals under the UID: the whole portfolio, and the crypto part with its naira value */}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-text">Total assets</span>
                <span
                  key={balancesHidden ? "hidden" : "shown"}
                  className="font-display font-semibold text-card-text motion-safe:animate-reveal"
                >
                  {balancesHidden
                    ? "₦•••••"
                    : `₦${totals.totalNgn.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-text">Crypto assets</span>
                <span
                  key={balancesHidden ? "hidden" : "shown"}
                  className="font-display text-card-text motion-safe:animate-reveal"
                >
                  {balancesHidden
                    ? "$•••"
                    : `$${totals.cryptoUsd.toLocaleString()}`}
                  {!balancesHidden && (
                    <span className="text-text">
                      {" "}
                      ≈ ₦{totals.cryptoNgn.toLocaleString()}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="mb-6">
            {MENU_ITEMS.map(
              ({ icon: Icon, label, href, badge, badgeColor }) => {
                const content = (
                  <>
                    <Icon className="w-6 h-6 shrink-0" />
                    <span>{label}</span>
                    {badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    )}
                  </>
                );
                const itemClass =
                  "flex items-center gap-3 px-6 font-normal text-[14px] leading-6 py-3 text-sm transition-colors";

                return (
                  // A client-side route change; a plain <a> would reload the
                  // whole app and replay the splash.
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      itemClass,
                      "text-card-text hover:text-text hover:bg-border",
                    )}
                  >
                    {content}
                  </Link>
                );
              },
            )}
            {/* Replays this section's tour, or the dashboard's where the
                section has none; the layout's ProductTour picks it up. */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                requestTour();
                if (!tourForPath(pathname)) router.push("/");
              }}
              className="flex w-full items-center gap-3 px-6 font-normal text-[14px] leading-6 py-3 text-sm text-card-text transition-colors hover:text-text hover:bg-border"
            >
              <Compass className="w-6 h-6 shrink-0" />
              <span>Take a tour</span>
            </button>
          </nav>

          {/* Divider + Logout */}
          <div className="border-t border-border p-6">
            <button
              onClick={() => {
                setOpen(false);
                openModal();
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
