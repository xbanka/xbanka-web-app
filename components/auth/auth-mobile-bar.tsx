"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

const backClass =
  "grid h-10 w-10 place-items-center rounded-md border border-border text-card-text hover:bg-border";

/**
 * Top bar of the auth forms below `lg`: back, the Xbanka logo, and the
 * theme switch. (On wide screens the hero carries the logo and the switch
 * sits at the page's top right.)
 */
export function AuthMobileBar({
  onBack,
  backHref,
  inFlow = false,
}: {
  onBack?: (() => void) | null;
  backHref?: string;
  /** Under the phone hero, which already shows the logo. */
  inFlow?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 lg:hidden">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="Back" className={backClass}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : backHref ? (
          <Link href={backHref} aria-label="Back" className={backClass}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
        {!inFlow && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/xbanka_logo.png" alt="Xbanka" className="h-auto w-24 dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/xbanka_white.png" alt="Xbanka" className="hidden h-auto w-24 dark:block" />
          </>
        )}
      </div>
      <ThemeToggle className="m-0 px-2" />
    </div>
  );
}
