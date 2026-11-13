import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "@/lib/queryClientProvider.tsx/quertClientProvider";
import { Providers } from "@/components/Layout/provider";
import { GlobalLogout } from "@/components/Dashboard/LogOutModal/global-logout-modal";
import { OnboardingModalProvider } from "@/components/Dashboard/PersonalInfoModal/onboarding-modal-provider";
import { Toaster } from "sonner";
import { GlobalNotificationsModal } from "@/components/Layout/GlobalNotification";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

const GTM_ID = "GTM-K46973BF";
const META_PIXEL_ID = "1447176090814875";

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
      <head>
        {/* Google Tag Manager. The `gtm.js` event is what fires the
            container's page-view triggers, so it is pushed before load. */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          `}
        </Script>
        <Script
          id="gtm"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
        {/* Meta Pixel. Later client-side route changes are picked up by the
            pixel's own history tracking. */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
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
