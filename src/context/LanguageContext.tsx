"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "zh" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "zh",
  setLang: () => {},
  t: (zh) => zh,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("pathpal-lang") as Lang | null;
    if (saved === "zh" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pathpal-lang", l);
  };

  const t = (zh: string, en: string) => (lang === "zh" ? zh : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
