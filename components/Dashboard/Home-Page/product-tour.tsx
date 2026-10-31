"use client";

import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { UseProfileUser } from "@/lib/services/profile.service";
import { hasSeenTour, markTourSeen } from "@/lib/productTour";
import { useProductTourStore } from "@/store/product-tour.store";
import { useSplashStore } from "@/store/splash.store";

// The home sections rise in one after another (see RiseIn); wait for the
// last of them before drawing a highlight around any of them.
const START_DELAY_MS = 700;

// Tailwind's `md` breakpoint: the sidebar shows from here, the tab bar below.
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * The steps, in order. Targets are `data-tour` attributes on the dashboard.
 *
 * Navigation has two targets per page because the desktop sidebar and the
 * mobile tab bar are both in the DOM, one hidden by CSS, so a shared selector
 * would match the invisible one.
 */
const buildSteps = (desktop: boolean): DriveStep[] => [
  {
    element: "[data-tour=balance]",
    popover: {
      title: "Your total asset value",
      description:
        "Naira and crypto balances in one figure. Switch between NGN and USDT, or tap the eye to hide it.",
    },
  },
  {
    element: "[data-tour=add-funds]",
    popover: {
      title: "Add funds",
      description:
        "Top up your naira wallet by bank transfer. Deposits land here within minutes.",
      side: desktop ? "left" : "bottom",
    },
  },
  {
    element: "[data-tour=verification]",
    popover: {
      title: "Complete verification",
      description:
        "Finish these steps to unlock higher limits and transfers to other banks and wallets.",
    },
  },
  {
    element: "[data-tour=quick-actions]",
    popover: {
      title: "Quick actions",
      description:
        "Buy or sell crypto, and pay for airtime, data and electricity from here.",
      side: "top",
    },
  },
  {
    element: desktop ? "[data-tour=nav-wallet]" : "[data-tour=tab-wallet]",
    popover: {
      title: "Your wallet",
      description: "Every balance, deposit and withdrawal lives here.",
      side: desktop ? "right" : "top",
    },
  },
  {
    element: desktop ? "[data-tour=nav-crypto]" : "[data-tour=tab-crypto]",
    popover: {
      title: "Trade crypto",
      description: "Buy and sell BTC, ETH, USDT and USDC at live rates.",
      side: desktop ? "right" : "top",
    },
  },
  {
    element: "[data-tour=notifications]",
    popover: {
      title: "Notifications",
      description: "Deposit confirmations and security alerts land here.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "[data-tour=profile-menu]",
    popover: {
      title: "Your profile",
      description:
        "Manage your details, security settings and verification status. You can replay this tour from here any time.",
      side: "bottom",
      align: "end",
    },
  },
];

/**
 * Walks a user through the dashboard the first time they see it.
 *
 * Renders nothing; it only starts driver.js once the splash has lifted and
 * the profile (whose id scopes the once-only flag) has arrived. "Take a tour"
 * in the profile menu replays it on demand.
 */
export function ProductTour() {
  const splashDone = useSplashStore((state) => state.done);
  const requested = useProductTourStore((state) => state.requested);
  const clearRequest = useProductTourStore((state) => state.clear);
  const { data: profileData } = UseProfileUser();
  const userId: string | undefined = profileData?.data?.userId;

  useEffect(() => {
    if (!splashDone || !userId) return;
    if (!requested && hasSeenTour(userId)) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tour = driver({
      steps: buildSteps(desktop),
      popoverClass: "xb-tour",
      showProgress: true,
      progressText: "{{current}} of {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      animate: !reduceMotion,
      overlayOpacity: 0.6,
      stagePadding: 8,
      stageRadius: 14,
      // A target that is not on the page (e.g. the verification card once KYC
      // is complete) is skipped rather than shown as a centred popover.
      skipMissingElement: true,
      // Keep "Add Fund" and the nav from being triggered mid-tour.
      disableActiveInteraction: true,
      onDestroyed: (_element, _step, { reason }) => {
        // "api" is a programmatic destroy: this effect's cleanup, including
        // React's development-mode remount. Everything else is the user
        // finishing or dismissing, and either way they should not get the
        // tour again uninvited.
        if (reason === "api" || reason === "replaced") return;
        markTourSeen(userId);
        clearRequest();
      },
    });

    const timer = window.setTimeout(() => tour.drive(), START_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (tour.isActive()) tour.destroy();
    };
  }, [splashDone, userId, requested, clearRequest]);

  return null;
}
