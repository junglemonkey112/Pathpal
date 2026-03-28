import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIChat from "@/components/AIChat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entora - Your Complete College Admissions Companion",
  description:
    "Free community, grade-by-grade roadmap, school explorer, and expert sessions to guide you through college admissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIChat />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
