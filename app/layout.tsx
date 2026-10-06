import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { CANONICAL_ORIGIN } from "@/lib/site";
import { AdSenseLoader } from "@/components/AdSenseLoader";
import { EzoicBoot } from "@/components/EzoicBoot";
import { EzoicHead } from "@/components/EzoicHead";
import { GA4Head } from "@/components/GA4Head";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Analytics } from "@vercel/analytics/next";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // SEO always points at lampstandbible.com, even when served from staging.
  metadataBase: new URL(CANONICAL_ORIGIN),
  title: { default: "Lampstand — Know the text.", template: "%s · Lampstand" },
  description:
    "Christian Scripture quizzes and illuminated Bible reading: daily stories, long sittings, coins, and active recall. Not a church and not affiliated with any denomination.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lampstand",
  },
  openGraph: { siteName: "Lampstand", type: "website", locale: "en_US" },
};

export const viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const themeBoot = `(function(){try{var t=localStorage.getItem('lampstand-theme')||localStorage.getItem('quizforge-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

import { BottomTabBar } from "@/components/navigation/BottomTabBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <EzoicHead />
        <GA4Head />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppProvider>
            <AdSenseLoader />
            <AnalyticsTracker />
            <Analytics />
            <EzoicBoot />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 pb-24 md:pb-8">
              {children}
            </main>
            <Footer />
            <BottomTabBar />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
