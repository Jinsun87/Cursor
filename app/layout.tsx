import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { siteUrl } from "@/lib/site";
import { AdSenseHead } from "@/components/AdSenseHead";
import { EzoicBoot } from "@/components/EzoicBoot";
import { EzoicHead } from "@/components/EzoicHead";

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
  metadataBase: new URL(siteUrl()),
  title: "Lampstand — Know the text.",
  description:
    "Christian Scripture quizzes: long sittings, pack mastery, coins, and Premium. Original questions. Not a church and not affiliated with any denomination.",
  alternates: { canonical: "/" },
};

const themeBoot = `(function(){try{var t=localStorage.getItem('lampstand-theme')||localStorage.getItem('quizforge-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <AdSenseHead />
        <EzoicHead />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppProvider>
            <EzoicBoot />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
