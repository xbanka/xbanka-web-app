import { AuthHero } from "./auth-hero";

/**
 * Sign-in / sign-up layout: on wide screens the 3D Xbanka hero sits on the
 * left and the form on the right, in one screen-high view with no page
 * scrollbar. A form taller than the screen (sign-up) scrolls on its own side,
 * scrollbar hidden. Below `lg` it is just the form, as before.
 */
export function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6 lg:overflow-hidden lg:p-6 xl:grid-cols-[minmax(0,680px)_minmax(0,1fr)]">
      <aside className="hidden lg:flex lg:min-h-0">
        <AuthHero className="w-full" />
      </aside>
      <div className="min-h-dvh lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
        <div className="grid min-h-dvh place-items-center max-sm:block lg:min-h-full lg:py-2">
          {children}
        </div>
      </div>
    </div>
  );
}
