import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "QuizForge — Train your mind. Master a topic.",
  description:
    "Expert-style quiz packs, certificates of mastery, coins, premium, and a cognitive-health mission. An original recreation of the QuizGriz business model.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Header />
          <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
