"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AuthHero } from "./auth-hero";
import Image from "next/image";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { PrivacyPolicyLink } from "@/components/legal/privacy-policy-link";

/**
 * Phones (below `lg`): the Welcome screen from the onboarding design — the
 * 3D hero, what Xbanka does, then Continue with Google, Log in / Sign up and
 * the terms — in front of the sign-in form. "Log in" reveals the form (with
 * Forgot password) in place; "Sign up" goes to sign-up. Wide
 * screens never see it: the hero is beside the form there.
 */
/** Lets the form behind the Welcome screen go back to it (phones only). */
const BackToWelcome = createContext<(() => void) | null>(null);
export const useBackToWelcome = () => useContext(BackToWelcome);

export function MobileWelcome({ children }: { children: React.ReactNode }) {
  const [welcome, setWelcome] = useState(true);
  const { loginWithGoogle } = useGoogleAuth();

  return (
    <>
      {welcome && (
        <div className="flex min-h-dvh flex-col gap-5 bg-background px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)] lg:hidden">
          <AuthHero variant="mobile" />
          <div className="mt-auto space-y-3 px-1">
            <button
              type="button"
              onClick={() => loginWithGoogle("signin")}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-13 w-full text-base font-semibold text-card-text",
              )}
            >
              <Image
                width={18}
                height={18}
                alt=""
                src="/googleIcon.svg"
                unoptimized
              />
              Continue with Google
            </button>
            <div className="!mt-4 grid grid-cols-[1fr_1.4fr] gap-3">
              <button
                type="button"
                onClick={() => setWelcome(false)}
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "h-13 bg-border text-base font-semibold text-card-text hover:bg-border/80",
                )}
              >
                Log in
              </button>
              <Link
                href="/sign-up"
                className={cn(buttonVariants(), "h-13 text-base font-semibold")}
              >
                Sign up
              </Link>
            </div>
            <p className="pt-1 text-center text-xs leading-5 text-placeholder">
              By continuing you agree to our{" "}
              <span className="text-Green">Terms of Service</span> and{" "}
              <PrivacyPolicyLink />.
            </p>
          </div>
        </div>
      )}
      <div className={cn(welcome && "max-lg:hidden")}>
        <BackToWelcome.Provider value={() => setWelcome(true)}>{children}</BackToWelcome.Provider>
      </div>
    </>
  );
}
