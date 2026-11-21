"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AuthHero } from "./auth-hero";

/**
 * Phones (below `lg`): the Welcome screen from the onboarding design — the
 * 3D hero, what Xbanka does, then Log in / Sign up — in front of the sign-in
 * form. "Log in" reveals the form in place; "Sign up" goes to sign-up. Wide
 * screens never see it: the hero is beside the form there.
 */
export function MobileWelcome({ children }: { children: React.ReactNode }) {
  const [welcome, setWelcome] = useState(true);

  return (
    <>
      {welcome && (
        <div className="flex min-h-dvh flex-col gap-6 bg-background px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)] lg:hidden">
          <AuthHero variant="mobile" />
          <div className="mt-auto grid grid-cols-[1fr_1.4fr] gap-3 px-1">
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
            <Link href="/sign-up" className={cn(buttonVariants(), "h-13 text-base font-semibold")}>
              Sign up
            </Link>
          </div>
        </div>
      )}
      <div className={cn(welcome && "max-lg:hidden")}>{children}</div>
    </>
  );
}
