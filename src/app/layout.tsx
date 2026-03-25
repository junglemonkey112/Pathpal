import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathPal – US College Admissions Consulting",
  description: "PathPal connects students with experienced college consultants to navigate US university admissions. Get personalized guidance on essays, school selection, and more.",
  openGraph: {
    title: "PathPal – US College Admissions Consulting",
    description: "Connect with affordable college consultants. AI-powered matching, peer community, and expert guidance from $30/hr.",
    type: "website",
    siteName: "PathPal",
  },
  twitter: {
    card: "summary_large_image",
    title: "PathPal – US College Admissions Consulting",
    description: "Connect with affordable college consultants. AI-powered matching, peer community, and expert guidance from $30/hr.",
  },
  keywords: ["college admissions", "college consulting", "university applications", "SAT prep", "essay editing", "college mentor"],
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
          <UserProvider>
            {children}
          </UserProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
