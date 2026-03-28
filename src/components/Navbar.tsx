"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, X, Menu, LogOut, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Shared navigation bar used across all pages.
 * `homeLinks` — pass true on the landing page so anchor links scroll
 * in-page; on inner pages they navigate to /#section instead.
 */
export default function Navbar({ homeLinks = false }: { homeLinks?: boolean }) {
  const { user, signOut } = useUser();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const prefix = homeLinks ? "" : "/";

  const navLinks = [
    { label: t("nav.allCounsellors"), href: `${prefix}#counsellors` },
    { label: t("nav.community"),      href: "/forum" },
    { label: t("nav.howItWorks"),     href: `${prefix}#how-it-works` },
    { label: t("nav.forParents"),     href: `${prefix}#for-parents` },
    { label: t("nav.successStories"), href: `${prefix}#success-stories` },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">PathPal</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <>
                <Link
                  href="/become-counsellor"
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  {t("nav.becomeCounsellor")}
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title={t("nav.signOut")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/become-counsellor"
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  {t("nav.becomeCounsellor")}
                </Link>
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  {t("nav.signUp")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <LanguageSwitcher className="mb-2" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-slate-600 font-medium py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/become-counsellor"
            onClick={() => setMobileOpen(false)}
            className="block text-slate-600 font-medium py-1.5"
          >
            {t("nav.becomeCounsellor")}
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 py-1.5">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
              </div>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="block w-full text-left text-slate-600 font-medium py-1.5"
              >
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-slate-600 font-medium py-1.5"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="block bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium text-sm text-center"
              >
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
