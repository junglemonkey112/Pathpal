"use client";

import { useLanguage, type Locale } from "@/context/LanguageContext";

const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "EN", flag: "🇺🇸" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
];

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
            locale === l.value
              ? "bg-emerald-500 text-white"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          }`}
          title={l.label}
        >
          <span className="mr-1">{l.flag}</span>
          {l.label}
        </button>
      ))}
    </div>
  );
}
