import { AuthHero } from "./auth-hero";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileWelcome } from "./mobile-welcome";

/**
 * Sign-in / sign-up layout: on wide screens the 3D Xbanka hero sits on the
 * left and the form on the right, in one screen-high view with no page
 * scrollbar. A form taller than the screen (sign-up) scrolls on its own side,
 * scrollbar hidden. Below `lg` it is just the form, as before. The theme
 * switch sits at the top right of the page on desktop.
 */
export function AuthSplit({
  children,
  page,
}: {
  children: React.ReactNode;
  /** Sign-in / sign-up: phones get the hero and switch forms in place. */
  page?: "signin" | "signup";
}) {
  return (
    <div className="relative min-h-dvh bg-background lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6 lg:overflow-hidden lg:p-6 xl:grid-cols-[minmax(0,680px)_minmax(0,1fr)]">
      {/* Desktop: the theme switch lives at the page's top right (the forms
          keep their own for phones). */}
      <ThemeToggle className="absolute right-6 top-6 z-20 m-0 hidden lg:flex" />
      <aside className="hidden lg:flex lg:min-h-0">
        <AuthHero className="w-full" />
      </aside>
      <div className="min-h-dvh lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        <div className="grid min-h-dvh place-items-center max-sm:block lg:min-h-full lg:py-2">
          {page ? <MobileWelcome page={page}>{children}</MobileWelcome> : children}
        </div>
      </div>
    </div>
  );
}
