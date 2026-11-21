"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { PrivacyPolicyLink } from "@/components/legal/privacy-policy-link";
import SignIn from "../sign-in";
import SignUp from "../sign-up";
import { AuthHero } from "./auth-hero";
import { AuthFlowContext } from "./auth-flow-context";

type Mode = "welcome" | "login" | "signup";

/**
 * Phones (below `lg`): the Welcome screen from the onboarding design — the
 * 3D hero, what Xbanka does, Continue with Google, Log in / Sign up. Tapping
 * Log in or Sign up keeps the animation (the card shrinks to a banner) and
 * opens that form underneath, on the same page. The forms switch between
 * each other and back to Welcome through AuthFlowContext.
 *
 * `page` is which form this route renders as `children` (its own form, with
 * its props); the other one is rendered here when the user switches to it.
 * Only one form is mounted at a time. Wide screens only ever see `children`
 * (the hero is beside the form there).
 */
export function MobileWelcome({
  children,
  page,
}: {
  children: React.ReactNode;
  page: "signin" | "signup";
}) {
  const own: Mode = page === "signin" ? "login" : "signup";
  const [mode, setMode] = useState<Mode>(page === "signin" ? "welcome" : "signup");
  const { loginWithGoogle } = useGoogleAuth();

  // Opening a form brings it into view from the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [mode]);

  const flow = {
    toWelcome: () => setMode("welcome"),
    toLogin: () => setMode("login"),
    toSignup: () => setMode("signup"),
  };

  return (
    <AuthFlowContext.Provider value={flow}>
      {/* Hero, phones only: full on Welcome, a banner above an open form */}
      <div className="w-full px-3 pt-3 lg:hidden">
        <AuthHero variant="mobile" compact={mode !== "welcome"} />
      </div>

      {mode === "welcome" && (
        <div className="flex w-full flex-col gap-3 px-4 pt-5 pb-[calc(env(safe-area-inset-bottom)+20px)] lg:hidden">
          <button
            type="button"
            onClick={() => loginWithGoogle("signin")}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-13 w-full text-base font-semibold text-card-text",
            )}
          >
            <Image width={18} height={18} alt="" src="/googleIcon.svg" unoptimized />
            Continue with Google
          </button>
          <div className="mt-1 grid grid-cols-[1fr_1.4fr] gap-3">
            <button
              type="button"
              onClick={flow.toLogin}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "h-13 bg-border text-base font-semibold text-card-text hover:bg-border/80",
              )}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={flow.toSignup}
              className={cn(buttonVariants(), "h-13 text-base font-semibold")}
            >
              Sign up
            </button>
          </div>
          <p className="pt-1 text-center text-xs leading-5 text-placeholder">
            By continuing you agree to our <span className="text-Green">Terms of Service</span> and{" "}
            <PrivacyPolicyLink />.
          </p>
        </div>
      )}

      {/* The form: this page's own one (always on wide screens), or the other
          one when a phone user switched to it. */}
      {mode === "welcome" || mode === own ? (
        <div className={cn("w-full", mode === "welcome" && "max-lg:hidden")}>{children}</div>
      ) : mode === "signup" ? (
        <div className="w-full">
          <SignUp />
        </div>
      ) : (
        <div className="w-full">
          <SignIn />
        </div>
      )}
    </AuthFlowContext.Provider>
  );
}
