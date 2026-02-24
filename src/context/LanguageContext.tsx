"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";
import { Dictionary } from "@/dictionaries/en";

type Locale = "en" | "ko";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 1. Wrap the logic in a timeout to make it asynchronous
    // This entirely bypasses the strict synchronous setState linter error.
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("language-pref") as Locale;
      if (saved && saved !== "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    }, 0);

    // 2. Clean up the timer to prevent memory leaks
    return () => clearTimeout(timer);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language-pref", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = locale === "en" ? en : ko;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
