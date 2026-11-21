import { AuthHero } from "./auth-hero";

/**
 * Sign-in / sign-up layout: on wide screens the 3D Xbanka hero sits on the
 * left (pinned while a long form scrolls) and the form on the right. Below
 * `lg` it is just the form, as before, so nothing pushes it off a phone.
 */
export function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6 lg:p-6 xl:grid-cols-[minmax(0,680px)_minmax(0,1fr)]">
      <aside className="hidden lg:sticky lg:top-6 lg:flex lg:h-[calc(100dvh-48px)] lg:min-h-[680px]">
        <AuthHero className="w-full" />
      </aside>
      <div className="grid min-h-dvh place-items-center max-sm:block lg:min-h-0 lg:py-4">
        {children}
      </div>
    </div>
  );
}
