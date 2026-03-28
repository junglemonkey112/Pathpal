import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathPal – International Student Counselling",
  description: "PathPal connects international students with verified student counsellors from top US universities. Peer guidance for college admissions in 4 languages.",
  openGraph: {
    title: "PathPal – International Student Counselling",
    description: "Connect with verified student counsellors from Harvard, Stanford, MIT and more. Peer guidance from $25/session.",
    type: "website",
    siteName: "PathPal",
  },
  twitter: {
    card: "summary_large_image",
    title: "PathPal – International Student Counselling",
    description: "Connect with verified student counsellors from Harvard, Stanford, MIT and more. Peer guidance from $25/session.",
  },
  keywords: ["college admissions", "international students", "student counsellor", "university applications", "study abroad", "US college", "Harvard", "Stanford"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <LanguageProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </LanguageProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
