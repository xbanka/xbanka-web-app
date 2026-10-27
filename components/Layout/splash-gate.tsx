"use client";

import {
  useEffect,
  useState,
  type AnimationEvent,
  type ReactNode,
} from "react";
import { XbankaSplash } from "@/components/ui/xbanka-splash";
import { UseProfileUser } from "@/lib/services/profile.service";
import { UseGetAllWalletBalances } from "@/lib/services/wallet.service";
import { consumeSplashGreeting, type SplashGreeting } from "@/lib/splash";
import { cn } from "@/lib/utils";

// The logo needs this long to finish drawing in and show the welcome line.
const MIN_HOLD_MS = 1400;
const MIN_HOLD_REDUCED_MS = 400;
// A slow API must not trap people on the logo; the dashboard shows its own
// loading states after this.
const MAX_HOLD_MS = 3000;
const EXIT_FALLBACK_MS = 400;

/**
 * Plays the Xbanka logo over the dashboard while it first loads: on sign-in,
 * and on every fresh open of the app. The dashboard renders beneath it so its
 * data is fetching the whole time, and the splash lifts once the profile and
 * balances have arrived (or the hold times out), handing off into the
 * dashboard's own rise-in.
 *
 * It renders on the server too, so a cold open shows the logo drawing in
 * before any JavaScript has loaded. Moving between dashboard pages keeps this
 * layout mounted, so the splash does not replay.
 */
export function SplashGate({ children }: { children: ReactNode }) {
  const [splash, setSplash] = useState<"playing" | "exiting" | "done">("playing");
  // "new" is only requested immediately before a client-side navigation into
  // the dashboard, so a server render (which cannot read it) always agrees
  // with the client's "back" on a cold load.
  const [greeting] = useState<SplashGreeting>(() =>
    typeof window === "undefined" ? "back" : consumeSplashGreeting(),
  );

  return (
    <>
      <div className={cn(splash !== "playing" && "motion-safe:animate-fade-up")}>
        {children}
      </div>
      {splash !== "done" && (
        <SplashOverlay
          greeting={greeting}
          exiting={splash === "exiting"}
          onReady={() => setSplash("exiting")}
          onExited={() => setSplash("done")}
        />
      )}
    </>
  );
}

function SplashOverlay({
  greeting,
  exiting,
  onReady,
  onExited,
}: {
  greeting: SplashGreeting;
  exiting: boolean;
  onReady: () => void;
  onExited: () => void;
}) {
  // Deduped with the dashboard's own queries; this only observes them.
  const { data: profile, isPending: profilePending } = UseProfileUser();
  const { isPending: walletPending } = UseGetAllWalletBalances();
  const [minHoldDone, setMinHoldDone] = useState(false);
  const [maxHoldDone, setMaxHoldDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = setTimeout(
      () => setMinHoldDone(true),
      reduce ? MIN_HOLD_REDUCED_MS : MIN_HOLD_MS,
    );
    const max = setTimeout(() => setMaxHoldDone(true), MAX_HOLD_MS);
    return () => {
      clearTimeout(min);
      clearTimeout(max);
    };
  }, []);

  const settled = !profilePending && !walletPending;
  const ready = minHoldDone && (settled || maxHoldDone);

  useEffect(() => {
    if (ready && !exiting) onReady();
  }, [ready, exiting, onReady]);

  // Unmount once the fade has finished, with a fallback in case animations
  // never run (e.g. a browser with them switched off).
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(onExited, EXIT_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [exiting, onExited]);

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.animationName === "fade-out") onExited();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-200 flex items-center justify-center bg-background px-8",
        exiting && "animate-fade-out",
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="w-50 sm:w-65">
        <XbankaSplash
          name={profile?.data?.firstName || undefined}
          welcomeText={greeting === "new" ? "Welcome to Xbanka" : "Welcome back"}
          exiting={exiting}
        />
      </div>
    </div>
  );
}
