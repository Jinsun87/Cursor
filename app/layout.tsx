import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";

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
  title: "QuizForge — Train your mind. Master a topic.",
  description:
    "Expert-style quiz packs, certificates of mastery, coins, premium, and a cognitive-health mission. An original recreation of the QuizGriz business model.",
};

const themeBoot = `(function(){try{var t=localStorage.getItem('quizforge-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme',matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppProvider>
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
