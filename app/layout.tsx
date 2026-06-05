import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/queryClientProvider.tsx/quertClientProvider";
import { Providers } from "@/components/Layout/provider";
import { GlobalLogout } from "@/components/Dashboard/LogOutModal/global-logout-modal";
import { OnboardingModalProvider } from "@/components/Dashboard/PersonalInfoModal/onboarding-modal-provider";
import { Toaster } from "sonner";
import { GlobalNotificationsModal } from "@/components/Layout/GlobalNotification";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import InstallDebugger from "@/components/BeforeInstallPrompt";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Xbanka",
  description: "Trade crypto and giftcards",
  icons: {
    icon: "/favicon-square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
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
            <Toaster richColors position="top-right" />
            <GlobalNotificationsModal />
            <GlobalLogout />
            <OnboardingModalProvider />
            <ServiceWorkerRegistration />
            <InstallDebugger />
            <InstallPrompt />
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
