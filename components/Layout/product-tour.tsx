"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { driver, type Driver, type PopoverDOM } from "driver.js";
import "driver.js/dist/driver.css";
import { UseProfileUser } from "@/lib/services/profile.service";
import { hasSeenTour, markTourSeen } from "@/lib/productTour";
import { tourIconSvg, type TourIconName } from "@/lib/tour-icons";
import { tourForPath } from "@/lib/tours";
import { useProductTourStore } from "@/store/product-tour.store";
import { useSplashStore } from "@/store/splash.store";

// Each section rises in when opened (RiseIn, Reveal, animate-page-in); wait
// for that before drawing a highlight around anything.
const START_DELAY_MS = 700;

// Tailwind's `md` breakpoint: the sidebar shows from here, the tab bar below.
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Runs the tour for whichever section is open, the first time a user opens
 * it (see `lib/tours.ts`). Mounted once in the dashboard layout; renders
 * nothing. It waits for the splash to lift and for the profile, whose id
 * scopes the once-only flag. "Take a tour" in the profile menu replays the
 * current section's tour.
 */
export function ProductTour() {
  const pathname = usePathname();
  const splashDone = useSplashStore((state) => state.done);
  const requested = useProductTourStore((state) => state.requested);
  const clearRequest = useProductTourStore((state) => state.clear);
  const { data: profileData } = UseProfileUser();
  const userId: string | undefined = profileData?.data?.userId;

  useEffect(() => {
    const tour = tourForPath(pathname);
    if (!tour || !splashDone || !userId) return;
    if (!requested && hasSeenTour(userId, tour.id)) return;

    let instance: Driver | undefined;

    const timer = window.setTimeout(() => {
      const desktop = window.matchMedia(DESKTOP_QUERY).matches;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Only the stops whose target is on the page right now, e.g. a wallet
      // tab's cards exist only while that tab is open. With nothing to show
      // (page still loading), leave the flag alone so it tries again next
      // visit.
      const steps = tour
        .steps({ desktop })
        .filter(
          (step) =>
            typeof step.element === "string" &&
            document.querySelector(step.element),
        );
      if (steps.length === 0) {
        clearRequest();
        return;
      }

      instance = driver({
        steps,
        popoverClass: "xb-tour",
        // The close "×" is replaced by a "Skip" link (see decoratePopover).
        showButtons: ["next", "previous"],
        showProgress: false,
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Finish",
        animate: !reduceMotion,
        overlayColor: "#0b1220",
        overlayOpacity: 0.58,
        // A stray tap outside must not end (and silence) a once-only tour.
        overlayClickBehavior: "none",
        stagePadding: 10,
        stageRadius: 16,
        // The popover has no arrow; sit it a little clear of the spotlight.
        popoverOffset: 14,
        // Safety net for a target removed while the tour is running.
        skipMissingElement: true,
        // Keep buttons and links from being triggered mid-tour.
        disableActiveInteraction: true,
        onPopoverRender: (popover, { driver: active, state, index }) =>
          decoratePopover(popover, {
            label: tour.label,
            icon: state.activeStep?.data?.icon,
            index: index ?? 0,
            total: steps.length,
            last: active.isLastStep(),
          }),
        onDestroyed: (_element, _step, { reason }) => {
          // "api" is a programmatic destroy: this effect's cleanup, including
          // React's development-mode remount. Everything else is the user
          // finishing or dismissing, and either way they should not get the
          // tour again uninvited.
          if (reason === "api" || reason === "replaced") return;
          markTourSeen(userId, tour.id);
          clearRequest();
        },
      });
      instance.drive();
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      if (instance?.isActive()) instance.destroy();
    };
  }, [pathname, splashDone, userId, requested, clearRequest]);

  return null;
}

/**
 * Reshapes driver.js's popover into the app's design: an icon tile and a
 * "Skip" link on top, an eyebrow above the title, progress dots beside Back
 * and Next, and an arrow on Next (a check on Finish). Styles live under
 * `.xb-tour` in app/globals.css. driver.js rebuilds the popover for every
 * stop, so this runs once per stop.
 */
function decoratePopover(
  popover: PopoverDOM,
  opts: {
    label: string;
    icon?: TourIconName;
    index: number;
    total: number;
    last: boolean;
  },
) {
  const { wrapper, title, footer, footerButtons, nextButton, closeButton } =
    popover;
  const current = opts.index + 1;

  const tile = document.createElement("span");
  tile.className = "xb-tour-icon";
  tile.innerHTML = tourIconSvg(opts.icon ?? "compass");
  wrapper.prepend(tile);

  const eyebrow = document.createElement("p");
  eyebrow.className = "xb-tour-eyebrow";
  eyebrow.textContent = `${opts.label} · ${current} of ${opts.total}`;
  title.before(eyebrow);

  const dots = document.createElement("div");
  dots.className = "xb-tour-dots";
  dots.setAttribute("aria-hidden", "true");
  for (let i = 0; i < opts.total; i += 1) {
    const dot = document.createElement("span");
    dot.className = `xb-tour-dot${
      i < opts.index ? " is-done" : i === opts.index ? " is-active" : ""
    }`;
    dots.append(dot);
  }
  footer.prepend(dots);

  // Next goes first in DOM order so keyboard focus lands on it rather than
  // Back; CSS `order` keeps Back on the left visually.
  footerButtons.prepend(nextButton);
  nextButton.innerHTML = `<span>${nextButton.textContent}</span>${tourIconSvg(
    opts.last ? "check" : "arrow-right",
  )}`;

  // "Skip" is positioned top-right by CSS but comes last in the DOM, after
  // the buttons, so it is never the element driver.js focuses first.
  if (!opts.last) {
    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "xb-tour-skip";
    skip.textContent = "Skip";
    // Routes through driver.js's own close handling so the exit is recorded
    // with reason "close" and counts as seen.
    skip.addEventListener("click", () => closeButton.click());
    wrapper.append(skip);
  }
}
