import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/lib/queryClientProvider.tsx/quertClientProvider";
import { Providers } from "@/components/Layout/provider";
import { GlobalLogout } from "@/components/Dashboard/LogOutModal/global-logout-modal";
import { OnboardingModalProvider } from "@/components/Dashboard/PersonalInfoModal/onboarding-modal-provider";
import { Toaster } from "sonner";
import { GlobalNotificationsModal } from "@/components/Layout/GlobalNotification";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

// Geist, self-hosted (SIL OFL, see app/fonts/GEIST-LICENSE.txt). Balance
// figures and page headings use it through the `font-display` utility; body
// text stays on the system stack.
const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xbanka",
  description: "Trade crypto and giftcards",
  icons: {
    icon: "/favicon-square.png",
  },
  // iOS: open from the home-screen icon without Safari's browser chrome.
  appleWebApp: {
    capable: true,
    title: "XBanka",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#121315" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={geist.variable}>
      <body>
        <QueryProvider>
          <Providers>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem("theme-preference");
                  
                  let theme = "dark";

                  if (storedTheme) {
                    const parsed = JSON.parse(storedTheme);
                    theme = parsed.state?.theme || "dark";
                  }

                  document.documentElement.setAttribute(
                    "data-theme",
                    theme
                  );
                } catch (e) {}
              })();
            `,
              }}
            />

            {children}
            {/* closeButton adds a dismiss control to every toast app-wide,
                so it does not have to be opted into at each call site. */}
            <Toaster richColors closeButton position="top-right" />
            <GlobalNotificationsModal />
            <GlobalLogout />
            <OnboardingModalProvider />
            <ServiceWorkerRegistration />
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
