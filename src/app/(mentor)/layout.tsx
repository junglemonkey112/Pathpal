"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ui } from "@/data/mentor-i18n";

function LangToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center rounded-[4px] border border-[rgba(0,0,0,0.1)] overflow-hidden text-[12px] font-semibold">
      <button
        onClick={() => setLang("zh")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "zh"
            ? "bg-[rgba(0,0,0,0.95)] text-white"
            : "bg-white text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.8)]"
        }`}
      >
        中文
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 transition-colors ${
          lang === "en"
            ? "bg-[rgba(0,0,0,0.95)] text-white"
            : "bg-white text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.8)]"
        }`}
      >
        EN
      </button>
    </div>
  );
}

function MentorNav() {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[rgba(0,0,0,0.06)]">
      <div className="max-w-[1200px] mx-auto px-6 h-[56px] flex items-center justify-between">
        <Link
          href="/mentors"
          className="text-[18px] font-bold text-[rgba(0,0,0,0.95)] tracking-tight"
        >
          PathPal
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/mentors"
            className="text-[15px] font-medium text-[rgba(0,0,0,0.95)] hover:text-[#0075de] transition-colors"
          >
            {t(ui.nav_find.zh, ui.nav_find.en)}
          </Link>
          <Link
            href="/become-consultant"
            className="hidden sm:inline text-[15px] text-[#615d59] hover:text-[rgba(0,0,0,0.95)] transition-colors"
          >
            {t(ui.nav_become.zh, ui.nav_become.en)}
          </Link>
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}

function MentorFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 py-10 bg-[#f6f5f4]">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-[14px] text-[#615d59]">
          {t(ui.footer_tagline.zh, ui.footer_tagline.en)}
        </p>
      </div>
    </footer>
  );
}

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div
        className="min-h-screen bg-white"
        style={{
          fontFamily:
            "Inter, -apple-system, 'PingFang SC', system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          color: "rgba(0,0,0,0.95)",
        }}
      >
        <MentorNav />
        <main>{children}</main>
        <MentorFooter />
      </div>
    </LanguageProvider>
  );
}
